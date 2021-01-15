// Icons imports
import SettingsIcon from "@material-ui/icons/Settings";
import BrightnessMediumIcon from "@material-ui/icons/BrightnessMedium";
import OpenInBrowserIcon from "@material-ui/icons/OpenInBrowser";
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';

// Main imports
import React, { ChangeEvent, MouseEvent, Component } from "react";
import { Accordion, AccordionDetails, AccordionSummary, Divider, Switch, Theme, withStyles } from "@material-ui/core";
import { GlobalContext, globalContext } from "../contexts";
import chromep from "chrome-promise";
import { Settings, Storage } from "../../lib/interfaces";
import { ClassNameMap } from "@material-ui/core/styles/withStyles";
import Section from "./Section";

const styles = (theme: Theme) => ({
  icon: {
    marginRight: theme.spacing(2)
  },
  title: {
    marginRight: theme.spacing(2)
  },
  details: {
    display: "block" as "block",
    paddingRight: 0,
    paddingLeft: 0,
    paddingBottom: theme.spacing(1)
  }
});

interface Props {
  classes: ClassNameMap;
}

interface State {
  
}

class SettingsTab extends Component<Props, State> {
  static contextType = globalContext;
  constructor(props: Props) {
    super(props)

    this.state = {}
  }

  toggleSetting(setting: string) {
    return async (event: ChangeEvent<HTMLInputElement> | MouseEvent<HTMLDivElement>) => {
      let settings = (await chromep.storage.local.get() as Storage).settings;
      if(settings == null) return;
      settings = { ...settings, [setting]: !settings[setting] } as Settings;
      chrome.storage.local.set({ settings });
    }
  }

  render() {
    const { classes } = this.props;
    const { settings } = this.context as GlobalContext;

    return (
      <>
        <Accordion>
          <AccordionSummary
            expandIcon={<SettingsIcon />}
          >Settings</AccordionSummary>
          <Divider className={classes.divider} />
          <AccordionDetails className={classes.details} >
            <Section
              title="Window Visibiliy"
              icon={<OpenInBrowserIcon />}
              onClick={this.toggleSetting("embeddedState")}
              controller={
                <Switch
                  checked={settings.embeddedState}
                  onChange={this.toggleSetting("embeddedState")}
                  name="toggleEmbeddedSwitch"
                  inputProps={{ "aria-label": "toggle window" }}
                  className={classes.switch}
                />
              }
            />
            <Section
              title="Dark Mode"
              icon={<BrightnessMediumIcon />}
              onClick={this.toggleSetting("darkThemeState")}
              controller={
                <Switch
                  checked={settings.darkThemeState}
                  onChange={this.toggleSetting("darkThemeState")}
                  name="toggleThemeSwitch"
                  inputProps={{ "aria-label": "toggle dark theme" }}
                  className={classes.switch}
                />
              }
            />
            <Section
              title="Notifications"
              icon={<NotificationsActiveIcon />}
              onClick={this.toggleSetting("notificationsState")}
              controller={
                <Switch
                  checked={settings.notificationsState}
                  onChange={this.toggleSetting("notificationsState")}
                  name="toggleThemeSwitch"
                  inputProps={{ "aria-label": "toggle notifications" }}
                  className={classes.switch}
                />
              }
            />
          </AccordionDetails>
        </Accordion>
      </>
    )
  }
}

export default withStyles(styles, { withTheme: true })(SettingsTab);