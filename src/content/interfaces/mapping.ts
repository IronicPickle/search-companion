import chromep from "chrome-promise";
import _ from "lodash";
import { Mapping} from "../../lib/interfaces";
import { queryElement } from "../../lib/utils";

checkSignature();

function checkSignature() {
  if(queryElement(["embed"]) != null) {
    updateMappingInfo();
  }
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