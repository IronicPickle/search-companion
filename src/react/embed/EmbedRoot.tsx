// Main Imports
import React from "react";
import { Paper, Theme } from "@material-ui/core";
import withStyles, { ClassNameMap } from "@material-ui/core/styles/withStyles";
import { Component } from "react";
import { globalContext, GlobalContext } from "../contexts";
import TabController from "./TabController";

const styles = (theme: Theme) => ({
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
  }
});

interface PropsI {
  classes: ClassNameMap
}

interface StateI {

}

class EmbedRoot extends Component<PropsI, StateI> {
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
        {
          (settings.embeddedState) ?
            <Paper style={{ padding: 10, whiteSpace: "nowrap" }}>
              <TabController />
            </Paper>
          : <></>
        }
        
      </>
    )
  }
}

export default withStyles(styles, { withTheme: true })(EmbedRoot);