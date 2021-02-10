import chromep from "chrome-promise";
import _ from "lodash";
import { Planning, Storage } from "../../lib/interfaces";
import { createNotification, queryElement } from "../../lib/utils";
import { planningFields } from "../../lib/vars";
import Interface from "../Interface";

class Blackburn extends Interface {
  constructor() {
    const signatures = {
      planningInfo: {
        signature: () => (<HTMLHeadingElement> queryElement([ "id:inner-page-title", "h1" ]))?.innerText === "Planning application search",
        handler: () => {
          const planning = this.extractPlanningInfo();
          if(planning != null) this.savePlanningInfo(planning);
        }
      }
    }

    super(signatures);
    this.startTimeout(500);
    console.log(`[${this.name}] Interface ready`);
  }

  extractPlanningInfo() {
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
          if(planningField.documentId === name.toLowerCase()) {
            planning[planningField.actualId] = value;
          }
        });
      }
    });

    return planning;
  }

  async savePlanningInfo(planning: Planning) {
    const storage = <Storage> await chromep.storage.local.get();

    if(planning.decisionMadeDate != null &&
      typeof(planning.decisionMadeDate) === "string") {

      planning.decisionMadeDate = this.parseDate(planning.decisionMadeDate).getTime();
    }

    if(planning.applicationReceivedDate != null &&
      typeof(planning.applicationReceivedDate) === "string") {

      planning.applicationReceivedDate = this.parseDate(planning.applicationReceivedDate).getTime();
    }

    planning = (!await this.checkIfNewPage()) ? { ...storage.planning, ...planning } : planning;
    
    if(!_.isEqual(planning, storage.planning)) {
      const notification = createNotification({ severity: "info", text: "Planning Info Extracted" }, 2);
      console.log(`[${this.name}] Planning Info Extracted`);
      chrome.storage.local.set({ planning, notification });
    }
  }

  parseDate(dateString: string) {

    const dateArray = dateString
      .split("-")
      .map((dateItem: string) => parseInt(dateItem));
    return new Date(dateArray[2], dateArray[1] - 1, dateArray[0]);
    
  }

  async checkIfNewPage() {
    let isNewPage = false;

    const spanElement = <HTMLSpanElement> queryElement([
      "class:dataview#1", "class:list", "li", "div", "span"
    ]);
    if(spanElement != null) isNewPage = spanElement.innerText === "Application Registered";

    return isNewPage;

  }
}

new Blackburn();