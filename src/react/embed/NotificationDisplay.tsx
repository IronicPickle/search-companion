// Icon Imports

// Main imports
import React, { Component } from "react";
import { Container, Snackbar, Theme, withStyles } from "@material-ui/core";
import { globalContext, GlobalContext } from "../contexts";
import { ClassNameMap } from "@material-ui/core/styles/withStyles";
import Alert from "@material-ui/lab/Alert";

const styles = (theme: Theme) => ({
  mainContainer: {
    paddingRight: 0,
    paddingLeft: 0
  }
});

interface PropsI {
  classes: ClassNameMap;
}

interface StateI {
  
}

class NotificationDisplay extends Component<PropsI, StateI> {
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
        <Container className={classes.mainContainer}>
          
        </Container>
      </>
    )
  }
}

export default withStyles(styles, { withTheme: true })(NotificationDisplay);