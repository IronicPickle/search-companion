import { NotificationSettings } from "./interfaces";

export function queryElement(signature: string[], prevElement?: Element): Element | null {
  let query = signature[0];
  const rootElement = (prevElement != null) ? prevElement : document;
  let element: Element | null = null;

  let index = 0;
  const regexExec = /(?:#)([0-9]+)/.exec(query);
  if(regexExec != null) {
    index = parseInt(regexExec[1]);
    query = query.slice(0, regexExec.index);
  }
  if(isNaN(index)) index = 0;

  if(query.startsWith("id:")) {
    const id = query.slice(3);
    element = document.getElementById(id);
  } else if(query.startsWith("class:")) {
    const className = query.slice(6);
    element = rootElement.getElementsByClassName(className).item(index);
  } else {
    const tag = query;
    element = rootElement.getElementsByTagName(tag).item(index);
  }
  signature.shift();
  return (signature.length === 0 || element == null) ? element : queryElement(signature, element);
}

export function injectIndicator() {
  const div = document.createElement("div");
  const text = "Page Scanning Active";
  div.innerHTML = text;
  div.setAttribute("style",
      `position: fixed;
      display: none;
      bottom: 5px;
      left: 5px;
      padding: 5px 10px;
      background-color: rgba(250,250,250,1);
      box-shadow: 0 0 1px rgba(80,80,80,1);
      border-radius: 2px;
      color: rgba(0,0,0,1);
      font: 12px Courier New, sans-serif;
      font-weight: bold;
      font-style: italic;
      z-index: 2147483647;`
    )
  const body = document.getElementsByTagName("body").item(0);
  if(body != null) body.prepend(div);
  return div;
}

export function createNotification(settings: NotificationSettings, tabOverride?: number, hrefOverride?: string) {
  return { settings, created: new Date().getTime(), tabOverride, href: hrefOverride || window.location.href }
}