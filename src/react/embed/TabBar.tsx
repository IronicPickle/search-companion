// Icon Imports
import InfoIcon from "@material-ui/icons/Info";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import ListIcon from "@material-ui/icons/List";
import HomeIcon from "@material-ui/icons/Home";
import HistoryIcon from "@material-ui/icons/History";
import MapIcon from "@material-ui/icons/Map";
import OpacityIcon from "@material-ui/icons/Opacity";

// Main imports
import React, { Component, MouseEvent } from "react";
import { Divider, Grid, IconButton, SvgIconTypeMap, Theme, Tooltip, withStyles } from "@material-ui/core";
import { GlobalContext, globalContext } from "../contexts";
import { ClassNameMap } from "@material-ui/core/styles/withStyles";
import { createNotification } from "../../lib/utils";

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
    this.openDuct = this.openDuct.bind(this);
  }

  tabs: { name: string; icon: JSX.Element; }[] = [
    { name:"Property", icon: <InfoIcon/> },
    { name:"Products", icon: <AttachMoneyIcon/> },
    { name:"Planning", icon: <ListIcon/> },
    { name:"Building", icon: <HomeIcon/> },
    { name:"History", icon: <HistoryIcon/> }
  ]

  tabSelect(index: number) {
    return (event: MouseEvent<HTMLButtonElement>) => {
      const { currentTab } = this.props;
      if(currentTab === index) index = -1;
      this.props.onSelect(index);
    }
  }

  openDuct() {
    const { order } = this.context as GlobalContext;
    window.open(`duct://upload/?ref=${order?.reference}&url=${encodeURIComponent(location.href)}`);
    const notification = createNotification({ severity: "success", text: "Sent PDF to Duct" }, 0);
    chrome.storage.local.set({ notification });
  }

  render() {
    const { classes, currentTab } = this.props;
    const { order } = this.context as GlobalContext;

    return (
      <>
        <Grid container direction="column" style={{ height: "100%" }} >
          <Divider className={classes.divider} />
          { this.tabs.map((tab, i) => {
              return <Grid item key={i}>
                <IconButton onClick={this.tabSelect(i)} color={(currentTab === i) ? "secondary" : "default"} >
                  <Tooltip title={tab.name} PopperProps={{ disablePortal: true }} >
                    {tab.icon}
                  </Tooltip>
                </IconButton>
              </Grid>
            }) }
          <Divider className={classes.divider} />
          <Grid item>
            <IconButton
              href={`https://www.google.com/maps/place/${order?.property.postCode || ""}`}
              target="_blank"
              disabled={order?.property.postCode == null}
            >
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