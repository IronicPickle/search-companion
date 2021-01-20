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
  } else if(query.startsWith("name:")) {
    const name = query.slice(5);
    element = document.getElementsByName(name).item(index);
  } else {
    const tag = query;
    element = rootElement.getElementsByTagName(tag).item(index);
  }
  signature.shift();
  return (signature.length === 0 || element == null) ? element : queryElement(signature, element);
}

export function createNotification(settings: NotificationSettings, tabOverride?: number, hrefOverride?: string) {
  return { settings, created: new Date().getTime(), tabOverride, href: hrefOverride || window.location.href }
}

export function sanitizeNbsp(text: string) {
  return text.replace(/\u00a0+?/g, "");
}

export function sanitizeNewLine(text: string) {
  return text.replace(/[\r\n|\n]+?/g, "");
}