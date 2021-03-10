// Icon Imports

// Main imports
import React, { Component } from "react";
import { Container, Divider, Grid, Theme, Typography, withStyles } from "@material-ui/core";
import { globalContext } from "../../contexts";
import { ClassNameMap } from "@material-ui/core/styles/withStyles";

const styles = (theme: Theme) => ({
  gridContainer: {
    marginBottom: theme.spacing(1)
  },
  gridItem: {
    overflow: "hidden",
    textOverflow: "ellipses",
    padding: theme.spacing(0.5)
  },
  logo: {
    height: "50%",
    width: "100%",
    backgroundSize: "contain",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundColor: theme.palette.common.white
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
    const { classes, reference, type, council, water } = this.props;

    const councilUrl = chrome.runtime.getURL(`images/councils/${(council || "").replace(/ /g, "")}.png`);
    const waterUrl = chrome.runtime.getURL(`images/waters/${(water || "").replace(/ /g, "")}.png`);

    let display = (
      <>
        <Container>
          <Typography
            variant="subtitle1"
            component="h2"
            align="center"
          ><b>No Order Info Available</b></Typography>
          <Typography
            variant="subtitle2"
            component="h3"
            align="center"
          >Load an order on the CMS to populate this section</Typography>
        </Container>
        <Divider />
      </>
    )

    if(reference != null || type != null || council != null || water != null) display =  (
      <>
        <Grid container direction="row" wrap="nowrap" className={classes.gridContainer}>
          <Grid item xs={8} spacing={1} className={classes.gridItem}>
            <Typography
              variant="subtitle1"
              component="h2"
              align="center"
              noWrap
            ><b>{reference} - {type}</b></Typography>
            <Typography
              variant="caption"
              component="h3"
              align="center"
              noWrap
            >{council}<br/>{water}</Typography>
          </Grid>
          <Grid item xs={4} spacing={1} className={classes.gridItem}>
            <div className={classes.logo} style={{ backgroundImage: `url(${councilUrl})` }} />
            <div className={classes.logo} style={{ backgroundImage: `url(${waterUrl})` }} />
          </Grid>
        </Grid>
        <Divider />
      </>
    )

    return display;
  }
}

export default withStyles(styles, { withTheme: true })(Header);