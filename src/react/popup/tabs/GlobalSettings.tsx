// Icons imports
import SettingsIcon from "@material-ui/icons/Settings";
import BrightnessMediumIcon from "@material-ui/icons/BrightnessMedium";
import OpenInBrowserIcon from "@material-ui/icons/OpenInBrowser";
import NotificationsActiveIcon from "@material-ui/icons/NotificationsActive";
import RotateLeftIcon from "@material-ui/icons/RotateLeft";
import BlockIcon from "@material-ui/icons/Block";
import ClearIcon from "@material-ui/icons/Clear";

// Main imports
import React, { ChangeEvent, MouseEvent, Component } from "react";
import { Accordion, AccordionDetails, AccordionSummary, Divider, Switch, Theme, Typography, withStyles } from "@material-ui/core";
import { GlobalContext, globalContext } from "../../contexts";
import chromep from "chrome-promise";
import { Settings, Storage } from "../../../lib/interfaces";
import { ClassNameMap } from "@material-ui/core/styles/withStyles";
import Section from "../Section";
import { clearCurrentOrder, resetSettings } from "../../../background/main"

const styles = (theme: Theme) => ({
  icon: {
    marginRight: theme.spacing(2)
  },
  title: {
    marginRight: theme.spacing(2)
  },
  details: {
    display: "block" as "block",
    overflowY: "auto" as "auto",
    maxHeight: theme.spacing(32),
    padding: 0,
    paddingBottom: theme.spacing(1)
  }
});

interface Props {
  classes: ClassNameMap;
}

interface State {
  
}

class GlobalSettings extends Component<Props, State> {
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
          <AccordionSummary expandIcon={<SettingsIcon />}>
            <Typography variant="subtitle2" component="p">
              Settings
            </Typography>
          </AccordionSummary>
          <Divider className={classes.divider} />
          <AccordionDetails className={classes.details} >
            <Section
              title="Window Visibiliy"
              icon={<OpenInBrowserIcon />}
              onClick={
                (settings.extensionState) ? this.toggleSetting("embeddedState") : undefined
              }
              controller={
                <Switch
                  checked={settings.embeddedState && settings.extensionState}
                  onChange={this.toggleSetting("embeddedState")}
                  name="toggleEmbeddedSwitch"
                  inputProps={{ "aria-label": "toggle window" }}
                  className={classes.switch}
                  disabled={!settings.extensionState}
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
              onClick={
                (settings.extensionState) ? this.toggleSetting("notificationsState") : undefined
              }
              controller={
                <Switch
                  checked={settings.notificationsState && settings.extensionState}
                  onChange={this.toggleSetting("notificationsState")}
                  name="toggleThemeSwitch"
                  inputProps={{ "aria-label": "toggle notifications" }}
                  className={classes.switch}
                  disabled={!settings.extensionState}
                />
              }
            />
            <Section
              title="Disable Extension"
              icon={<BlockIcon />}
              onClick={this.toggleSetting("extensionState")}
              controller={
                <Switch
                  checked={settings.extensionState}
                  onChange={this.toggleSetting("extensionState")}
                  name="extensionState"
                  inputProps={{ "aria-label": "disable extension" }}
                  className={classes.switch}
                />
              }
            />
            <Divider />
            <Section
              title="Clear Current Order"
              icon={<ClearIcon />}
              onClick={() => { clearCurrentOrder(); }}
            />
            <Section
              title="Reset"
              icon={<RotateLeftIcon />}
              onClick={() => { resetSettings(); }}
            />
            <Divider />
          </AccordionDetails>
        </Accordion>
      </>
    )
  }
}

export default withStyles(styles, { withTheme: true })(GlobalSettings);