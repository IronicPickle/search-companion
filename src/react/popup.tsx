// Main imports
import React, { Component } from "react";
import ReactDOM from "react-dom";
import chromep from "chrome-promise"
import { Order, Settings, Storage } from "../lib/interfaces";
import { Paper, ThemeProvider } from "@material-ui/core";
import { darkTheme, lightTheme } from "./themes";
import { globalContext, globalContextDefaults } from "./contexts";
import PopupRoot from "./popup/PopupRoot";

interface Props {

}

interface State {
  order?: Order;
  settings: Settings;
}

class Popup extends Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      settings: globalContextDefaults.settings
    }
    
    this.syncStorage = this.syncStorage.bind(this);
  }

  async syncStorage() {
    const storage = await chromep.storage.local.get() as Storage;
    const { settings } = storage;
    if(settings != null) this.setState({ settings });
  }

  componentDidMount() {
    this.syncStorage();
    chrome.storage.onChanged.addListener(async (changes) => {
      console.log("[Popup] Syncing new storage to state");
      this.syncStorage();
    });
  }

  render() {

    const { order, settings } = this.state;

    const theme = (settings?.darkThemeState) ? darkTheme : lightTheme;

    return (
      <>
        <globalContext.Provider value={{ order, settings }}>
          <ThemeProvider theme={theme}>
            <Paper style={{ padding: 8, overflow: "auto", maxHeight: 568, width: 284 }}>
              <PopupRoot />
            </Paper>
          </ThemeProvider>
        </globalContext.Provider>
      </>
    )
  }
}

ReactDOM.render(<Popup/>, document.getElementById("root"));