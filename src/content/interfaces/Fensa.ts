import chromep from "chrome-promise";
import _ from "lodash";
import { Building, Storage } from "../../lib/interfaces";
import { createNotification, queryElement } from "../../lib/utils";
import Interface from "../Interface";

class Fensa extends Interface {
  constructor() {
    const signatures = {
      buildingInfo: {
        signature: () => (<HTMLParagraphElement> queryElement(
          ["id:Contentplaceholder1_C032_Col00", "class:panel-login", "class:panel-heading", "class:row#1", "class:alert-success", "p"]
        ))?.innerText === "We have found the following certificate(s) from your search:",
        handler: () => {
          this.bindClickEvents();
        }
      },
      searchInfo: {
        signature: () => (<HTMLParagraphElement> queryElement(["id:certSearchAddress", "p"]))?.innerText === "Search by address",
        handler: () => {
          this.injectSearchInfo();
        }
      }
    }

    super(signatures);
    this.startTimeout(500);
    chrome.storage.onChanged.addListener((changes) => {
      if(changes.order != null) this.start();
    });
    console.log(`[${this.name}] Interface ready`);
  }

  bindClickEvents() {
    const tbodyElement = queryElement([
      "id:Contentplaceholder1_C033_Col00", "class:panel-login", "class:panel-body", "class:row#0", "class:col-md-12", "class:table-striped", "tbody"
    ]);
    if(tbodyElement == null) return;

    Array.from(tbodyElement.getElementsByTagName("tr"))
      .map((trElement: HTMLTableRowElement) => {
        trElement.id = "EXTENSC-clickable";
        trElement.addEventListener("click", () => {
          const building = this.extractBuildingInfo(trElement);
          if(building != null) this.saveBuildingInfo(building);
        });
      });

    const notification = createNotification({ severity: "info", text: "Select a FENSA Certificate" }, 0);
    console.log(`[${this.name}] Click Events Bound`);
    chrome.storage.local.set({ notification });
  }

  extractBuildingInfo(trElement: HTMLTableRowElement) {
    const building = <Building> {}

    const tdElement0 = <HTMLTableHeaderCellElement> trElement.children.item(0);
    const tdElement1 = <HTMLTableDataCellElement> trElement.children.item(1);
    const tdElement2 = <HTMLTableDataCellElement> trElement.children.item(2);

    const address = tdElement0.innerText;
    const info = tdElement1.innerText;
    const dates = tdElement2.innerText;
    if(address == null || info == null || dates == null) return;

    building.reference = "FENSA";
    building.descripton = info.replace(/:/g, "").replace(/\n/g, " ");
    building.address = address.replace(/\n/g, ", ");
    building.extra = "CERTIFICATE ISSUED";
    building.decision = "WORK COMPLETED";
    dates.split("\n").map(line => {
      if(line.includes("Certificate Issued:")) building.extraDate = line.replace("Certificate Issued: ", "");
      if(line.includes("Work Completed:")) building.decisionDate = line.replace("Work Completed: ", "");
    });

    return building;
  }

  saveBuildingInfo(building: Building) {
    if(building.decisionDate != null &&
      typeof(building.decisionDate) === "string") {

      building.decisionDate = this.parseDate(building.decisionDate).getTime();
    }

    if(building.extraDate != null &&
      typeof(building.extraDate) === "string") {

      building.extraDate = this.parseDate(building.extraDate).getTime();
    }

    const notification = createNotification({ severity: "success", text: "Building Info Extracted" }, 3);
    console.log(`[${this.name}] Building Info Extracted`);
    chrome.storage.local.set({ building, notification });
  }

  async injectSearchInfo() {

    const storage = <Storage> (await chromep.storage.local.get());
    const order = storage.order;
    if(order == null) return;

    const postcodeInput = <HTMLInputElement> queryElement([ "id:certSearchAddress", "class:form-group#0", "input" ]);
    const houseInput = <HTMLInputElement> queryElement([ "id:certSearchAddress", "class:form-group#1", "input" ]);

    postcodeInput.value = order.property.postCode;
    houseInput.value = order.property.houseNumber || order.property.houseName;

    const notification = createNotification({ severity: "success", text: "Search Info Injected" }, 0);
    console.log(`[${this.name}] Search Info Injected`);
    chrome.storage.local.set({ notification });

  }

  parseDate(dateString: string) {

    const dateArray = dateString
      .split("/")
      .map((dateItem: string) => parseInt(dateItem));
    return new Date(dateArray[2], dateArray[1] - 1, dateArray[0]);
    
  }
}

new Fensa();