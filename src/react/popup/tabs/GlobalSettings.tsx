// Icons imports
import SettingsIcon from "@material-ui/icons/Settings";
import BrightnessMediumIcon from "@material-ui/icons/BrightnessMedium";
import OpenInBrowserIcon from "@material-ui/icons/OpenInBrowser";
import NotificationsActiveIcon from "@material-ui/icons/NotificationsActive";
import ImageIcon from "@material-ui/icons/Image";
import RotateLeftIcon from "@material-ui/icons/RotateLeft";
import BlockIcon from "@material-ui/icons/Block";
import ClearIcon from "@material-ui/icons/Clear";

// Main imports
import React, { ChangeEvent, MouseEvent, Component } from "react";
import { Accordion, AccordionDetails, AccordionSummary, Divider, Menu, MenuItem, Switch, TextField, Theme, Typography, withStyles } from "@material-ui/core";
import { GlobalContext, globalContext } from "../../contexts";
import chromep from "chrome-promise";
import { Storage } from "../../../lib/interfaces";
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
  anchorElement: Element | null;
  fieldValue?: string;
}

class GlobalSettings extends Component<Props, State> {
  static contextType = globalContext;
  constructor(props: Props) {
    super(props)

    this.state = {
      anchorElement: null
    }

    this.menuOpen = this.menuOpen.bind(this);
    this.menuClose = this.menuClose.bind(this);
  }

  toggleSetting(setting: string) {
    return async (event: ChangeEvent<HTMLInputElement> | MouseEvent<HTMLDivElement>) => {
      let settings = (this.context as GlobalContext).settings;
      this.setSettings(setting, !settings[setting])
    }
  }

  async setSettings(setting: string, value: any) {
    let settings = (this.context as GlobalContext).settings;
    settings[setting] = value;
    chrome.storage.local.set({ settings });
  }

  menuClose() {
    this.setState({ anchorElement: null });
    window.postMessage("closePopover", "*");
    this.setSettings("backgroundImage", this.state.fieldValue);
  }

  menuOpen(event: MouseEvent<HTMLButtonElement | HTMLDivElement>) {
    this.setState({ anchorElement: event.currentTarget});
  }

  async componentDidMount() {
    let settings = (await chromep.storage.local.get() as Storage).settings;
    if(settings == null) return;
    this.setState({ fieldValue: settings.backgroundImage });
  }

  render() {
    const { classes } = this.props;
    const { anchorElement, fieldValue } = this.state;
    const { settings } = this.context as GlobalContext;

    return (
      <>
        <Menu
            anchorEl={anchorElement}
            keepMounted
            open={anchorElement != null}
            onClose={this.menuClose}
            MenuListProps={{
              style: { padding: 0 }
            }}
          >
            <MenuItem >
              <TextField
                value={fieldValue}
                placeholder="Image URL"
                className={classes.field}
                onChange={event => this.setState({ fieldValue: event.target.value })}
              />
            </MenuItem>
        </Menu>
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
              title="Change Image"
              icon={<ImageIcon />}
              onClick={this.menuOpen}
            />
            <Divider />
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