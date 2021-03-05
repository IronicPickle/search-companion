import chromep from "chrome-promise";
import { Order, Property, Storage } from "./interfaces";

interface OrderTrimmed {
  [key: string]: any;
  reference: string;
  property: Property;
  enquiries: number[];
  council: string;
}

export async function formToDuct(type: "llc1" | "con29r" | "con29o") {

  const storage = (<Storage> await chromep.storage.local.get())
  if(storage.order == null) return;

  const trimmedOrder = trimData(storage.order)

  const url = generateUrl(type, trimmedOrder);
  window.open(url);

}

function generateUrl(type: "llc1" | "con29r" | "con29o", data: OrderTrimmed) {
  return `duct://form/?type=${type}&data=${encodeURIComponent(JSON.stringify(data))}`;
}

function trimData(order: Order) {
  const trimmedOrder = <OrderTrimmed> {};

  trimmedOrder.reference = order.reference;
  trimmedOrder.property = order.property;
  trimmedOrder.council = order.council
  trimmedOrder.enquiries = [];

  for(const i in order.products) {
    let name = order.products[i].name;
    if(name.includes("Enquiry ")) {
      const number = parseInt(name.slice(8, 10));
      if(!isNaN(number)) trimmedOrder.enquiries.push(number);
    }
  }

  return trimmedOrder;
}