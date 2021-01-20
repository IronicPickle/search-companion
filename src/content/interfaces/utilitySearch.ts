import chromep from "chrome-promise";
import _ from "lodash";
import { Order, Product } from "../../lib/interfaces";
import { createNotification, queryElement } from "../../lib/utils";

setTimeout(() => checkSignature(), 500);

chrome.storage.onChanged.addListener((changes) => {
  if(changes.order != null) checkSignature();
});

async function checkSignature() {
  const utilityProduct = await getUtilityProduct();
  if(utilityProduct == null) return;

  const bElement = <HTMLSpanElement | null> queryElement(["table#5", "tbody", "tr#1", "td#1", "font", "strong"]);
  if(bElement == null) return;


  if(bElement.innerText === "Network Boundaries & Area Check") {
    if(await injectAreaCheckData() == null) return;
    console.log("Area Check Info Injected");
    const notification = createNotification({ severity: "info", text: "Order Info Injected" }, 0);
    chrome.storage.local.set({ notification });

  } else if(bElement.innerText === "Submit Search Request") {
    if(await injectSearchRequestData() == null) return;
    console.log("Order Info Injected");
    const notification = createNotification({ severity: "info", text: "Order Info Injected" }, 0);
    chrome.storage.local.set({ notification });
  }
}

async function getUtilityProduct(): Promise<Product | null> {
  const order = <Order> (await chromep.storage.local.get()).order;
  if(order == null) return null;
  const utilityProduct = order.products.filter(
    product => product.name.includes("Gas and Electric") || product.name.includes("Gas Distributions")
  )[0];

  return utilityProduct;
}

async function injectAreaCheckData(): Promise<boolean | undefined> {
  const order = <Order> (await chromep.storage.local.get()).order;
  const utilityProduct = await getUtilityProduct();
  if(utilityProduct == null) return;
  const property = order.property;


  (<HTMLInputElement> queryElement(["name:txtSearchText"])).value = property.postCode;

  return true;
}

async function injectSearchRequestData(): Promise<boolean | undefined> {
  const order = <Order> (await chromep.storage.local.get()).order;
  const utilityProduct = await getUtilityProduct();
  if(utilityProduct == null) return;
  const productType = getProductType(utilityProduct.name);
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

function getProductType(name: string) {
  name = name.toLowerCase();
  if(name.includes("gas distributions")) return "SupplierCompanyID-3";
  if(name.includes("gas and electric")) return "SupplierCompanyID-1687";
  return null;
}