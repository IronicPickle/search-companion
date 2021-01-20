import chromep from "chrome-promise";
import _ from "lodash";
import { Planning, Storage } from "../../lib/interfaces";
import { createNotification, queryElement } from "../../lib/utils";
import { monthStringToNumber, planningFields } from "../../lib/vars";

setTimeout(() => {
  checkSignature();
}, 500);

function checkSignature() {
  const h1Element = <HTMLHeadingElement> queryElement(
    [ "id:inner-page-title", "h1" ]
  );
  if(h1Element.innerText === "Planning application search") {
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

  planning = (!await checkIfNewPage()) ? { ...storage.planning, ...planning } : planning;
  
  if(!_.isEqual(planning, storage.planning)) {
    const notification = createNotification({ severity: "info", text: "Planning Info Extracted" }, 2);
    console.log("Planning Info Extracted");
    chrome.storage.local.set({ planning, notification });
  }
}

function extractPlanningInfo() {
  const divElement = <HTMLFormElement> queryElement(
    [ "id:inner-main-content", "class:article-content", "class:tabs", "class:tabbody" ]
  );

  const planning = <Planning> {}

  const ulElement0 = <HTMLUListElement | null> queryElement([ "class:dataview#1", "ul" ], divElement);
  const ulElement1 = <HTMLUListElement | null> queryElement([ "class:dataview#2", "ul" ], divElement);

  if(ulElement0 == null || ulElement1 == null) return;

  const elementArray = [
    ...<HTMLElement[]> Array.from(ulElement0.children),
    ...<HTMLElement[]> Array.from(ulElement1.children)
  ]

  elementArray.map((element: HTMLElement, i: number, pElemenetArr: HTMLElement[]) => {
    let textArray = element.innerText.split("\n");

    if(textArray.length !== 2) return;

    let name = textArray[0];
    let value = textArray[1];
    if(name == null || value == null) return;

    if(name === "Decision") {
      if(value === "\u00a0 \u00a0") return;
      const [ decision, decisionDate ] = value.split("\u00a0 ");
      planning.decision = decision;
      planning.decisionMadeDate = decisionDate;
    } else {
      planningFields.map(planningField => {
        if(planningField.documentId === name)
          planning[planningField.actualId] = value;
      });
    }
  });

  return planning;
}

function parseDate(dateString: string) {

  const dateArray = dateString
    .split("-")
    .map((dateItem: string) => parseInt(dateItem));
  return new Date(dateArray[2], dateArray[1] - 1, dateArray[0]);
  
}

async function checkIfNewPage() {
  let isNewPage = false;

  const spanElement = <HTMLSpanElement> queryElement([
    "class:dataview#1", "class:list", "li", "div", "span"
  ]);
  if(spanElement != null) isNewPage = spanElement.innerText === "Application Registered";

  return isNewPage;

}