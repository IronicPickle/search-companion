import chromep from "chrome-promise";
import _ from "lodash";
import { Order, Product } from "../../lib/interfaces";
import { createNotification, queryElement } from "../../lib/utils";

setTimeout(() => checkSignature(), 500);

chrome.storage.onChanged.addListener((changes) => {
  if(changes.order != null) checkSignature();
});

async function checkSignature() {
  const terraProduct = getUUProduct();
  if(terraProduct == null) return;
  if(queryElement([
    "class:c-order-wizard__step-header",
    "class:o-wrapper__inner",
    "h1"]) != null) {
    injectOrderData();
    if(await injectOrderData() == null) return;
    console.log("Order Info Injected");
    const notification = createNotification({ severity: "info", text: "Order Info Injected" }, 0);
    chrome.storage.local.set({ notification });

  }
}

async function getUUProduct(): Promise<Product | null> {
  const order = <Order> (await chromep.storage.local.get()).order;
  if(order == null) return null;
  const terraProduct = order.products.filter(
    product => product.name.includes("(Con29 DW) - United Utilities Water")
  )[0];

  return terraProduct;
}

async function injectOrderData(): Promise<boolean | undefined> {
  const order = <Order> (await chromep.storage.local.get()).order;
  const uuProduct = await getUUProduct();
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