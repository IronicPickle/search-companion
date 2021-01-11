import chromep from "chrome-promise";
import _ from "lodash";
import { Building, Planning} from "../../lib/interfaces";
import { createNotification, queryElement } from "../../lib/utils";
import { interfaceCheckInterval } from "../../lib/vars";

setInterval(() => {
  checkSignature();
}, interfaceCheckInterval)

function checkSignature() {
  const titleElement = queryElement(["id:pageheading", "h1", "strong"]);
  const dataType = titleElement?.innerHTML;
  if(dataType === "Planning") {
    updatePlanningInfo();
  } else if(dataType === "Building Control") {
    updateBuildingInfo();
  }
}

async function updatePlanningInfo() {
  const storage = await chromep.storage.local.get();

  let planning = extractPlanningInfo();
  if(planning == null) return;

  if(planning.decisionIssuedDate != null)
    planning.decisionIssuedDate = new Date(planning.decisionIssuedDate).getTime();

  if(planning.decisionMadeDate != null)
    planning.decisionMadeDate = new Date(planning.decisionMadeDate).getTime();

  if(planning.applicationReceivedDate != null)
    planning.applicationReceivedDate = new Date(planning.applicationReceivedDate).getTime();

  planning = { ...storage.planning, ...planning }
  
  if(!_.isEqual(planning, storage.planning)) {
    const notification = createNotification({ severity: "info", text: "Planning Info Extracted" }, 2);
    console.log("Planning Info Extracted");
    chrome.storage.local.set({ planning, notification });
  }
}

const planningFields = [
  { documentId: "Reference", actualId: "reference" },
  { documentId: "Proposal", actualId: "descripton" },
  { documentId: "Address", actualId: "address" },
  { documentId: "Decision", actualId: "decision" },
  { documentId: "Decision Issued Date", actualId: "decisionIssuedDate" },
  { documentId: "Decision Made Date", actualId: "decisionMadeDate" },
  { documentId: "Application Received", actualId: "applicationReceivedDate" },
  { documentId: "Application Received Date", actualId: "applicationReceivedDate" }
]

function extractPlanningInfo() {
  const tbodyElement = queryElement(["id:simpleDetailsTable", "tbody"]);
  if(tbodyElement == null) return;

  const planning = <Planning> {}

  Array.from(tbodyElement.getElementsByTagName("tr"))
    .map((trElement: HTMLTableRowElement) => {
      const tdElement0 = <HTMLTableHeaderCellElement> trElement.children.item(0);
      const tdElement1 = <HTMLTableDataCellElement> trElement.children.item(1);

      const name = tdElement0.innerText;
      const value = tdElement1.innerText;
      if(name == null || value == null) return;

      planningFields.map(planningField => {
        if(planningField.documentId === name)
          planning[planningField.actualId] = value;
      });
    });

  return planning;
}

async function updateBuildingInfo() {
  const storage = await chromep.storage.local.get();

  let building = extractBuildingInfo();
  if(building == null) return;

  if(building.decisionIssuedDate != null)
    building.decisionIssuedDate = new Date(building.decisionIssuedDate).getTime();

  if(building.decisionMadeDate != null)
    building.decisionMadeDate = new Date(building.decisionMadeDate).getTime();

  if(building.applicationReceivedDate != null)
    building.applicationReceivedDate = new Date(building.applicationReceivedDate).getTime();

    building = { ...storage.building, ...building }
  
  if(!_.isEqual(building, storage.building)) {
    const notification = createNotification({ severity: "info", text: "Building Info Extracted" }, 3);
    console.log("Building Info Extracted");
    chrome.storage.local.set({ building, notification });
  }
}

const buildingFields = [
  { documentId: "Application Reference Number", actualId: "reference" },
  { documentId: "Description Of Works", actualId: "descripton" },
  { documentId: "Site Address", actualId: "address" },
  { documentId: "Status", actualId: "status" },
  { documentId: "Application Received", actualId: "applicationReceivedDate" }
]

function extractBuildingInfo() {
  const tbodyElement = queryElement(["id:simpleDetailsTable", "tbody"]);
  if(tbodyElement == null) return;

  const planning = <Building> {}

  Array.from(tbodyElement.getElementsByTagName("tr"))
    .map((trElement: HTMLTableRowElement) => {
      const tdElement0 = <HTMLTableHeaderCellElement> trElement.children.item(0);
      const tdElement1 = <HTMLTableDataCellElement> trElement.children.item(1);

      const name = tdElement0.innerText;
      const value = tdElement1.innerText;
      if(name == null || value == null) return;

      buildingFields.map(buildingField => {
        if(buildingField.documentId === name)
          planning[buildingField.actualId] = value;
      });
    });

  return planning;
}