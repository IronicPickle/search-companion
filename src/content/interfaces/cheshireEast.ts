import chromep from "chrome-promise";
import _ from "lodash";
import { Planning, Storage } from "../../lib/interfaces";
import { createNotification, queryElement, sanitizeNbsp } from "../../lib/utils";
import { monthStringToNumber, planningFields } from "../../lib/vars";

setTimeout(() => {
  checkSignature();
}, 500);

function checkSignature() {
  const h1Element = <HTMLHeadingElement> queryElement([ "id:form2", "class:row-fluid", "class:span12", "h1" ]);
  if(h1Element.innerText === "Planning Application Details") {
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
    [ "id:details_content_column" ]
  );

  const planning = <Planning> {}

  const h3ElementArray = Array.from(divElement.getElementsByTagName("h3"));
  const spanElementArray = Array.from(divElement.getElementsByTagName("span"));

  h3ElementArray.map((h3Element: HTMLHeadingElement, i: number) => {
    const spanElement = spanElementArray[i];

    let name = h3Element.innerText;
    let value = spanElement.innerText;
    if(name == null || value == null) return;

    if(name === "Decision / Date Decision Made") {
      const [ decision, decisionDate ] = sanitizeNbsp(value).split("/");
      if(decision !== "Not decided") planning.decision = decision;
      if(decisionDate !== "Not available") planning.decisionMadeDate = decisionDate;
      return;
    } else {
      planningFields.map(planningField => {
        if(planningField.documentId === name)
          planning[planningField.actualId] = value;
      });
    }
  });

  const tdElement = <HTMLDivElement> queryElement(
    [ "id:dates_actions_column", "table", "tbody", "tr", "td", "p" ]
  );

  planning.applicationReceivedDate = tdElement.innerText;

  return planning;
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