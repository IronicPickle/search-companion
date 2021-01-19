import chromep from "chrome-promise";
import _ from "lodash";
import { KanbanOrder } from "../../lib/interfaces";
import { createNotification, queryElement } from "../../lib/utils";
import { interfaceCheckInterval } from "../../lib/vars";

setInterval(() => {
  checkSignature();
}, interfaceCheckInterval)

function checkSignature() {
  if(queryElement(["class:taskDetails-main"]) != null) updateKanbanOrder();
}

async function updateKanbanOrder() {
  const kanbanOrder = <KanbanOrder> extractKanbanOrder();
  const storage = await chromep.storage.local.get();

  if(!_.isEqual(kanbanOrder, storage.kanbanOrder)) {
    const notification = createNotification({ severity: "info", text: "Extracted Order from KanBan" }, 5);
    console.log("Extracted Order from KanBan");
    chrome.storage.local.set({ kanbanOrder, notification });
  }
}

function extractKanbanOrder() {
  const h2Element = <HTMLHeadingElement> queryElement(["class:taskDetails-name"]);
  const text = h2Element.innerText;

  const regexMatches = /([0-9]{7})(.+?)([0-9]{1,2}\/[0-9]{1,2})/g.exec(text) || [];

  const reference = regexMatches[1] || "";
  const details = regexMatches[2] || "";
  const date = regexMatches[3] || "";

  return <KanbanOrder> { reference, details, date }
}