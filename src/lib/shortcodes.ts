import chromep from "chrome-promise";
import { MenuData } from "../react/embed/TabController";
import { Property, Storage } from "./interfaces";
import { createNotification } from "./utils";

const shortcodes = [
  "Address (Single Line)",
  "Address (Multi Line)",
  "Postcode",
  "Reference",
  "Local Authority",
  "Water Authority",
]

export function shortcodesGetMenuData(onClickFunction: () => any) {
  const menuData: MenuData = { title: "Shortcodes", options: [] };

  for(const i in shortcodes) {
    const shortcode = shortcodes[i];
    menuData.options.push({ title: shortcode, onClick: async () => {
      copyToClipboard(await generateShortcode(shortcode.toLowerCase())); onClickFunction();
    } })
  }

  return [ menuData ];
  
}

const addressKeys = [
  "flatNumber", "houseName", "houseNumber", "street", "addressLine2", "locality", "town", "county", "postCode"
]

async function generateShortcode(shortcode: string) {
  const storage = <Storage> await chromep.storage.local.get();
  const order = storage.order;
  if(order == null) return "Unknown";

  switch(shortcode) {
    
    case "address (single line)":
      return generateAddress(order.property, ", ");
    case "address (multi line)":
      return generateAddress(order.property, ",\n");
    case "postcode":
      return order.property.postCode;
    case "reference":
      return order.reference;
    case "local authority":
      return order.council;
    case "water authority":
      return order.water;
    default:
      return "Unknown";
  }

}

function generateAddress(property: Property, joiner?: string) {
  joiner = joiner || ", ";
  let address = "";
  for(const i in addressKeys) {
    const addressKey = addressKeys[i];
    const value = property[addressKey];
    if(value.length > 0) {
      if([ "flatNumber", "houseName", "houseNumber" ].includes(addressKey)) {
        address += `${value} `
      } else {
        address += `${value}${joiner}`
      }
    }
  }

  return address.slice(0, -3);
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