import chromep from "chrome-promise";
import _ from "lodash";
import { Building, Planning} from "../../lib/interfaces";
import { createNotification, queryElement } from "../../lib/utils";
import { buildingFields, planningFields } from "../../lib/vars";
import Interface from "../Interface";

class RibbleValley extends Interface {
  constructor() {
    const signatures = {
      planningInfo: {
        signature: () => (<HTMLHeadingElement> queryElement(["class:container", "class:main", "class:content", "h1"]))?.innerText.includes("Application"),
        handler: () => {
          const planning = this.extractPlanningInfo();
          if(planning != null) this.savePlanningInfo(planning);
        }
      },
      buildingInfo: {
        signature: () => queryElement(["id:ctl00_DefaultContent_PageHeaderLabel"]) != null,
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
        if(planningField.documentId === name.toLowerCase()) {
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
  
  async savePlanningInfo(planning: Planning) {
    const storage = await chromep.storage.local.get();

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

  extractBuildingReference() {
    const spanElement = <HTMLSpanElement> queryElement(
      [ "id:ctl00_DefaultContent_PageHeaderLabel" ]);
    if(spanElement == null) return;

    const reference = spanElement.innerText.replace("Details for Building Control Application - ", "");
    return reference;
  }

  extractBuildingInfo() {
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
          if(buildingField.documentId === name.toLowerCase()) {
            building[buildingField.actualId] = value;
          }
        });
      });

    return building;
  }

  async saveBuildingInfo(building: Building) {
    const storage = await chromep.storage.local.get();
    
    building.reference = this.extractBuildingReference();

    if(building.decisionDate != null &&
      typeof(building.decisionDate) === "string") {

      building.decisionDate = this.parseDate(building.decisionDate, true).getTime();
    }

    if(building.applicationReceivedDate != null &&
      typeof(building.applicationReceivedDate) === "string") {

      building.applicationReceivedDate = this.parseDate(building.applicationReceivedDate, true).getTime();
    }
    
    if(!_.isEqual(building, storage.building)) {
      const notification = createNotification({ severity: "success", text: "Building Info Extracted" }, 3);
      console.log(`[${this.name}] Building Info Extracted`);
      chrome.storage.local.set({ building, notification });
    }
  }

  parseDate(dateString: string, reverse?: boolean) {

    const dateArray = dateString
      .split("/")
      .map((dateItem: string) => parseInt(dateItem));
    if(reverse) {
      return new Date(dateArray[2], dateArray[0] - 1, dateArray[1]);
    } else {
      return new Date(dateArray[2], dateArray[1] - 1, dateArray[0]);
    }
    
  }
}

new RibbleValley();