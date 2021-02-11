// Main imports
import React, { Component, SyntheticEvent } from "react";
import ReactDOM from "react-dom";
import chromep from "chrome-promise"
import { Building, KanbanOrder, Notification, Order, OrderHistory, Planning, Settings, Storage } from "../lib/interfaces";
import { create } from "jss";
import { jssPreset, NoSsr, StylesProvider, ThemeProvider } from "@material-ui/core";
import { lightTheme, darkTheme } from "./themes";
import { globalContext, globalContextDefaults } from "./contexts";
import EmbedRoot from "./embed/EmbedRoot";
import FrameComponent, { FrameContextConsumer } from "react-frame-component";

interface Props {

}

interface State {
  order?: Order;
  planning?: Planning;
  building?: Building;
  settings: Settings;
  notification?: Notification;
  orderHistory?: OrderHistory;
  kanbanOrder?: KanbanOrder;
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
      const frameContentWrapper = document.getElementById("mountHere");
      resizeObserver.observe(frameContentWrapper);

      let height;
      let width;
      function sendPostMessage(force) {
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

class Embed extends Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      settings: globalContextDefaults.settings
    }

    this.syncStorage = this.syncStorage.bind(this);
    this.sendNotification = this.sendNotification.bind(this);
  }
  

  async syncStorage() {
    const storage = await chromep.storage.local.get() as Storage;
    const { order, planning, building, settings, notification, orderHistory, kanbanOrder } = storage;
    this.setState({ order, planning, building, settings, orderHistory, kanbanOrder });
    if(notification != null) this.sendNotification({ ...notification })
  }

  componentDidMount() {
    this.syncStorage();
    chrome.storage.onChanged.addListener(async (changes) => {
      console.log(`[Embed] Syncing new storage to state, changes: | ${Object.keys(changes).join(" | ").toUpperCase()} |`);
      this.syncStorage();
    });
  }

  iframeLoad(event: SyntheticEvent<HTMLIFrameElement>) {
    const embeddedIframe = document.getElementById("embeddedIframe");
    if(embeddedIframe == null) return;
    embeddedIframe.setAttribute("scrolling", "no");
  }

  sendNotification(notification: Notification) {
    const { settings } = this.state;
    if(notification.href === window.location.href &&
      settings.notificationsState && settings.extensionState) this.setState({ notification });
  }

  render() {

    const { order, planning, building, settings, notification, orderHistory, kanbanOrder } = this.state;

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
                    <globalContext.Provider value={{ order, settings, notification, planning, building, orderHistory, kanbanOrder,
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
  const embeddedRoot = document.createElement("div") as HTMLDivElement;
  embeddedRoot.setAttribute("style", 
    `position: fixed;
    right: 10px;
    top: 10px;
    z-index: 2147483647;
    padding: 5px;
    cursor: all-scroll;`
  );
  document.body.prepend(embeddedRoot);

  ReactDOM.render(<Embed/>, embeddedRoot);
  
  const iframeCover = document.createElement("div") as HTMLDivElement;
  iframeCover.setAttribute("style",
    `position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: -100`
  )
  embeddedRoot.prepend(iframeCover);

  const iframeElement = document.getElementById("embeddedIframe") as HTMLIFrameElement;

  let dragging = false;
  let mouseOffset = { x: 0, y: 0 }
  let mousePosition = { x: 0, y: 0 }
  embeddedRoot.onmousedown = (event: MouseEvent) => {
    event.stopPropagation()
    event.preventDefault();
    dragging = true;
    mouseOffset = { x: event.offsetX, y: event.offsetY }
    iframeCover.style.zIndex = "100";
    iframeCover.style.boxShadow = "0 0 2px black";
  }
  window.onmousemove = (event: MouseEvent) => {
    if(!dragging) return;
    mousePosition = { x: event.clientX, y: event.clientY };
    iframeReposition(mousePosition, mouseOffset);
  }
  window.onmouseup = (event: MouseEvent) => {
    if(!dragging) return;
    dragging = false
    iframeCover.style.zIndex = "-100";
    iframeCover.style.boxShadow = "0 0 0 black";
  }
  window.onmessage = (event: MessageEvent<any>) => {
    if(event.data.hasOwnProperty("frameHeight")) {
      iframeElement.style.height = event.data.frameHeight + "px";
      iframeCheckPosition()
    }
    if(event.data.hasOwnProperty("frameWidth")) {
      iframeElement.style.width = event.data.frameWidth + "px";
      iframeCheckPosition()
    }

  }

  function iframeCheckPosition() {
    const x = document.body.clientWidth - parseInt(embeddedRoot.style.right) - embeddedRoot.clientWidth;
    const y = parseInt(embeddedRoot.style.top);
    iframeReposition({ x, y }, { x: 0, y: 0 });
  }

  function iframeReposition(position: any, offset: any) {
    let x = (document.body.clientWidth - position.x) - (embeddedRoot.clientWidth - offset.x);
    let y = position.y - offset.y;
    if(x < 0) x = 0;
    if(y < 0) y = 0;
    const xMax = document.body.clientWidth - embeddedRoot.clientWidth;
    const yMax = document.body.clientHeight - embeddedRoot.clientHeight;
    if(x > xMax) x = xMax;
    if(y > yMax) y = yMax;
    embeddedRoot.style.right = x + "px"
    embeddedRoot.style.top = y + "px"
  }

}

injectEmbed();