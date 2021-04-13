import chromep from "chrome-promise";
import { MenuData } from "../react/embed/TabController";
import { Order, Product, Property, Storage } from "./interfaces";
import { createNotification } from "./utils";

export type ShortcodeType = "address (single line)" | "address (multi line)" | "other";

const shortcodesMenuMap: { [key: string]: string[] } = {
  "address (single line)": [
    "Full", "Short", "Area"
  ], "address (multi line)": [
    "Full", "Area"
  ], "other": [
    "Reference", "Local Authority", "Water Authority", "Products", "Full Summary"
  ]
}

export function getShortcodesMenuData(type: ShortcodeType, onClickFunction: () => any) {
  const menuData: MenuData = { title: `${type} Shortcodes`, options: [] };

  const shortcodes = shortcodesMenuMap[<string> type.toLowerCase()];

  for(const i in shortcodes) {
    const shortcode = shortcodes[i];
    menuData.options.push({ title: shortcode, onClick: async () => {
      copyToClipboard(await generateShortcode(
        <ShortcodeType> type.toLowerCase(), shortcode.toLowerCase()
      )); onClickFunction();
    } })
  }

  return [ menuData ];
}

const fullAddressKeys = [
  "flatNumber", "houseName", "houseNumber", "street", "addressLine2", "locality", "town", "county", "postCode"
]
const shortAddressKeys = [
  "flatNumber", "houseName", "houseNumber", "street"
]
const areaAddressKeys = [
  "addressLine2", "locality", "town", "county", "postCode"
]

async function generateShortcode(type: ShortcodeType, shortcode: string) {
  const storage = <Storage> await chromep.storage.local.get();
  const order = storage.order;
  if(order == null) return "Unknown";

  switch(type) {
    case "address (single line)":
      switch(shortcode) {
        case "full":
          return generateAddress(order.property, fullAddressKeys, ", ");
        case "short":
          return generateAddress(order.property, shortAddressKeys, ", ");
        case "area":
          return generateAddress(order.property, areaAddressKeys, ", ");
        default:
          return "Unknown";
      }
    case "address (multi line)":
      switch(shortcode) {
        case "full":
          return generateAddress(order.property, fullAddressKeys, ",\n");
        case "area":
          return generateAddress(order.property, areaAddressKeys, ",\n");
        default:
          return "Unknown";
      }
    case "other":
      switch(shortcode) {
        case "reference":
          return order.reference;
        case "local authority":
          return order.council;
        case "water authority":
          return order.water;
        case "products":
          return generateProducts(order);
        case "full summary":
          return generateFullSummary(order);
        default:
          return "Unknown";
      }
    default:
      return "Unknown";
  }

}

function generateAddress(property: Property, keys: string[], joiner: string = ", ") {

  let addressShortcode = "";
  for(const i in keys) {
    const key = keys[i];
    if(property[key] === "") continue;
    if([ "houseNumber", "houseName", "flatNumber" ].includes(key)) {
      addressShortcode += `${property[key]} `;
    } else {
      addressShortcode += `${property[key]}${joiner}`
    }
  }

  return addressShortcode.slice(0, 0 - joiner.length);
  
}

function generateProducts(order: Order) {

  return order.products.map(product => {
    return `${product.name} | £${product.cost} inc. VAT`
  }).join("\n") + `\n---\nOrder Total: £${order.totalCost} inc. VAT`;

}

function generateFullSummary(order: Order) {

  let fullSummary = "Full Summary:";

  fullSummary += `\n\n${order.reference} - ${order.type}`;
  fullSummary += `\n${order.council}`;
  fullSummary += `\n${order.water}`;
  fullSummary += `\n\nAddress\n${generateAddress(order.property, fullAddressKeys, ",\n")}`;
  fullSummary += `\n\nProducts\n${generateProducts(order)}`;

  return fullSummary

}

function copyToClipboard(data: string) {

  const inputElement = document.createElement("textarea");
  inputElement.style.position = "absolute";
  inputElement.style.opacity = "0";
  document.body.prepend(inputElement);
  
  inputElement.value = data;
  inputElement.select();
  inputElement.setSelectionRange(0, data.length);
  document.execCommand("copy");

  
  const notification = createNotification({ severity: "success", text: "Copied Shortcode to Clipboard" });
  chrome.storage.local.set({ notification });

}