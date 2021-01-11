// Main imports
import React, { Component, SyntheticEvent } from "react";
import ReactDOM from "react-dom";
import chromep from "chrome-promise"
import { Building, Notification, Order, Planning, Settings } from "../lib/interfaces";
import { create } from "jss";
import { jssPreset, NoSsr, StylesProvider, ThemeProvider } from "@material-ui/core";
import { lightTheme, darkTheme } from "./themes";
import { globalContext, globalContextDefaults } from "./contexts";
import EmbedRoot from "./embed/EmbedRoot";
import FrameComponent, { FrameContextConsumer } from "react-frame-component";

interface PropsI {

}

interface StateI {
  order?: Order;
  planning?: Planning;
  building?: Building;
  settings: Settings;
  notification?: Notification;
}

const CustomHead = (props: any) => {
  return (
    <>
      <meta charSet="utf-8" />
      <title>Previewer</title>
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <base target="_parent" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
      />
    </>
    );
}

const initialContent = `
  <!DOCTYPE html>
  <html>
    <head>
      
    </head>
    <body id='mountHere' style='position: fixed; margin: 0;'></body>
    <script>
      window.onload = () => sendPostMessage(true);
      window.document = () => sendPostMessage();
      const resizeObserver = new ResizeObserver(() => sendPostMessage());
      resizeObserver.observe(document.getElementById("mountHere"));

      let height;
      let width;
      function sendPostMessage(force) {
        const frameContentWrapper = document.getElementById("mountHere");
        if(frameContentWrapper == null) return;
        if((height !== frameContentWrapper.offsetHeight ||
            width !== frameContentWrapper.offsetWidth) || force) {
          height = frameContentWrapper.offsetHeight;
          width = frameContentWrapper.offsetWidth;
          window.parent.postMessage({ frameHeight: height, frameWidth: width }, "*");
        }
      }
    </script>
  </html>
`

class Embed extends Component<PropsI, StateI> {
  constructor(props: PropsI) {
    super(props)

    this.state = {
      settings: globalContextDefaults.settings
    }

    this.syncStorage = this.syncStorage.bind(this);
    this.sendNotification = this.sendNotification.bind(this);
  }
  

  async syncStorage() {
    const storage = await chromep.storage.local.get() as Storage;
    if(storage.order != null) this.setState({
      order: storage.order
    });
    if(storage.planning != null) this.setState({
      planning: storage.planning
    });
    if(storage.building != null) this.setState({
      building: storage.building
    });
    if(storage.settings != null) this.setState({
      settings: storage.settings
    });
    if(storage.notification != null) this.sendNotification({ ...storage.notification })
  }

  componentDidMount() {
    this.syncStorage();
    chrome.storage.onChanged.addListener(async (changes) => {
      console.log("Syncing new storage to state");
      this.syncStorage();
    });
  }

  iframeLoad(event: SyntheticEvent<HTMLIFrameElement>) {
    const embeddedIframe = document.getElementById("embeddedIframe");
    if(embeddedIframe == null) return;
    embeddedIframe.setAttribute("onload", "resizeIframe(this)");
    embeddedIframe.setAttribute("scrolling", "no");
  }

  sendNotification(notification: Notification) {
    if(notification.href === window.location.href) this.setState({ notification });
  }

  render() {

    const { order, planning, building, settings, notification } = this.state;

    return (
      <NoSsr>
        <FrameComponent
            head={<CustomHead />}
            initialContent={initialContent}
            mountTarget="#mountHere"
            id="embeddedIframe"
            onLoad={this.iframeLoad}
            style={{ width: 68, height: 68, border: 0 }}
          >
          <FrameContextConsumer>
            {({ document, window }) => {
              const jss = create({
                plugins: [...jssPreset().plugins],
                insertionPoint: document.head
              });
              return (
                <StylesProvider jss={jss}>
                  <ThemeProvider theme={(settings.darkThemeState) ? darkTheme : lightTheme}>
                    <globalContext.Provider value={{ order, settings, notification, planning, building,
                      sendNotification: this.sendNotification }}>
                      <EmbedRoot />
                    </globalContext.Provider>
                  </ThemeProvider>
                </StylesProvider>
              )
            }}
          </FrameContextConsumer>
        </FrameComponent>
      </NoSsr>
    )
  }
}

function injectEmbed() {
  const embeddedRoot = document.createElement("div") as HTMLIFrameElement;
  embeddedRoot.setAttribute("style", 
    `position: fixed;
    right: 10px;
    top: 10px;
    z-index: 1000000;`
  );
  document.body.prepend(embeddedRoot);

  const embeddedRootScript = document.createElement("script") as HTMLScriptElement;
  embeddedRootScript.innerHTML = `
    window.onmessage = (e) => {
      if(e.data.hasOwnProperty("frameHeight")) {
        document.getElementById("embeddedIframe").style.height = e.data.frameHeight + "px";
      } if(e.data.hasOwnProperty("frameWidth")) {
        document.getElementById("embeddedIframe").style.width = e.data.frameWidth + "px";
      }
    }
  `
  document.body.prepend(embeddedRootScript);

  ReactDOM.render(<Embed/>, embeddedRoot);
}

injectEmbed();