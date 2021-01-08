import chromep from "chrome-promise";
import _ from "lodash";
import { queryElement } from "../../lib/utils";

export const orderFields = [
  { documentId: "CompanyName", actualId: "companyName", name: "Company Name" },
  { documentId: "FlatNumber", actualId: "flatNumber", name: "Flat Number" },
  { documentId: "PlotNo", actualId: "plotNumber", name: "Plot Number" },
  { documentId: "DevelopmentName", actualId: "developmentName", name: "Development Name" },
  { documentId: "HouseName", actualId: "houseName", name: "House Name" },
  { documentId: "HouseNumber", actualId: "houseNumber", name: "House Number" },
  { documentId: "Street", actualId: "street", name: "Street" },
  { documentId: "Street2", actualId: "addressLine2", name: "Address Line 2" },
  { documentId: "Street3", actualId: "locality", name: "Locality" },
  { documentId: "AreaTown", actualId: "town", name: "Town" },
  { documentId: "County", actualId: "county", name: "County" },
  { documentId: "PostCode", actualId: "postCode", name: "Post Code" }
]

export interface Order {
  [key: string]: any;
  companyName: string;
  flatNumber: string;
  plotNumber: string;
  developmentName: string;
  houseName: string;
  houseNumber: string;
  street: string;
  addressLine2: string;
  locality: string;
  town: string;
  county: string;
  postCode: string;
  products: { name: string; price: string }[];
}

export default function checkSignature() {
  if(queryElement(["id:view2"]) != null) {
    updateOrderInfo();
  }
}

async function updateOrderInfo() {
  const order: Order = <Order> {};
  const storage = await chromep.storage.local.get();

  for(const i in orderFields) {
    const orderField = orderFields[i]
    const fieldElement = <HTMLInputElement> document.getElementById(orderField.documentId);
    order[orderField.actualId] = fieldElement.value;
  }

  order.products = [];
  for(let i = 0; true; i++) {
    const trElement = queryElement(["id:products", "id:product_table_", "table", "tbody", `tr#${i}`]);
    if(trElement == null) {
      break;
    } else {
      const product: { name: string; price: string } = { name: "", price: "" };
      const nameElement = queryElement(["td#0"], trElement);
      if(nameElement != null) product.name = nameElement.innerHTML;
      const priceElement = <HTMLInputElement | null> queryElement(["td#8", "input"], trElement);
      if(priceElement != null) product.price = priceElement.value;
      order.products.push(product);
    }
  }

  if(!_.isEqual(order, storage.order)) {
    console.log("Order has changed, updating...");
    chrome.storage.local.set({ order });
  }
}

