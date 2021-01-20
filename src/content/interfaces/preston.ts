import chromep from "chrome-promise";
import _ from "lodash";
import { Planning, Storage } from "../../lib/interfaces";
import { createNotification, queryElement } from "../../lib/utils";
import { planningFields } from "../../lib/vars";

setTimeout(() => {
  checkSignature();
}, 500);

function checkSignature() {
  const h1Element = <HTMLHeadingElement> queryElement([ "id:lblFormTitle1" ]);
  if(h1Element.innerText === "Planning application details") {
    updatePlanningInfo();
  }
}

async function updatePlanningInfo() {
  const storage = <Storage> await chromep.storage.local.get();

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
  const divElement = <HTMLDivElement> queryElement(
    [ "id:MainContent_lblPlanningDetails", "div", "id:applicationcontainer", "id:applicationdetails" ]
  );

  const planning = <Planning> {}

  Array.from(<HTMLCollectionOf<HTMLDivElement>> divElement.getElementsByClassName("divRow"))
    .map((element: HTMLDivElement) => {
      let textArray = element.innerText.split(": ");

      if(textArray.length !== 2) return;

      let name = textArray[0];
      let value = textArray[1];
      if(name == null || value == null) return;

      planningFields.map(planningField => {
        if(planningField.documentId === name)
          planning[planningField.actualId] = value;
      });
    });

  return planning;
}

function parseDate(dateString: string) {

  const dateArray = dateString
    .split("/")
    .map((dateItem: string) => parseInt(dateItem));
  return new Date(dateArray[2], dateArray[1] - 1, dateArray[0]);
  
}