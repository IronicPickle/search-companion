// Icon Imports

// Main imports
import React, { Component } from "react";
import { Container, Grid, TextField, Theme, Typography, withStyles } from "@material-ui/core";
import { GlobalContext, globalContext } from "../../contexts";
import { ClassNameMap } from "@material-ui/core/styles/withStyles";
import _, { round } from "lodash";
import OsGridRef, { LatLon } from "geodesy/osgridref";
import { createNotification } from "../../../lib/utils";
import { Location, Storage } from "../../../lib/interfaces";

const styles = (theme: Theme) => ({
  mainContainer: {
    paddingRight: 0,
    paddingLeft: 0,
    minWidth: theme.spacing(48),
    height: 252
  },

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

interface Props {
  classes: ClassNameMap;
}

interface State {
  location: {
    [key: string]: any;
    osGridRef: {
      [key: string]: any;
      easting: string;
      northing: string;
    };
    latLon: {
      [key: string]: any;
      latitude: string;
      longitude: string;
    };
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

  componentDidMount() {
    const { order } = this.context as GlobalContext;
    if(order == null) return;

    this.locationToState(order.property.location);
  }

  render() {
    const { classes } = this.props;
    const { location } = this.state;
    const { order } = this.context as GlobalContext;

    let display = (
      <Grid container direction="column" justify="center" className={classes.mainContainer}>
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
        <Container className={classes.mainContainer}>
          <Typography
            variant="body1"
            component="h2"
            align="center"
            className={classes.title}
          >Grid References</Typography>
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
            variant="body1"
            component="h2"
            align="center"
            className={classes.title}
          >Coordinates</Typography>
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
        </Container>
      )
    }

    return display;
  }
}

export default withStyles(styles, { withTheme: true })(Mapping);