import chromep from "chrome-promise";
import _ from "lodash";
import { Building } from "../../lib/interfaces";
import { createNotification, queryElement } from "../../lib/utils";
import { buildingFields } from "../../lib/vars";
import Interface from "../Interface";

class Tameside extends Interface {
  constructor() {
    const signatures = {
      buildingInfo: {
        signature: () => queryElement(["name:Form_3"]) != null,
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


  extractBuildingInfo() {
    const tbodyElement = <HTMLTableElement> queryElement(["class:aligncenter", "tbody"]);
    if(tbodyElement == null) return;

    const building = <Building> {}

    Array.from(tbodyElement.getElementsByTagName("tr"))
      .map((trElement: HTMLTableRowElement) => {
        const tdElement0 = <HTMLTableHeaderCellElement> trElement.children.item(0);
        const tdElement2 = <HTMLTableDataCellElement> trElement.children.item(2);

        const name = tdElement0.innerText;
        const value = tdElement2.innerText;
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

    if(building.decisionDate != null &&
      typeof(building.decisionDate) === "string") {

      building.decisionDate = this.parseDate(building.decisionDate).getTime();
    }

    if(building.applicationReceivedDate != null &&
      typeof(building.applicationReceivedDate) === "string") {

      building.applicationReceivedDate = this.parseDate(building.applicationReceivedDate).getTime();
    }
    
    if(!_.isEqual(building, storage.building)) {
      const notification = createNotification({ severity: "success", text: "Building Info Extracted" }, 3);
      console.log(`[${this.name}] Building Info Extracted`);
      chrome.storage.local.set({ building, notification });
    }
  }

  parseDate(dateString: string) {

    const dateArray = dateString
      .split("/")
      .map((dateItem: string) => parseInt(dateItem));
    return new Date(dateArray[2], dateArray[1] - 1, dateArray[0]);
    
  }
}

new Tameside();