import chromep from "chrome-promise";
import _ from "lodash";
import { Order, Product, Property } from "../../lib/interfaces";
import { orderFields } from "../../lib/vars";
import { createNotification, queryElement } from "../../lib/utils";
import { interfaceCheckInterval } from "../../lib/vars";
import Interface from "../Interface";

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
    
    return order;
  }

  async saveOrderInfo(order: Order) {
    const storage = await chromep.storage.local.get();

    if(!_.isEqual(order, storage.order)) {
      const notification = createNotification({ severity: "info", text: "Order Info Extracted" }, 0);
      console.log("[${this.name}] Saved order info to storage");
      chrome.storage.local.set({ order, notification });
      chrome.storage.local.remove([ "planning", "building" ]);
    }
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

}

new CMS();