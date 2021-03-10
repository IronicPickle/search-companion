import chromep from "chrome-promise";
import _ from "lodash";
import { Building, Planning} from "../../lib/interfaces";
import { createNotification, queryElement } from "../../lib/utils";
import { buildingFields, planningFields } from "../../lib/vars";
import Interface from "../Interface";

class SimpleSearch extends Interface {
  constructor() {
    const signatures = {
      planningInfo: {
        signature: () => (<HTMLSpanElement> queryElement(["id:pageheading", "h1", "strong"]))?.innerText === "Planning",
        handler: () => {
          const planning = this.extractPlanningInfo();
          if(planning != null) this.savePlanningInfo(planning);
        }
      },
      buildingInfo: {
        signature: () => (<HTMLSpanElement> queryElement(["id:pageheading", "h1", "strong"]))?.innerText === "Building Control",
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
    const tbodyElement = queryElement(["id:simpleDetailsTable", "tbody"]) || 
      queryElement(["id:applicationDetails", "tbody"]) ||
      queryElement(["id:appealDetails", "tbody"]);
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
          if(name.toLowerCase() === planningField.documentId) {
            planning[planningField.actualId] = value;
          }
        });
      });

    return planning;
  }

  async savePlanningInfo(planning: Planning) {
    const storage = await chromep.storage.local.get();

    if(planning.decisionIssuedDate != null)
      planning.decisionIssuedDate = new Date(planning.decisionIssuedDate).getTime();

    if(planning.decisionMadeDate != null)
      planning.decisionMadeDate = new Date(planning.decisionMadeDate).getTime();

    if(planning.applicationReceivedDate != null)
      planning.applicationReceivedDate = new Date(planning.applicationReceivedDate).getTime();

    planning = (!this.checkIfNewPage()) ? { ...storage.planning, ...planning } : planning;
    
    if(!_.isEqual(planning, storage.planning)) {
      const notification = createNotification({ severity: "success", text: "Planning Info Extracted" }, 2);
      console.log(`[${this.name}] Planning Info Extracted`);
      chrome.storage.local.set({ planning, notification });
    }
  }

  extractBuildingInfo() {
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
          if(name.toLowerCase() === buildingField.documentId) {
            building[buildingField.actualId] = value;
          }
        });
      });

    return building;
  }

  async saveBuildingInfo(building: Building) {
    const storage = await chromep.storage.local.get();

    if(building.decisionDate != null)
      building.decisionDate = new Date(building.decisionDate).getTime();

    if(building.applicationReceivedDate != null)
      building.applicationReceivedDate = new Date(building.applicationReceivedDate).getTime();

    building = (!this.checkIfNewPage()) ? { ...storage.building, ...building } : building;
    
    if(!_.isEqual(building, storage.building)) {
      const notification = createNotification({ severity: "success", text: "Building Info Extracted" }, 3);
      console.log(`[${this.name}] Building Info Extracted`);
      chrome.storage.local.set({ building, notification });
    }
  }

  checkIfNewPage() {
    let isNewPage = false;

    isNewPage = document.getElementsByClassName("active").length === 1;

    const subtabSummaryElement = <HTMLSpanElement> queryElement([ "id:subtab_summary" ]);
    if(subtabSummaryElement != null)
      isNewPage = subtabSummaryElement.className === "active";

    return isNewPage;
  }
}

new SimpleSearch();