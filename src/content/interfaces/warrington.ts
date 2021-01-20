import chromep from "chrome-promise";
import _ from "lodash";
import { Building, Planning, Storage } from "../../lib/interfaces";
import { createNotification, queryElement, sanitizeNbsp, sanitizeNewLine } from "../../lib/utils";
import { buildingFields, monthStringToNumber, planningFields } from "../../lib/vars";

setTimeout(() => {
  checkSignature();
}, 500);

function checkSignature() {
  const h1Element = <HTMLHeadingElement> queryElement(
    [ "id:content", "class:row", "class:columns", "class:editor", "form", "h1" ]
  );
  if(h1Element.innerText === "Planning Application Details") {
    updatePlanningInfo();
  } else if(h1Element.innerText === "Building Control Details") {
    updateBuildingInfo();
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
  const formElement = <HTMLFormElement> queryElement(
    [ "id:content", "class:row", "class:columns", "class:editor", "form" ]
  );

  const planning = <Planning> {}

  let pElementArray = Array.from(formElement.getElementsByTagName("p"));
  const h2ElementArray = Array.from(formElement.getElementsByTagName("h2"));

  const tabContentElement = formElement.getElementsByClassName("tabContent").item(0);
  if(tabContentElement != null) {
    pElementArray.push(
      ...Array.from(tabContentElement.getElementsByTagName("p"))
    );
  }

  const elementArray = [ ...pElementArray, ...h2ElementArray ]

  elementArray.map((element: HTMLElement, i: number, pElemenetArr: HTMLElement[]) => {
      let textArray = element.innerText.split(":\n");

      if(element.innerText.includes("Decision:")) {
        textArray = element.innerText
          .replace(/\u00a0/g, " ")
          .split(": ");
      }

      if(textArray[0] === "Main Location:") {
        textArray[0] = textArray[0].replace(":", "");
        textArray[1] = pElemenetArr[i + 1].innerText.replace(":", "");
      }
      if(textArray.length !== 2) return;

      const name = textArray[0].replace(/\u00a0/g, " ");
      const value = textArray[1];
      if(name == null || value == null) return;

      planningFields.map(planningField => {
        if(planningField.documentId === name)
          planning[planningField.actualId] = value;
      });
    });

  return planning;
}

async function updateBuildingInfo() {
  const storage = <Storage> await chromep.storage.local.get();

  let building = <Building> extractBuildingInfo();
  if(building == null) return;

  if(building.decisionDate != null &&
    typeof(building.decisionDate) === "string"
  ) {

    building.decisionDate = parseDate(building.decisionDate).getTime();
  }

  if(building.receieved != null &&
    typeof(building.applicationReceivedDate) === "string"
  ) {
    building.applicationReceivedDate = parseDate(building.applicationReceivedDate).getTime();
  }
  
  if(!_.isEqual(building, storage.building)) {
    const notification = createNotification({ severity: "info", text: "Building Info Extracted" }, 3);
    console.log("Building Info Extracted");
    chrome.storage.local.set({ building, notification });
  }
}

function extractBuildingInfo() {
  const formElement = <HTMLFormElement> queryElement(
    [ "id:content", "class:row", "class:columns", "class:editor", "form" ]
  );

  const building = <Building> {}

  let pElementArray = Array.from(formElement.getElementsByTagName("p"));

  pElementArray.map((pElement: HTMLParagraphElement) => {
      let textArray = sanitizeNewLine(sanitizeNbsp(pElement.innerText)).split(":")
      if(textArray[0] === "Decision") {
        building.decision = textArray[1].replace("Decision Date", "") || undefined;
        building.decisionDate = textArray[2].replace("Conditions", "") || undefined;
        return;
      }
      if(textArray.length !== 2) return;

      if(textArray[0] == null || textArray[1] == null) return;
      const name = textArray[0];
      const value = textArray[1];

      buildingFields.map(buildingField => {
        if(buildingField.documentId === name) building[buildingField.actualId] = value;
      });
    });

  return building;
}

function parseDate(dateString: string) {

  const dateArray = dateString
    .split("-")
    .map((dateItem: string) => dateItem);

  const monthNumber = monthStringToNumber.find(conversion => {
    return conversion.matches.includes(dateArray[1].toLowerCase())}
  )?.number || 0;

  return new Date(parseInt(dateArray[2]), monthNumber, parseInt(dateArray[0]));
  
}