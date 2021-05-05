// Main Imports
import React from "react";
import { Container, LinearProgress, Paper, Theme } from "@material-ui/core";
import withStyles, { ClassNameMap } from "@material-ui/core/styles/withStyles";
import { Component } from "react";
import { globalContext, GlobalContext } from "../contexts";
import TabController from "./TabController";
import { interfaces } from "../../lib/vars";

const styles = (theme: Theme) => ({
  outerContainer: {
    padding: theme.spacing(0.25),
    whiteSpace: "nowrap" as "nowrap"
  },
  innerContainer: {
    position: "relative" as "relative",
    padding: theme.spacing(1),
    whiteSpace: "nowrap" as "nowrap",
    overflow: "hidden"
  },
  backgroundImage: {
    position: "absolute" as "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: "100%",
    height: "100%",
    opacity: 0.40,
    backgroundSize: "cover",
    backgroundPosition: "center"
  },
  "@global": {
    "*::-webkit-scrollbar": {
      width: "0.4em",
      height: "0.4em"
    },
    "*::-webkit-scrollbar-track": {
      "-webkit-box-shadow": `inset 0 0 6px ${theme.palette.secondary.main}`
    },
    "*::-webkit-scrollbar-thumb": {
      backgroundColor: theme.palette.secondary.main,
      outline: `1px solid ${theme.palette.secondary.main}`
    }
  },

  progress: {
    position: "absolute" as "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: "100%",
    height: "100%",
    borderRadius: theme.spacing(0.5)
  }
});

interface Props {
  classes: ClassNameMap
}

interface State {

}

class EmbedRoot extends Component<Props, State> {
  static contextType = globalContext;
  constructor(props: Props) {
    super(props)

    this.state = {}
    
  }


  render() {
    const { classes } = this.props;
    const { settings, order } = this.context as GlobalContext;

    const { originalReturnDate, latestReturnDate, status } = order || {};
    const returnDate = latestReturnDate || originalReturnDate;

    const isOverdue = (returnDate == null) ? false : returnDate < new Date().getTime();
    
    return (
      <>
        { (settings.embeddedState && settings.extensionState) &&
          <Container className={classes.outerContainer}>
            <LinearProgress
              color={(isOverdue && status) ? "secondary" : "primary"}
              variant={(status) ? "indeterminate" : "determinate"}
              className={classes.progress}
            />
            <Paper className={classes.innerContainer}>
              <div
                className={classes.backgroundImage}
                style={{ backgroundImage: `url(${settings.backgroundImage})` }}
              />
              <TabController />
            </Paper>
          </Container> }
      </>
    )
  }
}

export default withStyles(styles, { withTheme: true })(EmbedRoot);