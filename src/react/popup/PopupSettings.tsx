// Icons imports
import BrightnessMediumIcon from "@material-ui/icons/BrightnessMedium";
import OpenInBrowserIcon from "@material-ui/icons/OpenInBrowser";

// Main imports
import React, { ChangeEvent, Component } from "react";
import { Box, Switch, Theme, Toolbar, Typography, withStyles } from "@material-ui/core";
import { GlobalContext, globalContext } from "../contexts";
import chromep from "chrome-promise";
import { Settings, Storage } from "../../lib/interfaces";
import { ClassNameMap } from "@material-ui/core/styles/withStyles";

const styles = (theme: Theme) => ({
  icon: {
    marginRight: theme.spacing(2)
  },
  title: {
    marginRight: theme.spacing(2)
  },
  switch: {

  }
});

interface PropsI {
  classes: ClassNameMap
}

interface StateI {
  
}

class PopupSettings extends Component<PropsI, StateI> {
  static contextType = globalContext;
  constructor(props: PropsI) {
    super(props)

    this.state = {}
    
    this.toggleDarkTheme = this.toggleDarkTheme.bind(this);
  }

  async toggleDarkTheme(event: ChangeEvent<HTMLInputElement>) {
    const storage = await chromep.storage.local.get() as Storage;
    let settings = { ...storage.settings, darkThemeState: !event.target.checked } as Settings;
    chrome.storage.local.set({ settings });
  }

  async toggleEmbedded(event: ChangeEvent<HTMLInputElement>) {
    const storage = await chromep.storage.local.get() as Storage;
    let settings = { ...storage.settings, embeddedState: !event.target.checked } as Settings;
    chrome.storage.local.set({ settings });
  }

  render() {
    const { classes } = this.props;
    const { settings } = this.context as GlobalContext;

    return (
      <>
        <Typography
          variant="subtitle2"
          component="div"
          noWrap
        >
          <Toolbar>
            <Box display="flex" flexGrow={1} >
             <Toolbar disableGutters={true} >
                <OpenInBrowserIcon className={classes.icon} />
                <span className={classes.title} >Toggle Window</span>
              </Toolbar>
            </Box>
            <Switch
              checked={settings.embeddedState}
              onChange={this.toggleEmbedded}
              name="toggleEmbeddedSwitch"
              inputProps={{ "aria-label": "toggle window" }}
              className={classes.switch}
            />
          </Toolbar>
          <Toolbar>
            <Box display="flex" flexGrow={1} >
              <Toolbar disableGutters={true} >
                <BrightnessMediumIcon className={classes.icon} />
                <span className={classes.title} >Toggle Dark Mode</span>
              </Toolbar>
            </Box>
            <Switch
              checked={settings.darkThemeState}
              onChange={this.toggleDarkTheme}
              name="toggleThemeSwitch"
              inputProps={{ "aria-label": "toggle dark theme" }}
              className={classes.switch}
            />
          </Toolbar>
        </Typography>
      </>
    )
  }
}

export default withStyles(styles, { withTheme: true })(PopupSettings);