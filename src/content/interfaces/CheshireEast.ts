import chromep from "chrome-promise";
import _ from "lodash";
import { Building, Planning, Storage } from "../../lib/interfaces";
import { createNotification, queryElement, sanitizeNbsp } from "../../lib/utils";
import { buildingFields, monthStringToNumber, planningFields } from "../../lib/vars";
import Interface from "../Interface";

class CheshireEast extends Interface {
  constructor() {
    const signatures = {
      planningInfo: {
        signature: () => queryElement([ "id:form2", "class:row-fluid", "class:span12", "h1" ]) != null,
        handler: () => {
          const planning = this.extractPlanningInfo();
          if(planning != null) this.savePlanningInfo(planning);
        }
      },
      buildingInfo: {
        signature: () => queryElement([ "id:form2", "id:detailscontainer", "h1" ]) != null,
        handler: () => {
          const building = this.extractBuildingInfo();
          if(building != null) this.saveBuildingInfo(building);
        }
      }
    }

    super(signatures);
    this.startTimeout(500);
    console.log(`[${this.name}] Interface ready`);
  }

  extractPlanningInfo() {
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
          if(planningField.documentId === name.toLowerCase()) {
            planning[planningField.actualId] = value;
          }
        });
      }
    });

    const tdElement = <HTMLDivElement> queryElement(
      [ "id:dates_actions_column", "table", "tbody", "tr", "td", "p" ]
    );

    planning.applicationReceivedDate = tdElement.innerText;

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
    
    if(!_.isEqual(planning, storage.planning)) {
      const notification = createNotification({ severity: "info", text: "Planning Info Extracted" }, 2);
      console.log(`[${this.name}] Planning Info Extracted`);
      chrome.storage.local.set({ planning, notification });
    }
  }

  extractBuildingInfo() {
    const divElement = <HTMLDivElement> queryElement(
      [ "id:details_content_column", "class:content_inner", "class:formLayout" ]
    );

    const building = <Building> {}

    const h3ElementArray = Array.from(divElement.getElementsByTagName("h3"));
    const spanElementArray = Array.from(divElement.getElementsByTagName("span"));

    h3ElementArray.map((h3Element: HTMLHeadingElement, i: number) => {
      const spanElement = spanElementArray[i];

      let name = h3Element.innerText;
      let value = spanElement.innerText;
      if(name == null || value == null) return;
      if(name.length === 0 || value.length === 0) return;

      buildingFields.map(buildingField => {
        if(buildingField.documentId === name.toLowerCase()) {
          building[buildingField.actualId] = value;
        }
      });
    });

    return building;
  }

  async saveBuildingInfo(building: Building) {
    const storage = <Storage> await chromep.storage.local.get();

    if(building.decisionDate != null &&
      typeof(building.decisionDate) === "string") {

      building.decisionDate = this.parseDate(building.decisionDate).getTime();
    }

    if(building.applicationReceivedDate != null &&
      typeof(building.applicationReceivedDate) === "string") {

      building.applicationReceivedDate = this.parseDate(building.applicationReceivedDate).getTime();
    }
    
    if(!_.isEqual(building, storage.planning)) {
      const notification = createNotification({ severity: "info", text: "Building Info Extracted" }, 3);
      console.log(`[${this.name}] Building Info Extracted`);
      chrome.storage.local.set({ building, notification });
    }
  }

  parseDate(dateString: string) {

    const dateArray = dateString
      .split("-")
      .map((dateItem: string) => dateItem);

    const monthNumber = monthStringToNumber.find(conversion => {
      return conversion.matches.includes(dateArray[1].toLowerCase())}
    )?.number || 0;

    return new Date(parseInt(dateArray[2]), monthNumber, parseInt(dateArray[0]));
    
  }
}

new CheshireEast();