import chromep from "chrome-promise";
import _ from "lodash";
import { Building, Planning} from "../../lib/interfaces";
import { createNotification, queryElement } from "../../lib/utils";
import { buildingFields, planningFields } from "../../lib/vars";

setTimeout(() => {
  checkSignature();
}, 500);

function checkSignature() {
  const h1Element = <HTMLHeadingElement> queryElement([
    "class:container", "class:main", "class:content", "h1"
  ]);
  const spanElement = <HTMLSpanElement> queryElement([
    "id:ctl00_DefaultContent_PageHeaderLabel"
  ]);
  if(spanElement != null) {
    updateBuildingInfo();
  } else if(h1Element != null) {
    if(h1Element.innerText.includes("Application")) updatePlanningInfo();
  }
}

async function updatePlanningInfo() {
  const storage = await chromep.storage.local.get();

  let planning = extractPlanningInfo();
  if(planning == null) return;

  if(planning.decisionMadeDate != null &&
    typeof(planning.decisionMadeDate) === "string") {

      planning.decisionMadeDate = parseDate(planning.decisionMadeDate).getTime();
  }

  if(planning.applicationReceivedDate != null &&
    typeof(planning.applicationReceivedDate) === "string") {

      planning.applicationReceivedDate = parseDate(planning.applicationReceivedDate).getTime();
  }
  
  if(!_.isEqual(planning, storage.planning)) {
    const notification = createNotification({ severity: "info", text: "Planning Info Extracted" }, 2);
    console.log("Planning Info Extracted");
    chrome.storage.local.set({ planning, notification });
  }
}

function extractPlanningInfo() {
  const tbodyElement = <HTMLTableElement> queryElement([
    "class:download_box", "class:planningTable", "tbody"
  ]);
  if(tbodyElement == null) return;

  const planning = <Planning> {}

  const referenceElement = <HTMLHeadingElement> queryElement([
    "class:container", "class:main", "class:content", "h1"
  ]);
  if(referenceElement != null) planning.reference = referenceElement.innerText.replace("Application ", "");

  const descriptionElement = <HTMLHeadingElement> queryElement([
    "class:container", "class:main", "class:content", "class:first"
  ]);
  if(descriptionElement != null) planning.descripton = descriptionElement.innerText.split("Track this application\n")[1]

  Array.from(tbodyElement.getElementsByTagName("tr"))
  .map((trElement: HTMLTableRowElement) => {
    const tdElement0 = <HTMLTableHeaderCellElement> trElement.children.item(0);
    const tdElement1 = <HTMLTableDataCellElement> trElement.children.item(1);

    const name = tdElement0.innerText;
    const value = tdElement1.innerText;
    if(name == null || value == null) return;

    planningFields.map(planningField => {
      if(planningField.documentId === name) {
        if(name === "Development address") {
          planning.address = value.split("\nWard :")[0];
        } else if(name === "Decision") {
          planning.decision = value.split("\nDate :")[0];
          planning.decisionMadeDate = value.split("\nDate :")[1];
        } else if(name === "Key dates") {
          planning.applicationReceivedDate = value
            .split("\nRegistered : ")[1]
            .replace("Received : ", "");
        } else {
          planning[planningField.actualId] = value;
        }
      }
    });
  });

  return planning;
}

async function updateBuildingInfo() {
  const storage = await chromep.storage.local.get();

  let building = extractBuildingInfo();
  if(building == null) return;
  building.reference = extractBuildingReference();

  if(building.decisionDate != null &&
    typeof(building.decisionDate) === "string") {

    building.decisionDate = parseDate(building.decisionDate, true).getTime();
  }

  if(building.applicationReceivedDate != null &&
    typeof(building.applicationReceivedDate) === "string") {

    building.applicationReceivedDate = parseDate(building.applicationReceivedDate, true).getTime();
  }
  
  if(!_.isEqual(building, storage.building)) {
    const notification = createNotification({ severity: "info", text: "Building Info Extracted" }, 3);
    console.log("Building Info Extracted");
    chrome.storage.local.set({ building, notification });
  }
}

function extractBuildingReference() {
  const spanElement = <HTMLSpanElement> queryElement(
    [ "id:ctl00_DefaultContent_PageHeaderLabel" ]);
  if(spanElement == null) return;

  const reference = spanElement.innerText.replace("Details for Building Control Application - ", "");
  return reference;
}

function extractBuildingInfo() {
  const ulElement = <HTMLUListElement> queryElement(
    [ "id:ctl00_DefaultContent_DetailsView1", "class:AspNet-DetailsView-Data", "ul" ]);
  if(ulElement == null) return;

  const building = <Building> {}

  Array.from(ulElement.getElementsByTagName("li"))
    .map((liElement: HTMLLIElement) => {
      const spanElement0 = <HTMLSpanElement> liElement.children.item(0);
      const spanElement1 = <HTMLSpanElement> liElement.children.item(1);

      const name = spanElement0.innerText;
      const value = spanElement1.innerText;
      if(name == null || value == null) return;

      buildingFields.map(buildingField => {
        if(buildingField.documentId === name)
        building[buildingField.actualId] = value;
      });
    });

  return building;
}

function parseDate(dateString: string, reverse?: boolean) {

  const dateArray = dateString
    .split("/")
    .map((dateItem: string) => parseInt(dateItem));
  if(reverse) {
    return new Date(dateArray[2], dateArray[0] - 1, dateArray[1]);
  } else {
    return new Date(dateArray[2], dateArray[1] - 1, dateArray[0]);
  }
  
}