import chromep from "chrome-promise";
import { MenuData } from "../react/embed/TabController";
import { Storage } from "./interfaces";

const shortcodes = [
  { name: "Address (Single Line)", function: () => {} },
  { name: "Address (Multi Line)", function: () => {} },
  { name: "Postcode", function: async () => inject(await generateShortcode("postcode")) },
  { name: "Reference", function: () => {} },
  { name: "Local Authority", function: () => {} },
  { name: "Water Authority", function: () => {} }
]

export function shortcodesGetMenuData(onClickFunction: () => any) {
  const menuData: MenuData = { title: "Shortcodes", options: [] };

  for(const i in shortcodes) {
    const shortcode = shortcodes[i];
    menuData.options.push({ title: shortcode.name, onClick: () => {
      shortcode.function(); onClickFunction();
    } })
  }

  return [ menuData ];
  
}

async function generateShortcode(shortcode: string) {
  const storage = <Storage> await chromep.storage.local.get();
  const order = storage.order;
  if(order == null) return "Unknown";

  switch(shortcode) {
    case "postcode":
      return order.property.postCode;
  }

  return "Unknown";
}

function inject(data: string) {

  removeFocusEvents();
  bindFocusEvents((element) => {
    if(element.tagName !== "INPUT" && element.tagName !== "TEXTAREA") return;
    const activeElement = <HTMLInputElement | HTMLTextAreaElement> element;

    const value = activeElement.value;
    const selectionStart = activeElement.selectionStart;
    const selectionEnd = activeElement.selectionEnd;
    if(selectionStart == null || selectionEnd == null) return;
    console.log(selectionStart)
    console.log(selectionEnd)

    const beforeSelection = value.slice(0, selectionStart);
    const afterSelection = value.slice(selectionEnd);
    activeElement.value = `${beforeSelection}${data}${afterSelection}`;

    removeFocusEvents();
    
  });

}

function bindFocusEvents(onFocus: (element: HTMLElement) => any) {

  const inputs = Array.from(document.getElementsByTagName("input"));
  const textareas = Array.from(document.getElementsByTagName("textarea"));

  for(const i in inputs) {
    inputs[i].addEventListener("focus", function(ev) {
      onFocus(this);
    });
  }
  for(const i in textareas) {
    textareas[i].addEventListener("focus", function(ev) {
      onFocus(this);
    });
  }

}

function removeFocusEvents() {

  const inputs = Array.from(document.getElementsByTagName("input"));
  const textareas = Array.from(document.getElementsByTagName("textarea"));

  for(const i in inputs) {
    const input = inputs[i];
    input.parentNode?.replaceChild(input.cloneNode(), input)
  }
  for(const i in textareas) {
    const textarea = textareas[i];
    textarea.parentNode?.replaceChild(textarea.cloneNode(), textarea)
  }

}