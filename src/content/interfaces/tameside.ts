import chromep from "chrome-promise";
import _ from "lodash";
import { Building } from "../../lib/interfaces";
import { createNotification, queryElement } from "../../lib/utils";
import { buildingFields } from "../../lib/vars";

setTimeout(() => {
  checkSignature();
}, 500);

function checkSignature() {
  const buttonElement = <HTMLButtonElement> queryElement(["name:Form_3"]);
  if(buttonElement != null) {
    updateBuildingInfo();
  }
}

async function updateBuildingInfo() {
  const storage = await chromep.storage.local.get();

  let building = extractBuildingInfo();
  if(building == null) return;

  if(building.decisionDate != null &&
    typeof(building.decisionDate) === "string") {

    building.decisionDate = parseDate(building.decisionDate).getTime();
  }

  if(building.applicationReceivedDate != null &&
    typeof(building.applicationReceivedDate) === "string") {

    building.applicationReceivedDate = parseDate(building.applicationReceivedDate).getTime();
  }
  
  if(!_.isEqual(building, storage.building)) {
    const notification = createNotification({ severity: "info", text: "Building Info Extracted" }, 3);
    console.log("Building Info Extracted");
    chrome.storage.local.set({ building, notification });
  }
}

function extractBuildingInfo() {
  const tbodyElement = <HTMLTableElement> queryElement(["class:aligncenter", "tbody"]);
  if(tbodyElement == null) return;

  const building = <Building> {}

  Array.from(tbodyElement.getElementsByTagName("tr"))
    .map((trElement: HTMLTableRowElement) => {
      const tdElement0 = <HTMLTableHeaderCellElement> trElement.children.item(0);
      const tdElement2 = <HTMLTableDataCellElement> trElement.children.item(2);

      const name = tdElement0.innerText;
      const value = tdElement2.innerText;
      if(name == null || value == null) return;

      buildingFields.map(buildingField => {
        if(buildingField.documentId === name) {
          building[buildingField.actualId] = value;
        }
      });
    });

  return building;
}

function parseDate(dateString: string) {

  const dateArray = dateString
    .split("/")
    .map((dateItem: string) => parseInt(dateItem));
  return new Date(dateArray[2], dateArray[1] - 1, dateArray[0]);
  
}