import chromep from "chrome-promise";
import _ from "lodash";
import { Files, Order, Product, Property, Storage } from "../../lib/interfaces";
import { orderFields } from "../../lib/vars";
import { createNotification, queryElement } from "../../lib/utils";
import { interfaceCheckInterval } from "../../lib/vars";
import Interface from "../Interface";

import { lightTheme } from  "../../react/themes"

class CMS extends Interface {
  constructor() {
    const signatures = {
      orderInfo: {
        signature: () => queryElement(["id:view2"]) != null,
        handler: () => {
          const order = this.extractOrderInfo();
          this.saveOrderInfo(order);
        }
      }
    }

    super(signatures);
    this.startInterval(interfaceCheckInterval);
    console.log(`[${this.name}] Interface ready`);
  }

  extractOrderInfo() {
    const order = <Order> {}
  
    order.reference = this.extractReference();
    order.property =  this.extractPropertyInfo();
    order.products = this.extractProducts() || [];
    order.type = this.extractType();
    order.council = this.extractCouncil();
    order.water = this.extractWater();
    order.totalCost = this.extractTotalCost();
    order.files = this.extractFiles() || [];
    order.status = this.extractOrderStatus();
    order.originalReturnDate = this.extractOriginalReturnDate();
    order.latestReturnDate = this.extractLatestReturnDate();
    
    return order;
  }

  async saveOrderInfo(order: Order) {
    const storage = <Storage> await chromep.storage.local.get();

    if(storage.order?.reference === order.reference) {
      order.property.location = storage.order.property.location;
    } else {
      order.property.location = {
        osGridRef: { easting: 0, northing: 0 },
        latLon: { latitude: 0, longitude: 0 }
      }
    }

    if(!_.isEqual(order, storage.order)) {
      const notification = createNotification({ severity: "success", text: "Order Info Extracted" }, 0);
      console.log(`[${this.name}] Saved order info to storage`);
      chrome.storage.local.set({ order, notification });
      chrome.storage.local.remove([ "planning", "building" ]);
    }
  }

  extractOrderStatus() {

    const aElement = <HTMLLinkElement | null> queryElement(["id:orderComplete"]);
    if(aElement == null) return null;

    return aElement.innerText === "Mark as Completed";

  }

  extractLatestReturnDate() {

    const inputElements = document.getElementsByName("LatestReturnDate");
    if(inputElements.length === 0) return null;
    const inputElement = <HTMLInputElement> inputElements.item(inputElements.length - 1)

    const returnDate = this.parseDate(inputElement.value).getTime();
    
    return (isNaN(returnDate) ? null : returnDate);

  }

  extractOriginalReturnDate() {

    const inputElement = <HTMLInputElement | null> queryElement([ "id:ReturnDate" ]);
    if(inputElement == null) return null;

    const returnDate = this.parseDate(inputElement.value).getTime()

    return (isNaN(returnDate) ? null : returnDate);
  }

  extractReference() {
    let reference = ""
  
    const aElement = queryElement(["id:view1", "class:tabs", "a"]);
    if(aElement != null) reference = aElement.innerHTML.replace("Order No: ", "");
  
    return reference;
  }

  extractPropertyInfo() {
    const property = <Property> {}

    for(const i in orderFields) {
      const orderField = orderFields[i]
      const fieldElement = <HTMLInputElement> document.getElementById(orderField.documentId);
      property[orderField.actualId] = fieldElement.value;
    }

    return property;
  }

  extractTotalCost() {
    let totalCost = "0";

    const trElements = queryElement(["id:products", "id:product_table_", "table", "tbody"])?.children;
    const lastTrElement = trElements?.item(trElements.length - 1);
    const tdElements = lastTrElement?.children;
    const lastTdElement = tdElements?.item(tdElements.length - 1);
    if(lastTdElement != null) totalCost = (<HTMLInputElement> lastTdElement.firstChild).value;

    return totalCost;
  }

  extractType() {
    let type: string = "Residential";
  
    const selectElement = queryElement(["id:OrderType"]);
    const inputElement = queryElement(["id:OrderTypSubtyp"]);
    if(selectElement != null) {
      type = (<HTMLSelectElement> selectElement).value;
    } else if(inputElement != null) {
      type = (<HTMLInputElement> inputElement).value;
    }
  
    return type;
  }

  extractCouncil() {
    let council = (<HTMLSelectElement> queryElement(["id:CouncilAuthority"])).value;
    return council;
  }

  extractWater() {
    let water = (<HTMLSelectElement> queryElement(["id:WaterAuthority"])).value;
    return water;
  }

  extractProducts() {
    const tbodyElement = queryElement(["id:products", "id:product_table_", "table", "tbody"]);
    if(tbodyElement == null) return;
  
    let trElements = Array.from(tbodyElement.getElementsByTagName("tr"))
      .filter((trElement: HTMLTableRowElement) => {
        const tdElement0 = <HTMLTableDataCellElement> trElement.children.item(0);
        const tdElement8 = <HTMLTableDataCellElement> trElement.children.item(8);
        if(tdElement0.hasAttribute("style") || tdElement0.hasAttribute("bgcolor")) return false;
  
        const name = tdElement0.innerText;
        if(name === "Invoice" || name.length === 0) return false;
        const cost = (<HTMLInputElement> tdElement8.firstChild)?.value
        if(cost == null) return false;
        return true;
      });
    
    const products = <Product[]> trElements
      .map((trElement: HTMLTableRowElement) => {
        let tdElement0 = <HTMLTableDataCellElement | HTMLSpanElement> trElement.children.item(0);
        const tdElement4 = <HTMLTableDataCellElement> trElement.children.item(4);
        const tdElement8 = <HTMLTableDataCellElement> trElement.children.item(8);
        const product = <Product> {}
  
        const iElement = queryElement(["i"], tdElement0);
        if(iElement != null) tdElement0 = <HTMLSpanElement> iElement;
        product.name = tdElement0.innerText.replace(/(&[A-Za-z]+;)+/g, "").replace("     - ", "");
        if(tdElement4.innerHTML !== "") {
          let dateArray = tdElement4.innerHTML.split("-").map(dateItem => parseInt(dateItem));
          product.returned = new Date(dateArray[2], dateArray[1] - 1, dateArray[0]).toDateString();
        }
        product.cost = (<HTMLInputElement> tdElement8.firstChild)?.value;
  
        return product;
      });
  
    return products
  }

  extractFiles() {

    const files: Files[] = [];

    const documentStoreElement = document.getElementById("documentstore");
    if(documentStoreElement == null) return;
    const trElements = Array.from(documentStoreElement?.getElementsByTagName("tr"));

    trElements.forEach(trElement => {
      const thElements = Array.from(trElement.getElementsByTagName("th"));
      if(thElements.length > 0) {
        const title = thElements[0].innerText;
        files.push({ title, files: [] });
      } else {
        const tdElements = Array.from(trElement.getElementsByTagName("td"));
        if(tdElements.length < 2) return;

        const inputElement = tdElements[0].getElementsByTagName("input").item(0);
        let name = inputElement?.value;
        if(name == null) {
          name = tdElements[0].innerText;
          if(name == null) return;
        }

        const aElement = tdElements[1].getElementsByTagName("a").item(0);
        const url = aElement?.href;
        if(url == null) return;

        files[files.length - 1].files.push({ name, url });

      }
    });

    return files;

  }

  parseDate(dateString: string) {

    const dateArray = dateString
      .split("/")
      .map((dateItem: string) => parseInt(dateItem));
    return new Date(dateArray[2], dateArray[1] - 1, dateArray[0]);
    
  }

}


new CMS();