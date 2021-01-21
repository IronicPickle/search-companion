import chromep from "chrome-promise";
import _ from "lodash";
import { Building, Planning} from "../../lib/interfaces";
import { createNotification, queryElement } from "../../lib/utils";
import { buildingFields, planningFields } from "../../lib/vars";

setTimeout(() => {
  checkSignature();
}, 500);

function checkSignature() {
  const spanElement = <HTMLSpanElement> queryElement(["id:pageheading", "h1", "strong"]);
  const dataType = spanElement?.innerHTML;
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

  planning = (!checkIfNewPage()) ? { ...storage.planning, ...planning } : planning;
  
  if(!_.isEqual(planning, storage.planning)) {
    const notification = createNotification({ severity: "info", text: "Planning Info Extracted" }, 2);
    console.log("Planning Info Extracted");
    chrome.storage.local.set({ planning, notification });
  }
}

function extractPlanningInfo() {
  const tbodyElement = queryElement(["id:simpleDetailsTable", "tbody"]) || 
    queryElement(["id:applicationDetails", "tbody"]);
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
        if(planningField.documentId === name.toLowerCase())
          planning[planningField.actualId] = value;
      });
    });

  return planning;
}

async function updateBuildingInfo() {
  const storage = await chromep.storage.local.get();

  let building = extractBuildingInfo();
  if(building == null) return;


  if(building.decisionDate != null)
    building.decisionDate = new Date(building.decisionDate).getTime();

  if(building.applicationReceivedDate != null)
    building.applicationReceivedDate = new Date(building.applicationReceivedDate).getTime();

  building = (!checkIfNewPage()) ? { ...storage.building, ...building } : building;
  
  if(!_.isEqual(building, storage.building)) {
    const notification = createNotification({ severity: "info", text: "Building Info Extracted" }, 3);
    console.log("Building Info Extracted");
    chrome.storage.local.set({ building, notification });
  }
}

function extractBuildingInfo() {
  const tbodyElement = queryElement(["id:simpleDetailsTable", "tbody"]) || 
    queryElement(["id:applicationDetails", "tbody"]);
  if(tbodyElement == null) return;

  const building = <Building> {}

  Array.from(tbodyElement.getElementsByTagName("tr"))
    .map((trElement: HTMLTableRowElement) => {
      const tdElement0 = <HTMLTableHeaderCellElement> trElement.children.item(0);
      const tdElement1 = <HTMLTableDataCellElement> trElement.children.item(1);

      const name = tdElement0.innerText;
      const value = tdElement1.innerText;
      if(name == null || value == null) return;

      buildingFields.map(buildingField => {
        if(buildingField.documentId === name.toLowerCase())
        building[buildingField.actualId] = value;
      });
    });

  return building;
}

function checkIfNewPage() {
  let isNewPage = false;

  isNewPage = document.getElementsByClassName("active").length === 1;

  const subtabSummaryElement = <HTMLSpanElement> queryElement([ "id:subtab_summary" ]);
  if(subtabSummaryElement != null)
    isNewPage = subtabSummaryElement.className === "active";

  return isNewPage;
}