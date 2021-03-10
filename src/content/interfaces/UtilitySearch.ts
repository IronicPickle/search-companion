import chromep from "chrome-promise";
import _ from "lodash";
import { Order, Product } from "../../lib/interfaces";
import { createNotification, queryElement } from "../../lib/utils";
import Interface from "../Interface";

class UtilitySearch extends Interface {
  constructor() {
    const signatures = {
      areaCheck: {
        signature: () => {
          if(this.getUtilityProduct() == null) return false;
          const bElement = <HTMLSpanElement | null> queryElement(["table#5", "tbody", "tr#1", "td#1", "font", "strong"]);
          if(bElement == null) return false;
          return bElement.innerText === "Network Boundaries & Area Check";
        },
        handler: async () => {
          if(await this.injectAreaCheckData() == null) return;
          console.log(`[${this.name}] Area Check Info Injected`);
          const notification = createNotification({ severity: "success", text: "Area Check Info Injected" }, 0);
          chrome.storage.local.set({ notification });
        }
      },
      orderInfo: {
        signature: () => {
          if(this.getUtilityProduct() == null) return false;
          const bElement = <HTMLSpanElement | null> queryElement(["table#5", "tbody", "tr#1", "td#1", "font", "strong"]);
          if(bElement == null) return false;
          return bElement.innerText === "Submit Search Request";
        },
        handler: async () => {
          if(await this.injectSearchRequestData() == null) return;
          console.log(`[${this.name}] Order Info Injected`);
          const notification = createNotification({ severity: "success", text: "Order Info Injected" }, 0);
          chrome.storage.local.set({ notification });
        }
      }
    }

    super(signatures);
    this.startTimeout(500);

    chrome.storage.onChanged.addListener((changes) => {
      if(changes.order != null) this.start();
    });
    console.log(`[${this.name}] Interface ready`);
  }

  async getUtilityProduct(): Promise<Product | null> {
    const order = <Order> (await chromep.storage.local.get()).order;
    if(order == null) return null;
    const utilityProduct = order.products.filter(
      product => product.name.includes("Gas and Electric") || product.name.includes("Gas Distributions")
    )[0];

    return utilityProduct;
  }

  async injectAreaCheckData(): Promise<boolean | undefined> {
    const order = <Order> (await chromep.storage.local.get()).order;
    const utilityProduct = await this.getUtilityProduct();
    if(utilityProduct == null) return;
    const property = order.property;


    (<HTMLInputElement> queryElement(["name:txtSearchText"])).value = property.postCode;

    return true;
  }

  async injectSearchRequestData(): Promise<boolean | undefined> {
    const order = <Order> (await chromep.storage.local.get()).order;
    const utilityProduct = await this.getUtilityProduct();
    if(utilityProduct == null) return;
    const productType = this.getProductType(utilityProduct.name);
    const property = order.property;
    
    const productTypeInput = (<HTMLInputElement> queryElement([`name:${productType}`]));
    if(productType != null) productTypeInput.checked = true;
    (<HTMLInputElement> queryElement(["name:YourRef"])).value = order.reference;
    (<HTMLInputElement> queryElement(["name:SitePostcode"])).value = property.postCode;
    const addressLine0 = `${property.houseNumber || property.houseName || property.companyName} ${property.street}`;
    (<HTMLInputElement> queryElement(["name:SiteAddress1"])).value = addressLine0;
    (<HTMLInputElement> queryElement(["name:SiteAddress2"])).value = property.addressLine2;
    (<HTMLInputElement> queryElement(["name:SiteAddress3"])).value = property.locality;
    (<HTMLInputElement> queryElement(["name:SiteAddress4"])).value = property.town;
    (<HTMLInputElement> queryElement(["name:SiteAddress5"])).value = property.county;

    return true;
  }

  getProductType(name: string) {
    name = name.toLowerCase();
    if(name.includes("gas distributions")) return "SupplierCompanyID-3";
    if(name.includes("gas and electric")) return "SupplierCompanyID-1687";
    return null;
  }
}

new UtilitySearch();