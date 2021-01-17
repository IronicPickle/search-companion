import chromep from "chrome-promise";
import _ from "lodash";
import { Order, Product } from "../../lib/interfaces";
import { createNotification, queryElement } from "../../lib/utils";

setTimeout(() => checkSignature(), 500);

chrome.storage.onChanged.addListener((changes) => {
  if(changes.order != null) checkSignature();
});

async function checkSignature() {
  const caProduct = getCAProduct();
  if(caProduct == null) return;
  if(queryElement([
    "id:maincontentarea",
    "class:standard-content",
    "class:inferisContainer",
    "class:pageTitle"]) != null) {
    injectOrderData();
    if(await injectOrderData() == null) return;
    console.log("Order Info Injected");
    const notification = createNotification({ severity: "info", text: "Order Info Injected" }, 0);
    chrome.storage.local.set({ notification });

  }
}

async function getCAProduct(): Promise<Product | null> {
  const order = <Order> (await chromep.storage.local.get()).order;
  if(order == null) return null;
  const caProduct = order.products.filter(
    product => product.name.includes("Coal Authority")
  )[0];

  return caProduct;
}

async function injectOrderData(): Promise<boolean | undefined> {
  const order = <Order> (await chromep.storage.local.get()).order;
  const caProduct = await getCAProduct();
  if(caProduct == null) return;
  const property = order.property;

  const postCodeInput = (<HTMLInputElement> queryElement(["id:datapage:subform:addressSearch:simpleAddressSearch:postcode"]));
  if(postCodeInput != null) postCodeInput.value = property.postCode;

  const nameOrNumberInput = (<HTMLInputElement> queryElement(["id:datapage:subform:addressSearch:simpleAddressSearch:propertyNameNumber"]));
  if(nameOrNumberInput != null) {
    if(property.houseName != null) nameOrNumberInput.value = property.houseName;
    if(property.houseNumber != null) nameOrNumberInput.value = property.houseNumber;
  }

  const residentialInput = (<HTMLInputElement> queryElement(["id:datapage:subform:residential"]));
  const commercialInput = (<HTMLInputElement> queryElement(["id:datapage:subform:nonResidential"]));
  if(residentialInput != null && commercialInput != null) {
    if(order.type === "Residential") {
      residentialInput.checked = true;
    } else if(order.type === "Commercial") {
      commercialInput.checked = true;
    }
  }

  const con29MInput = (<HTMLInputElement> queryElement(["id:datapage:subform:j_id_q_j:0:selectCheckbox"]));
  if(con29MInput != null && caProduct.name.toLowerCase().includes("con29m")) {
    con29MInput.checked = true;

    const selectEvent = new Event("change", {
      bubbles: true,
      cancelable: true,
    });
    con29MInput.dispatchEvent(selectEvent);
  }

  const referenceInput = (<HTMLInputElement> queryElement(["id:datapage:subform:j_id_q_l:0:reportRef"]));
  if(referenceInput != null) referenceInput.value = order.reference;

  return true;
}