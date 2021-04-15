// Main imports
import React, { Component, SyntheticEvent } from "react";
import ReactDOM from "react-dom";
import chromep from "chrome-promise"
import { Building, KanbanOrder, Notification, Order, OrderHistory, Planning, Settings, Storage } from "../lib/interfaces";
import { create } from "jss";
import { jssPreset, NoSsr, StylesProvider, ThemeProvider } from "@material-ui/core";
import { lightTheme, darkTheme } from "./themes";
import { globalContext } from "./contexts";
import EmbedRoot from "./embed/EmbedRoot";
import FrameComponent, { FrameContextConsumer } from "react-frame-component";

interface Props {

}

interface State {
  order?: Order;
  planning?: Planning;
  building?: Building;
  settings?: Settings;
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

    this.state = {}

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
    const extensionSCIframe = document.getElementById("EXTENSC-iframe");
    if(extensionSCIframe == null) return;
    extensionSCIframe.setAttribute("scrolling", "no");
  }

  sendNotification(notification: Notification) {
    const { settings } = this.state;
    if(notification.href !== window.location.href) return;

    if(settings == null) return;
    if(settings.notificationsState && settings.extensionState) this.setState({ notification });
  }

  render() {

    const { order, planning, building, settings, notification, orderHistory, kanbanOrder } = this.state;

    const theme = (settings?.darkThemeState) ? darkTheme : lightTheme;

    return (
      <>
        <style id="EXTENSC-styles">{
          `#EXTENSC-clickable:hover {
            background-color: ${theme.palette.primary.light};
            color: ${theme.palette.primary.contrastText};
            cursor: pointer;
          }`
        }</style>
        <div id="EXTENSC-iframeCover" style={{
          position: "absolute" as "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          zIndex: -100
        }}/>
        <NoSsr>
          <FrameComponent
              head={<CustomHead />}
              initialContent={initialContent}
              mountTarget="#mountHere"
              id="EXTENSC-iframe"
              onLoad={this.iframeLoad}
              style={{ width: 68, height: 68, border: 0 }}
            >
            <FrameContextConsumer>
              {({ document, window }) => {
                const jss = create({
                  plugins: [...jssPreset().plugins],
                  insertionPoint: document.head
                });
                if(settings == null) return null;
                return (
                  <StylesProvider jss={jss}>
                    <ThemeProvider theme={theme}>
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
      </>
    )
  }
}

async function injectEmbed() {
  const settings = (await chromep.storage.local.get() as Storage).settings;
  chrome.storage.onChanged.addListener((changes) => {
    if(changes.settings == null) return;
    iframeReposition(changes.settings.newValue.embedPosition);
  });

  const embeddedRoot = document.createElement("div") as HTMLDivElement;
  embeddedRoot.id = "EXTENSC-embeddedRoot";
  embeddedRoot.setAttribute("style", 
    `position: fixed;
    right: ${settings.embedPosition.x}px;
    top: ${settings.embedPosition.y}px;
    z-index: 2147483647;
    padding: 5px;
    cursor: all-scroll;`
  );
  document.body.prepend(embeddedRoot);
    
  const pageCover = document.createElement("div") as HTMLDivElement;
  pageCover.id = "EXTENSC-pageCover";
  pageCover.setAttribute("style",
    `position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 2147483646`
  )
  pageCover.hidden = true;
  document.body.prepend(pageCover);

  ReactDOM.render(<Embed/>, embeddedRoot);
  
  const iframeCover = document.getElementById("EXTENSC-iframeCover") as HTMLDivElement;

  const iframeElement = document.getElementById("EXTENSC-iframe") as HTMLIFrameElement;

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
    pageCover.hidden = false;
  }
  function onMouseMove(event: MouseEvent) {
    if(!dragging) return;
    mousePosition = { x: event.clientX, y: event.clientY };
    iframeReposition(iframeCalcPosition(mousePosition, mouseOffset));
  }
  window.onmousemove = onMouseMove;
  pageCover.onmousemove = onMouseMove;
  window.onmouseup = async (event: MouseEvent) => {
    if(!dragging) return;
    dragging = false
    iframeCover.style.zIndex = "-100";
    iframeCover.style.boxShadow = "0 0 0 black";
    const settings = (await chromep.storage.local.get() as Storage).settings;
    settings.embedPosition = iframeCalcPosition(mousePosition, mouseOffset);
    chrome.storage.local.set({ settings });
    pageCover.hidden = true;
  }
  window.onmessage = (event: MessageEvent<any>) => {
    const frameDataOld = { frameWidth: iframeElement.clientWidth, frameHeight: iframeElement.clientHeight };
    if(event.data.hasOwnProperty("frameHeight")) {
      iframeElement.style.height = event.data.frameHeight + "px";
      iframeCheckPosition(event.data, frameDataOld)
    }
    if(event.data.hasOwnProperty("frameWidth")) {
      iframeElement.style.width = event.data.frameWidth + "px";
      iframeCheckPosition(event.data, frameDataOld)
    }
    if(event.data === "closePopover") {
      const popoverElements = Array.from(
        document.getElementsByClassName("MuiPopover-root")
      ) as HTMLDivElement[];
      popoverElements.forEach(popoverElement => popoverElement.style.visibility = "hidden");
    }
  }
  window.onresize = async () => {
    const rect = embeddedRoot.getBoundingClientRect();
    iframeReposition(iframeCalcPosition({ x: rect.x, y: rect.y }, { x: 0, y: 0 }));
  }

  async function iframeCheckPosition(frameData: any, frameDataOld: any) {
    const x = window.innerWidth - parseInt(embeddedRoot.style.right) - embeddedRoot.clientWidth;
    const y = parseInt(embeddedRoot.style.top);

    const embedPosition = (await chromep.storage.local.get() as Storage).settings.embedPosition;
    const calculatedPosition = iframeCalcPosition({ x, y }, { x: 0, y: 0 });
    let newPosition = embedPosition;
    const isBigger = frameData.frameWidth > frameDataOld.frameWidth || frameData.frameHeight > frameDataOld.frameHeight;

    if(isBigger) {
      newPosition = calculatedPosition;
    } else {
      if(frameData.frameWidth === frameDataOld.frameWidth) newPosition.x = calculatedPosition.x
      if(frameData.frameHeight === frameDataOld.frameHeight) newPosition.y = calculatedPosition.y;
    }
    iframeReposition(newPosition);
  }

  function iframeCalcPosition(position: any, offset: any) {
    let x = (window.innerWidth - position.x) - (embeddedRoot.clientWidth - offset.x);
    let y = position.y - offset.y;
    if(x < 0) x = 0;
    if(y < 0) y = 0;

    const xMax = (window.innerWidth / 1.25) - embeddedRoot.clientWidth;
    const yMax = (window.innerHeight) - embeddedRoot.clientHeight;
    if(x > xMax) x = xMax;
    if(y > yMax) y = yMax;
    return { x, y };
  }

  function iframeReposition(position: any) {
    embeddedRoot.style.right = position.x + "px"
    embeddedRoot.style.top = position.y + "px"
  }

}

injectEmbed();