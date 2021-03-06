import chromep from "chrome-promise";
import _ from "lodash";
import { Order, Product } from "../../lib/interfaces";
import { createNotification, queryElement } from "../../lib/utils";
import Interface from "../Interface";

class Terra extends Interface {
  constructor() {
    const signatures = {
      orderInfo: {
        signature: () => this.getTerraProduct() != null && queryElement(["class:report_details"]) != null,
        handler: async () => {
          if(await this.injectOrderData() == null) return;
          console.log(`[${this.name}] Order Info Injected`);
          const notification = createNotification({ severity: "success", text: "Order Info Injected" }, 0);
          chrome.storage.local.set({ notification });
        }
      },
      hazardInfo: {
        signature: () => this.getTerraProduct() != null && queryElement(["class:op_tiles"]) != null,
        handler: async () => {
          if(await this.injectHazardData() == null) return;
          console.log(`[${this.name}] Hazard Info Injected`);
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

  async getTerraProduct(): Promise<Product | null> {
    const order = <Order> (await chromep.storage.local.get()).order;
    if(order == null) return null;
    const terraProduct = order.products.filter(
      product => product.name.includes("TerraSearch") || product.name.includes("Terrafirma")
    )[0];

    return terraProduct;
  }

  async injectHazardData(): Promise<boolean | undefined> {
    const order = <Order> (await chromep.storage.local.get()).order;
    const terraProduct = await this.getTerraProduct();
    if(terraProduct == null) return;
    const property = order.property;

    (<HTMLSelectElement> queryElement(["class:search_type_values"])).value = "Coal";
    (<HTMLInputElement> queryElement(["id:postcode"])).value = property.postCode;

    return true;
  }

  async injectOrderData(): Promise<boolean | undefined> {
    const order = <Order> (await chromep.storage.local.get()).order;
    const terraProduct = await this.getTerraProduct();
    if(terraProduct == null) return;
    const productType = this.getProductType(terraProduct.name);
    const property = order.property;
    
    const productTypeSelect = (<HTMLSelectElement> queryElement(["id:product_type_select"]));
    if(productType != null && productTypeSelect != null) productTypeSelect.value = productType;
    (<HTMLInputElement> queryElement(["id:search_ref"])).value = order.reference;
    (<HTMLInputElement> queryElement(["id:postcode"])).value = property.postCode;
    (<HTMLInputElement> queryElement(["id:house-name"])).value = property.houseName;
    (<HTMLInputElement> queryElement(["id:house-number"])).value = property.houseNumber;
    (<HTMLInputElement> queryElement(["id:street-name"])).value = property.street;
    (<HTMLInputElement> queryElement(["id:locale"])).value = property.locality;
    (<HTMLInputElement> queryElement(["id:town"])).value = property.town;
    (<HTMLInputElement> queryElement(["id:county"])).value = property.county;
    (<HTMLInputElement> queryElement(["id:land_reg"])).value = property.titleNumber;

    if(property.uprn !== "Not validated") {
      (<HTMLInputElement> queryElement(["id:uprn"])).value = property.uprn;
    } else {
      (<HTMLInputElement> queryElement(["id:uprn"])).value = "";
    }

    (<HTMLSelectElement> queryElement(["id:site_use_select"])).value = order.type;
    const newBuildInput = (<HTMLInputElement> queryElement(["id:new_build"]));
    if(newBuildInput != null) newBuildInput.checked = (
      property.plotNumber.length > 0 ||
      property.developmentName.length > 0 || 
      property.developer.length > 0
    );

    const keyupEvent = new Event("keyup", {
      bubbles: true,
      cancelable: true,
    });
    (<HTMLInputElement> queryElement(["id:search_ref"])).dispatchEvent(keyupEvent);
    (<HTMLInputElement> queryElement(["id:postcode"])).dispatchEvent(keyupEvent);
    const selectEvent = new Event("change", {
      bubbles: true,
      cancelable: true,
    });
    (<HTMLInputElement> queryElement(["id:product_type_select"])).dispatchEvent(selectEvent);
    (<HTMLInputElement> queryElement(["id:site_use_select"])).dispatchEvent(selectEvent);

    return true;
  }

  getProductType(name: string) {
    name = name.toLowerCase();
    if(name.includes("con29m")) return "CON29M";
    if(name.includes("coal extra")) return "Coal Extra";
    if(name.includes("coal")) return "Coal";
    return null;
  }
}

new Terra();