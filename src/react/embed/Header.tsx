// Icon Imports

// Main imports
import React, { Component } from "react";
import { Divider, Grid, Theme, Typography, withStyles } from "@material-ui/core";
import { globalContext } from "../contexts";
import { ClassNameMap } from "@material-ui/core/styles/withStyles";

const styles = (theme: Theme) => ({
  gridItem: {
    overflow: "hidden",
    textOverflow: "ellipses",
    padding: theme.spacing(0.5)
  },
  gridItemRight: {
    backgroundColor: theme.palette.common.white
  },
  logo: {
    height: `calc(50% - ${theme.spacing(0.5)}px)`,
    width: "100%",
    backgroundSize: "contain",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat"
  },
  councilLogo: {
    marginBottom: theme.spacing(0.5)
  },
  waterLogo: {
    marginTop: theme.spacing(0.5)
  }
});

interface Props {
  classes: ClassNameMap;
  reference?: string;
  type?: string;
  council?: string;
  water?: string;
}

interface State {

}

class Header extends Component<Props, State> {
  static contextType = globalContext;
  constructor(props: Props) {
    super(props)

    this.state = {}

  }

  render() {
    const { classes, reference, type } = this.props;
    let council = this.props.council || "";
    let water = this.props.water || "";

    if(council.includes("(")) council = council.slice(0, council.indexOf("("));

    const councilUrl = chrome.runtime.getURL(`images/councils/${council.replace(/ /g, "")}.png`);
    const waterUrl = chrome.runtime.getURL(`images/waters/${water.replace(/ /g, "")}.png`);


    return (
      <Grid container spacing={1} direction="row" wrap="nowrap">
        <Grid item xs={8} className={classes.gridItem}>
          <Typography
            variant="subtitle1"
            component="h2"
            align="center"
            noWrap
          ><b>{reference || "000000"} - {type || "N/A"}</b></Typography>
          <Typography
            variant="caption"
            component="h3"
            align="center"
            noWrap
          >{council || "No Council"}<br/>{water || "No Water"}</Typography>
        </Grid>
        <Grid item>
          <Divider orientation="vertical" style={{ height: "100%" }} />
        </Grid>
        <Grid item xs={4} className={`${classes.gridItem} ${classes.gridItemRight}`}>
          <div
            className={`${classes.logo} ${classes.councilLogo}`}
            style={{ backgroundImage: `url(${councilUrl})` }}
          />
          <div
            className={`${classes.logo} ${classes.waterLogo}`}
            style={{ backgroundImage: `url(${waterUrl})` }}
          />
        </Grid>
      </Grid>
    )
  }

}

export default withStyles(styles, { withTheme: true })(Header);