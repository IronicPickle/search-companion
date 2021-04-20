import chromep from "chrome-promise";
import _ from "lodash";
import { KanbanOrder } from "../../lib/interfaces";
import { createNotification, queryElement } from "../../lib/utils";
import { interfaceCheckInterval } from "../../lib/vars";
import { displays } from "../../react/embed/TabDisplay";
import Interface from "../Interface";

class KanBan extends Interface {
  constructor() {
    const signatures = {
      kanbanOrder: {
        signature: () => queryElement(["class:taskDetails-main"]) != null,
        handler: () => {
          const kanbanOrder = this.extractKanbanOrderInfo();
          this.saveKanbanOrderInfo(kanbanOrder);
        }
      }
    }

    super(signatures);
    this.startInterval(interfaceCheckInterval);
    console.log(`[${this.name}] Interface ready`);
  }

  extractKanbanOrderInfo() {
    const h2Element = <HTMLHeadingElement> queryElement(["class:taskDetails-name"]);
    const text = h2Element.innerText;

    const regexMatches = /([0-9]{7})(.+?)([0-9]{1,2}\/[0-9]{1,2})/g.exec(text) || [];

    const reference = regexMatches[1] || "";
    const details = regexMatches[2] || "";
    const date = regexMatches[3] || "";

    return <KanbanOrder> { reference, details, date }
  }

  async saveKanbanOrderInfo(kanbanOrder: KanbanOrder) {
    const storage = await chromep.storage.local.get();

    if(!_.isEqual(kanbanOrder, storage.kanbanOrder)) {
      const notification = createNotification({ severity: "success", text: "Extracted Order from KanBan" }, displays.length - 1);
      console.log("[Interface] Saved kanban order info to storage");
      chrome.storage.local.set({ kanbanOrder, notification });
    }
  }

}

new KanBan();