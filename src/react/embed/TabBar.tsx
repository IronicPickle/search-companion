// Icon Imports
import InfoIcon from "@material-ui/icons/Info";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import ListIcon from "@material-ui/icons/List";
import HomeIcon from "@material-ui/icons/Home";
import MapIcon from "@material-ui/icons/Map";
import OpacityIcon from "@material-ui/icons/Opacity";

// Main imports
import React, { Component, MouseEvent } from "react";
import { Divider, Grid, IconButton, Theme, Tooltip, withStyles } from "@material-ui/core";
import { GlobalContext, globalContext } from "../contexts";
import { ClassNameMap } from "@material-ui/core/styles/withStyles";

const styles = (theme: Theme) => ({
  divider: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  }
});

interface Props {
  classes: ClassNameMap;
  onSelect: (index: number) => any;
  currentTab: number;
}

interface State {
  
}

class TabBar extends Component<Props, State> {
  static contextType = globalContext;
  constructor(props: Props) {
    super(props)

    this.state = {}

    this.tabSelect = this.tabSelect.bind(this);
    this.openGoogleMaps = this.openGoogleMaps.bind(this);
    this.openDuct = this.openDuct.bind(this);
  }

  tabSelect(index: number) {
    return (event: MouseEvent<HTMLButtonElement>) => {
      this.props.onSelect(index);
    }
  }

  openGoogleMaps() {
    const { order } = this.context as GlobalContext;
    const postcode = order?.property.postCode;
    if(postcode != null) {
      window.open(`https://www.google.com/maps/place/${postcode}`);
    }
  }

  openDuct() {
    const { order } = this.context as GlobalContext;
    console.log(encodeURIComponent(location.href))
    window.open(`duct://upload/?ref=${order?.reference}&url=${encodeURIComponent(location.href)}`);
  }

  render() {
    const { classes, currentTab } = this.props;
    const { settings, order } = this.context as GlobalContext;

    return (
      <>
        <Grid container direction="column" style={{ height: "100%" }} >
          <Divider className={classes.divider} />
          <Grid item>
            <IconButton onClick={this.tabSelect(0)} disabled={order == null} >
              <Tooltip title="Property" PopperProps={{ disablePortal: true }} >
                <InfoIcon />
              </Tooltip>
            </IconButton>
          </Grid>
          <Grid item>
            <IconButton onClick={this.tabSelect(1)} disabled={order == null} >
              <Tooltip title="Products" PopperProps={{ disablePortal: true }} >
                <AttachMoneyIcon />
             </Tooltip>
            </IconButton>
          </Grid>
          <Grid item>
            <IconButton onClick={this.tabSelect(2)} >
              <Tooltip title="Planning" PopperProps={{ disablePortal: true }} >
                <ListIcon />
              </Tooltip>
            </IconButton>
          </Grid>
          <Grid item>
            <IconButton onClick={this.tabSelect(3)} >
              <Tooltip title="Building" PopperProps={{ disablePortal: true }} >
                <HomeIcon />
              </Tooltip>
            </IconButton>
          </Grid>
          <Grid item>
            <IconButton onClick={this.openGoogleMaps} disabled={order?.property.postCode == null} >
              <Tooltip title="Maps" PopperProps={{ disablePortal: true }} >
                <MapIcon />
              </Tooltip>
            </IconButton>
          </Grid>
          <Grid item>
            <IconButton onClick={this.openDuct} disabled={order?.reference == null || !isOnlineMapping()} >
              <Tooltip title="Duct" PopperProps={{ disablePortal: true }} >
                <OpacityIcon />
              </Tooltip>
            </IconButton>
          </Grid>
        </Grid>
      </> 
    )
  }
}

function isOnlineMapping() {
  return location.href.includes("https://indexcms-master.s3.eu-west-2.amazonaws.com/CMSDocumentStore/");
}

export default withStyles(styles, { withTheme: true })(TabBar);