// Icon Imports

// Main imports
import React, { Component, CSSProperties } from "react";
import { Button, Container, Grid, TextField, Theme, Toolbar, Typography, withStyles, WithTheme } from "@material-ui/core";
import { GlobalContext, globalContext } from "../../contexts";
import { WithStyles } from "@material-ui/core/styles/withStyles";
import _, { round } from "lodash";
import OsGridRef, { LatLon } from "geodesy/osgridref";
import { createNotification } from "../../../lib/utils";
import { Location } from "../../../lib/interfaces";

const styles = (theme: Theme) => ({
  title: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1)
  },
  fieldContainer: {
    paddingRight: theme.spacing(2),
    paddingLeft: theme.spacing(2)
  },
  buttonContainer: {
    marginTop: theme.spacing(3)
  }
});

interface Props extends WithStyles<typeof styles>, WithTheme {
  style: CSSProperties;
}

interface State {
  location: {
    [key: string]: any;
    osGridRef: {
      [key: string]: any;
      easting: string;
      northing: string;
    }
    latLon: {
      [key: string]: any;
      latitude: string;
      longitude: string;
    }
  }
}

class Mapping extends Component<Props, State> {
  static contextType = globalContext;
  constructor(props: Props) {
    super(props)

    this.state = {
      location: {
        osGridRef: { easting: "", northing: "" },
        latLon: { latitude: "", longitude: "" }
      }
    }

    this.fieldChange = this.fieldChange.bind(this);
    this.fieldSave = this.fieldSave.bind(this);

    this.locationToState = this.locationToState.bind(this);
    this.lookupPostCode = this.lookupPostCode.bind(this);
  }

  fieldChange(type: "osGridRef" | "latLon", key: string, value: string) {
    const { location } = this.state;

    location[type][key] = value;

    this.setState({ location });
  }

  fieldSave(type: "osGridRef" | "latLon", key: string, value: string) {
    const notification = createNotification({ severity: "error", text: "Invalid Coordinate" }, 5);

    const { order } = this.context as GlobalContext;
    if(order == null) return;
    const originalLocation = JSON.parse(JSON.stringify(order.property.location));

    const coord = parseFloat(value);
    if(isNaN(coord)) {
      this.locationToState(originalLocation);
      return chrome.storage.local.set({ notification });
    }

    order.property.location[type][key] = coord;
    const { latLon, osGridRef } = order.property.location;

    try {
      const latLonGeo = new LatLon(latLon.latitude, latLon.longitude);
      const osGridRefGeo = new OsGridRef(round(osGridRef.easting), round(osGridRef.northing));
      
      if(type === "latLon") {
        const converted = latLonGeo.toOsGrid();
        order.property.location.osGridRef = {
          easting: round(converted.easting),
          northing: round(converted.northing)
        }
      } else if(type === "osGridRef") {
        const converted = osGridRefGeo.toLatLon();
        order.property.location.latLon = {
          latitude: converted.latitude,
          longitude: converted.longitude
        }
      }
    } catch(err) {
      this.locationToState(originalLocation);
      return chrome.storage.local.set({ notification });
    }
    chrome.storage.local.set({ order });
    this.locationToState(order.property.location);
    
  }

  locationToState(location: Location) {
    const { latLon, osGridRef } = location;

    this.setState({ location: {
      latLon: {
        latitude: latLon.latitude.toString(),
        longitude: latLon.longitude.toString()
      }, osGridRef: {
        easting: osGridRef.easting.toString(),
        northing: osGridRef.northing.toString()
      }
    } })
  }

  lookupPostCode() {
    const notification = createNotification({ severity: "error", text: "Postcode Lookup Failed" });
    const { order } = this.context as GlobalContext;
    if(order == null) return chrome.storage.local.set({ notification });
    const postCode = order.property.postCode.replace(/ /g, "");
    if(postCode.length === 0) return chrome.storage.local.set({ notification });

    chrome.runtime.sendMessage({ type: "PostCodeLookup", postCode }, (message => {
      const data = message?.data?.result;
      if(data == null) return chrome.storage.local.set({ notification });
      if(data.latitude != null) this.fieldSave("latLon", "latitude", data.latitude);
      if(data.longitude != null) this.fieldSave("latLon", "longitude", data.longitude);
      chrome.storage.local.set({
        notification: createNotification({ severity: "success", text: "Postcode Lookup Successful" })
      });
    }));
  }

  componentDidMount() {
    const { order } = this.context as GlobalContext;
    if(order == null) return;

    this.locationToState(order.property.location);
  }

  render() {
    const { style, classes, theme } = this.props;
    const { location } = this.state;
    const { order } = this.context as GlobalContext;

    let display = (
      <Grid container direction="column" justify="center" style={style}>
        <Typography
          variant="subtitle2"
          component="p"
          align="center"
        >
          Load up an Order on the CMS and this section<br/>
          will display mapping information
        </Typography>
      </Grid>
    )

    if(order != null) {
      const { osGridRef, latLon } = location;
      display = (
        <Container style={style}>
          <Typography
            variant="subtitle2"
            component="h2"
            align="center"
            className={classes.title}
          ><b>Grid References</b></Typography>
          <Grid
            container
            spacing={2}
            direction="row"
            className={classes.fieldContainer}
          >
            <Grid item xs={6}>
              <TextField
                label="Easting"
                name="easting"
                value={osGridRef.easting}
                fullWidth
                inputProps={{ size: 10 }}
                onChange={event => this.fieldChange("osGridRef", event.target.name, event.target.value)}
                onBlur={event => this.fieldSave("osGridRef", event.target.name, event.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Northing"
                name="northing"
                value={osGridRef.northing}
                fullWidth
                inputProps={{ size: 10 }}
                onChange={event => this.fieldChange("osGridRef", event.target.name, event.target.value)}
                onBlur={event => this.fieldSave("osGridRef", event.target.name, event.target.value)}
              />
            </Grid>
          </Grid>
          <Typography
            variant="subtitle2"
            component="h2"
            align="center"
            className={classes.title}
          ><b>Coordinates</b></Typography>
          <Grid
            container
            spacing={2}
            direction="row"
            className={classes.fieldContainer}
          >
            <Grid item xs={6}>
              <TextField
                label="Latitude"
                name="latitude"
                value={latLon.latitude}
                fullWidth
                inputProps={{ size: 10 }}
                onChange={event => this.fieldChange("latLon", event.target.name, event.target.value)}
                onBlur={event => this.fieldSave("latLon", event.target.name, event.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Longitude"
                name="longitude"
                value={latLon.longitude}
                fullWidth
                inputProps={{ size: 10 }}
                onChange={event => this.fieldChange("latLon", event.target.name, event.target.value)}
                onBlur={event => this.fieldSave("latLon", event.target.name, event.target.value)}
              />
            </Grid>
          </Grid>
          <Grid container justify="center" className={classes.buttonContainer}>
            <Toolbar disableGutters>
              <Grid container spacing={2}>
                <Grid item>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={this.lookupPostCode}
                  >From Postcode</Button>
                  <Typography
                    variant="caption"
                    component="p"
                    align="center"
                    style={{ marginTop: theme.spacing(0.5) }}
                  ><b>Not 100% Accurate</b></Typography>
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    color="primary"
                    href={`https://www.google.co.uk/maps/place/${order.property.postCode}`}
                    target="_blank"
                  >Google Maps</Button>
                </Grid>
              </Grid>
            </Toolbar>
          </Grid>
        </Container>
      )
    }

    return display;
  }
}

export default withStyles(styles, { withTheme: true })(Mapping);