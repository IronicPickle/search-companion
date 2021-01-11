// Icon Imports

// Main imports
import React, { Component, MouseEvent } from "react";
import { Grid, IconButton, Theme, withStyles } from "@material-ui/core";
import { GlobalContext, globalContext } from "../contexts";
import { ClassNameMap } from "@material-ui/core/styles/withStyles";

const styles = (theme: Theme) => ({

});

interface PropsI {
  classes: ClassNameMap;
}

interface StateI {
  
}

class PlanningDisplay extends Component<PropsI, StateI> {
  static contextType = globalContext;
  constructor(props: PropsI) {
    super(props)

    this.state = {}

  }

  render() {
    const { classes } = this.props;
    const { settings, order } = this.context as GlobalContext;

    return (
      <>
        planning
      </> 
    )
  }
}

export default withStyles(styles, { withTheme: true })(PlanningDisplay);