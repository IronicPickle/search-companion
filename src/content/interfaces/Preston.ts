import chromep from "chrome-promise";
import _ from "lodash";
import { Planning, Storage } from "../../lib/interfaces";
import { createNotification, queryElement } from "../../lib/utils";
import { planningFields } from "../../lib/vars";
import Interface from "../Interface";

class Preston extends Interface {
  constructor() {
    const signatures = {
      planningInfo: {
        signature: () => (<HTMLHeadingElement> queryElement([ "id:lblFormTitle1" ])).innerText === "Planning application details",
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
          if(planningField.documentId === name.toLowerCase()) {
            planning[planningField.actualId] = value;
          }
        });
      });

    return planning;
  }

  parseDate(dateString: string) {

    const dateArray = dateString
      .split("/")
      .map((dateItem: string) => parseInt(dateItem));
    return new Date(dateArray[2], dateArray[1] - 1, dateArray[0]);
    
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
    
    if(!_.isEqual(planning, storage.planning)) {
      const notification = createNotification({ severity: "success", text: "Planning Info Extracted" }, 2);
      console.log(`[${this.name}] Planning Info Extracted`);
      chrome.storage.local.set({ planning, notification });
    }
  }
}

new Preston();