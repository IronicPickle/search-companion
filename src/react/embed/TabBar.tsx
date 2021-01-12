// Icon Imports
import InfoIcon from "@material-ui/icons/Info";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import ListIcon from "@material-ui/icons/List";
import HomeIcon from "@material-ui/icons/Home";
import MapIcon from "@material-ui/icons/Map";

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

  render() {
    const { classes, currentTab } = this.props;
    const { settings, order } = this.context as GlobalContext;

    return (
      <>
        <Grid container direction="column" style={{ height: "100%" }} >
          <Divider className={classes.divider} />
          <Grid item>
            <Tooltip title="Property" PopperProps={{ disablePortal: true }} >
              <IconButton onClick={this.tabSelect(0)} disabled={order == null} >
                <InfoIcon />
              </IconButton>
            </Tooltip>
          </Grid>
          <Grid item>
            <Tooltip title="Products" PopperProps={{ disablePortal: true }} >
              <IconButton onClick={this.tabSelect(1)} disabled={order == null} >
                <AttachMoneyIcon />
              </IconButton>
            </Tooltip>
          </Grid>
          <Grid item>
            <Tooltip title="Planning" PopperProps={{ disablePortal: true }} >
              <IconButton onClick={this.tabSelect(2)} >
                <ListIcon />
              </IconButton>
            </Tooltip>
          </Grid>
          <Grid item>
            <Tooltip title="Building" PopperProps={{ disablePortal: true }} >
              <IconButton onClick={this.tabSelect(3)} >
                <HomeIcon />
              </IconButton>
            </Tooltip>
          </Grid>
          <Grid item>
            <Tooltip title="Maps" PopperProps={{ disablePortal: true }} >
              <IconButton onClick={this.openGoogleMaps} disabled={order?.property.postCode == null} >
                <MapIcon />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </> 
    )
  }
}

export default withStyles(styles, { withTheme: true })(TabBar);