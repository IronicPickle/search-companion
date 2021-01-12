// Icon Imports

// Main imports
import React, { Component } from "react";
import { TextField, Theme, withStyles } from "@material-ui/core";
import { GlobalContext, globalContext } from "../../contexts";
import { ClassNameMap } from "@material-ui/core/styles/withStyles";
import moment from "moment";

const styles = (theme: Theme) => ({

});

interface Props {
  classes: ClassNameMap;
}

interface State {
  
}

class ActionsDisplay extends Component<Props, State> {
  static contextType = globalContext;
  constructor(props: Props) {
    super(props)

    this.state = {}

  }

  render() {
    const { classes } = this.props;
    const { settings, order } = this.context as GlobalContext;

    return (
      <>
        actions
      </> 
    )
  }
}

export default withStyles(styles, { withTheme: true })(ActionsDisplay);