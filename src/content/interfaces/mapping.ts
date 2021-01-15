import chromep from "chrome-promise";
import _ from "lodash";
import { Mapping} from "../../lib/interfaces";
import { injectIndicator, queryElement } from "../../lib/utils";

const indicatorElement = injectIndicator();
checkSignature();

function checkSignature() {
  if(queryElement(["embed"]) != null) {
    indicatorElement.style.display = "block";
    updateMappingInfo();
  } else { indicatorElement.style.display = "none"; }
}

async function updateMappingInfo() {
  const storage = <Storage> await chromep.storage.local.get();
  if(storage.order == null) return;
  const mapping: Mapping | null = await extractCoordinates();
  if(mapping == null) return;
  
  if(!_.isEqual(mapping, storage.order.mapping)) {
    console.log("Mapping has changed, updating...");
    chrome.storage.local.set({ order: { mapping, ...storage.order } });
  }
}

async function extractCoordinates() {
  
  

  return null;
}