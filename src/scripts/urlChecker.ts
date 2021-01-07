import { RootRef } from "@material-ui/core";
import chromep from "chrome-promise";

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
}

const root = document.createElement("div");
root.setAttribute("id", "searchCompanionRoot")
document.getElementsByTagName("body").item(0)?.prepend(root)

setInterval(() => {
  const order: Order = <Order> {};
  const url = location.href
  if(url.includes("https://indexcms.co.uk/2.7/case-management")) {
    if(document.getElementById("view2") != null) {
      console.log("Detected Order Page")
      for(const i in orderFields) {
        const orderField = orderFields[i]
        const fieldElement = <HTMLInputElement> document.getElementById(orderField.documentId);
        order[orderField.actualId] = fieldElement.value;
      }
      const root = document.getElementById("searchCompanionRoot");
      if(root != null) {

      }
      chrome.storage.sync.set({ order });
    }
  }
}, 1000);