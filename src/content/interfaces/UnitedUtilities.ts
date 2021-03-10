import chromep from "chrome-promise";
import _ from "lodash";
import { Order, Product } from "../../lib/interfaces";
import { createNotification, queryElement } from "../../lib/utils";
import Interface from "../Interface";

class UnitedUtilities extends Interface {
  constructor() {
    const signatures = {
      orderInfo: {
        signature: () => this.getUUProduct() != null && queryElement(["class:c-order-wizard__step-header", "class:o-wrapper__inner", "h1"]) != null,
        handler: async () => {
          if(await this.injectOrderData() == null) return;
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

  async getUUProduct(): Promise<Product | null> {
    const order = <Order> (await chromep.storage.local.get()).order;
    if(order == null) return null;
    const terraProduct = order.products.filter(
      product => product.name.includes("(Con29 DW) - United Utilities Water")
    )[0];

    return terraProduct;
  }

  async injectOrderData(): Promise<boolean | undefined> {
    const order = <Order> (await chromep.storage.local.get()).order;
    const uuProduct = await this.getUUProduct();
    if(uuProduct == null) return;

    const referenceInput = (<HTMLSelectElement> queryElement([
      "id:SaveAddress",
      "class:o-row--2col",
      "class:o-col",
      "class:c-form__element",
      "class:c-form__element-control--inline-block-full",
      "input"
    ]));

    if(referenceInput != null) referenceInput.value = order.reference;

    return true;
  }
}

new UnitedUtilities();