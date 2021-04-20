// Icon Imports
import InfoIcon from "@material-ui/icons/Info";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import ListIcon from "@material-ui/icons/List";
import HomeIcon from "@material-ui/icons/Home";
import HistoryIcon from "@material-ui/icons/History";
import MapIcon from "@material-ui/icons/Map";
import FolderIcon from "@material-ui/icons/Folder";

// Main imports
import React, { Component, MouseEvent } from "react";
import { Divider, Grid, IconButton, Theme, Tooltip, withStyles } from "@material-ui/core";
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
  }

  tabs: { name: string; icon: JSX.Element; }[] = [
    { name: "Property", icon: <InfoIcon/> },
    { name: "Products", icon: <AttachMoneyIcon/> },
    { name: "Planning", icon: <ListIcon/> },
    { name: "Building", icon: <HomeIcon/> },
    { name: "History", icon: <HistoryIcon/> },
    { name: "Mapping", icon: <MapIcon /> },
    { name: "Files", icon: <FolderIcon /> }
  ]

  tabSelect(index: number) {
    return (event: MouseEvent<HTMLButtonElement>) => {
      const { currentTab } = this.props;
      if(currentTab === index) index = -1;
      this.props.onSelect(index);
    }
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
        </Grid>
      </> 
    )
  }
}

function isOnlineMapping() {
  return location.href.includes("https://indexcms-master.s3.eu-west-2.amazonaws.com/CMSDocumentStore/");
}

export default withStyles(styles, { withTheme: true })(TabBar);