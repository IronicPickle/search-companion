import chromep from "chrome-promise";
import _ from "lodash";
import { Order, Product } from "../../lib/interfaces";
import { injectIndicator, queryElement } from "../../lib/utils";
import { interfaceCheckInterval, orderFields } from "../../lib/vars";

const indicatorElement = injectIndicator();
checkSignature();

chrome.storage.onChanged.addListener(() => {
  checkSignature();
});

async function checkSignature() {
  const terraProduct = getTerraProduct();
  if(terraProduct == null) return;
  if(queryElement(["class:report_details"]) != null) {
    indicatorElement.style.display = "block";
    injectOrderData();
  } else if(queryElement(["class:op_tiles"]) != null) {
    indicatorElement.style.display = "block";
    injectHazardData();
  } else { indicatorElement.style.display = "none"; }
}

async function getTerraProduct(): Promise<Product | null> {
  const order = <Order> (await chromep.storage.local.get()).order;
  const terraProduct = order.products.filter(product => product.name.includes("TerraSearch"))[0];

  return terraProduct;
}

async function injectHazardData() {
  const order = <Order> (await chromep.storage.local.get()).order;
  const terraProduct = await getTerraProduct();
  if(terraProduct == null) return;
  const property = order.property;

  (<HTMLSelectElement> queryElement(["class:search_type_values"])).value = "Coal";
  (<HTMLInputElement> queryElement(["id:postcode"])).value = property.postCode;
}

async function injectOrderData() {
  const order = <Order> (await chromep.storage.local.get()).order;
  const terraProduct = await getTerraProduct();
  if(terraProduct == null) return;
  const type = getType(terraProduct.name);
  const property = order.property;
  
  if(type != null) (<HTMLSelectElement> queryElement(["id:product_type_select"])).value = type;
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
  (<HTMLInputElement> queryElement(["id:new_build"])).checked = (
    property.plotNumber.length > 0 ||
    property.developmentName.length > 0 || 
    property.developer.length > 0
  );
}

function getType(name: string) {
  if(name.includes("Coal Extra")) return "Coal Extra";
  if(name.includes("Coal")) return "Coal";
  if(name.includes("Con29M")) return "CON29M";
  return null;
}