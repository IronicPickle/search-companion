import chromep from "chrome-promise";
import { Storage } from "./interfaces";

export async function formToDuct(type: "llc" | "con29r" | "con29o") {

  const storage = (<Storage> await chromep.storage.local.get())

  const url = `duct://form/?type=${type}&data=${encodeURIComponent(JSON.stringify(storage.order))}`;

  console.log(url)

  window.open(url);

}