import chromep from "chrome-promise";
import { Order, Storage } from "./interfaces";

export async function formToDuct(type: "llc1" | "con29r" | "con29o") {

  const storage = (<Storage> await chromep.storage.local.get())
  if(storage.order == null) return;

  const url = generateUrl(type, storage.order);
  window.open(url);

}

function generateUrl(type: "llc1" | "con29r" | "con29o", data: Order) {
  return `duct://form/?type=${type}&data=${encodeURIComponent(JSON.stringify(data))}`;
}