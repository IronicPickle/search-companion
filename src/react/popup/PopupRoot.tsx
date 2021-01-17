// Icons imports

// Main imports
import React, { Component } from "react";
import { Divider, Theme, Typography, withStyles } from "@material-ui/core";
import { ClassNameMap } from "@material-ui/core/styles/withStyles";
import { GlobalContext, globalContext } from "../contexts";
import GlobalSettings from "./tabs/GlobalSettings";
import AboutTab from "./tabs/About";

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
    },
    html: {
      backgroundColor: theme.palette.background.default
    }
  },
  mainContainer: {
    marginTop: theme.spacing(2)
  },
  title: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2)
  },
  divider: {
    marginBottom: theme.spacing(2)
  }
});

interface Props {
  classes: ClassNameMap;
}

interface State {
  
}

class PopupRoot extends Component<Props, State> {
  static contextType = globalContext;
  constructor(props: Props) {
    super(props)

    this.state = {}
  }

  render() {
    const { classes } = this.props;
    const { settings } = this.context as GlobalContext;

    return (
      <>
        <Typography
          variant="h6"
          component="h6"
          align="center"
          noWrap
          className={classes.title}
        >Search Companion</Typography>
        <Divider className={classes.divider} />
        
        <GlobalSettings />
        <AboutTab />
      </>
    )
  }
}

export default withStyles(styles, { withTheme: true })(PopupRoot);