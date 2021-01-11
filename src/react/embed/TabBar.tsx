// Icon Imports
import InfoIcon from "@material-ui/icons/Info";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import ListIcon from "@material-ui/icons/List";
import NotificationsActiveIcon from "@material-ui/icons/NotificationsActive";

// Main imports
import React, { Component, MouseEvent } from "react";
import { Divider, Grid, IconButton, Theme, withStyles } from "@material-ui/core";
import { GlobalContext, globalContext } from "../contexts";
import { ClassNameMap } from "@material-ui/core/styles/withStyles";

const styles = (theme: Theme) => ({
  divider: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  }
});

interface PropsI {
  classes: ClassNameMap;
  onSelect: (index: number) => any;
  currentTab: number;
}

interface StateI {
  
}

class TabBar extends Component<PropsI, StateI> {
  static contextType = globalContext;
  constructor(props: PropsI) {
    super(props)

    this.state = {}

    this.tabSelect = this.tabSelect.bind(this);
  }

  tabSelect(index: number) {
    return (event: MouseEvent<HTMLButtonElement>) => {
      this.props.onSelect(index);
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
            <IconButton onClick={this.tabSelect(0)} disabled={order == null} >
              <InfoIcon />
            </IconButton>
          </Grid>
          <Grid item>
            <IconButton onClick={this.tabSelect(1)} disabled={order == null} >
              <AttachMoneyIcon />
            </IconButton>
          </Grid>
          <Grid item>
            <IconButton onClick={this.tabSelect(2)} >
              <ListIcon />
            </IconButton>
          </Grid>
        </Grid>
      </> 
    )
  }
}

export default withStyles(styles, { withTheme: true })(TabBar);