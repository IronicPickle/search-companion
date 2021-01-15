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
    if(storage.order != null) this.setState({
      order: storage.order
    })
    if(storage.settings != null) this.setState({
      settings: storage.settings
    });
  }

  componentDidMount() {
    this.syncStorage();
    chrome.storage.onChanged.addListener(async (changes) => {
      console.log("Syncing new storage to state");
      this.syncStorage();
    });
  }

  render() {

    const { order, settings } = this.state;

    return (
      <>
        <globalContext.Provider value={{ order, settings }}>
          <ThemeProvider theme={(settings.darkThemeState) ? darkTheme : lightTheme}>
            <Paper style={{ padding: 8, overflow: "auto", maxHeight: 568 }}>
              <PopupRoot />
            </Paper>
          </ThemeProvider>
        </globalContext.Provider>
      </>
    )
  }
}

ReactDOM.render(<Popup/>, document.getElementById("root"));