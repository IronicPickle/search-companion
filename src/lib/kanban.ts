import chromep from "chrome-promise";
import { indexOf } from "lodash";
import moment from "moment";
import { MenuData } from "../react/embed/TabController";
import { Product, Storage } from "./interfaces";
import { createNotification } from "./utils";

export function kanbanGetMenuData(onClickFunction: (id: string) => any) {
    const columnHeaders = Array.from(document.getElementsByClassName("columnHeader"));
    const menuData: MenuData = { title: "Select a Column", options: [] };

    for(const i in columnHeaders) {
      const columnHeader = columnHeaders[i];

      const id = columnHeader.getAttribute("data-columnid");
      const title = columnHeader.getElementsByTagName("h2").item(0)?.innerText;
      if(id == null || title == null) continue;

      menuData.options.push({ title, onClick: () => { onClickFunction(id); } })

    }

    return [ menuData ];
    
  }
  
export async function kanbanInsertSearch(id: string) {
  const storage = <Storage> await chromep.storage.local.get();
  const order = storage.order;
  if(order == null) return;
  const products = order.products;

  const council = kanbanParseCouncil(products, order.council);
  if(council == null) return;
  const kanbanTitle = `${order.reference} | ${council} | ${moment(new Date()).format("DD/MM")}`;
  
  kanbanOpenTaskDialog(id);
  kanbanInsertTitle(kanbanTitle);
  await kanbanInsertLabels([ council ]);
  kanbanCloseTaskDialog();

  const notification = createNotification({ severity: "success", text: "Created Search Card" });
  console.log(`[KanBan] Created Search Card`);
  chrome.storage.local.set({ notification });
}

const productAbbreviations = [
  { matches: [ "Index Regulated Drainage & Water Report - United Utilities Water" ],
    abbreviation: "DW" },
  { matches: [ "Drainage Plan", "Water Plan" ],
    abbreviation: "DW Inter" },
    
  { matches: [ "(con29 dw) - anglian" ],
    abbreviation: "Con29DW (Anglian)" },
  { matches: [ "(con29 dw) - welsh water" ],
    abbreviation: "Con29DW (Welsh)" },
  { matches: [ "(con29 dw) - hafren dyfrdwy" ],
    abbreviation: "Con29DW (Hafren Dyfrdwy)" },
  { matches: [ "(con29 dw) - northumbrian" ],
    abbreviation: "Con29DW (Northumbrian)" },
  { matches: [ "(con29 dw) - severn trent" ],
    abbreviation: "Con29DW (Severn Trent)" },
  { matches: [ "(con29 dw) - south west" ],
    abbreviation: "Con29DW (South West)" },
  { matches: [ "(con29 dw) - southern" ],
    abbreviation: "Con29DW (Southern)" },
  { matches: [ "(con29 dw) - thames" ],
    abbreviation: "Con29DW (Thames)" },
  { matches: [ "(con29 dw) - united utilities" ],
    abbreviation: "Con29DW (UU)" },
  { matches: [ "(con29 dw) - wessex" ],
    abbreviation: "Con29DW (Wessex)" },
  { matches: [ "(con29 dw) - yorkshire" ],
    abbreviation: "Con29DW (Yorkshire)" },

  { matches: [ "terra" ],
    abbreviation: "Terra" },
  { matches: [ "coal authority" ],
    abbreviation: "Coal Authority" },
  
  { matches: [ "SmartSearch Individual (Basic) International Anti Money Laundering Search" ],
    abbreviation: "SmartSearch (Basic)" },
  { matches: [ "SmartSearch Individual (Enhanced) International Anti Money Laundering Search" ],
    abbreviation: "SmartSearch (Enhanced)" }
]

function drainageOnly(labels: string[]) {
  const signatures = [ "DW", "DW Inter"];
  for(const i in signatures) {
    if(labels.includes(signatures[i])) return true;
  }
  return false;
}

export async function kanbanInsertProducts(id: string) {
  const storage = <Storage> await chromep.storage.local.get();
  const order = storage.order;
  if(order == null) return;
  const products = order.products;
  
  const labels = kanbanGetProducts(products);
  if(labels.length === 0) return;
  const productString = labels.join(" / ");
  const kanbanTitle = `${order.reference} | ${productString} | ${moment(new Date()).format("DD/MM")}`;

  kanbanOpenTaskDialog(id);
  kanbanInsertTitle(kanbanTitle);
  await kanbanInsertLabels(labels);
  const color = (drainageOnly(labels)) ? (labels.length > 1) ? 4 : 2 : 4;
  kanbanSetColor(color);
  setTimeout(() => kanbanCloseTaskDialog(), 50);
  
  const notification = createNotification({ severity: "success", text: "Created Products Card" });
  console.log(`[KanBan] Created Products Card`);
  chrome.storage.local.set({ notification });
}

function kanbanOpenTaskDialog(id: string) {
  const columnHeaders = Array.from(document.getElementsByClassName("columnHeader"));
  const columnHeader = columnHeaders.find(columnHeader => columnHeader.getAttribute("data-columnid") === id);
  if(columnHeader == null) return;
  const addTaskButton = columnHeader.getElementsByClassName("columnHeader-addTask").item(0) as HTMLButtonElement | null;
  if(addTaskButton == null) return;
  addTaskButton.click();
}

function kanbanCloseTaskDialog() {
  const closeTaskButton = document.getElementsByClassName("addTaskDialog-button").item(2) as HTMLButtonElement | null;
  if(closeTaskButton == null) return;
  closeTaskButton.click();
}

function kanbanGetProducts(products: Product[]) {
  const labels: string[] = [];
  
  productAbbreviations.map(abbreviation => {
    products.map(product => {
      const name = product.name.toLowerCase();
      const matches = abbreviation.matches;
      if(matches.find(match => name.includes(match.toLowerCase())) != null) {
        if(labels.includes(abbreviation.abbreviation)) return;
        labels.push(abbreviation.abbreviation);
      }
    });
  });

  if(labels.includes("DW Inter") && products.find(product => product.name.toLowerCase().includes(
    "index regulated drainage & water report"
  ))) {
    labels.splice(labels.indexOf("DW Inter"), 1);
  }

  return labels;
}

function kanbanParseCouncil(products: Product[], council: string) {
  for(const i in products) {
    if(!products[i].name.includes("Index Regulated Local Authority Search")) continue;
    const matches = [
      "City Council", "District Council", "Metropolitan Borough Council",
      "Borough Council", "Unitary Council", "Council"
    ]
    for(const i in matches) {
      const match = matches[i];
      if(council.includes(match)) {
        return council.slice(0, council.indexOf(` ${match}`));
      }
        
    }
    return council.slice(0, council.indexOf(" Borough of")) + " - " + council.slice(council.indexOf("Borough of") + 11);
  }
}

function kanbanInsertTitle(title: string) {
  const taskNameTextArea = document.getElementsByClassName("addTaskDialog-name").item(0) as HTMLTextAreaElement | null;
  if(taskNameTextArea == null) return;
  taskNameTextArea.value = title;
  taskNameTextArea.dispatchEvent(new Event("input", { bubbles: true, cancelable: true }));
}

async function kanbanInsertLabels(labels: string[]) {
  const addLabelButton = document.getElementsByClassName("addTaskDialog-iconButton").item(1) as HTMLButtonElement | null;
  if(addLabelButton == null) return;
  addLabelButton.click();
  
  const labelNameTextArea = document.getElementsByClassName("taskLabelInput-input").item(0) as HTMLTextAreaElement | null;
  if(labelNameTextArea == null) return;

  for(const i in labels) {
    labelNameTextArea.value = labels[i].slice(0, 19);
    labelNameTextArea.dispatchEvent(new Event("input", { bubbles: true, cancelable: true }));
    labelNameTextArea.dispatchEvent(new KeyboardEvent("keydown", {
      key: "Enter", code: "Enter"
    }));
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  const closeLabelButton = document.getElementsByClassName("popoverDialog-close").item(0) as HTMLButtonElement | null;
  if(closeLabelButton == null) return;
  closeLabelButton.click();

  Promise.resolve();
}

function kanbanSetColor(color: number) {
  const addLabelButton = document.getElementsByClassName("addTaskDialog-colorIcon").item(0) as HTMLButtonElement | null;
  if(addLabelButton == null) return;
  addLabelButton.click();

  setTimeout(() => {
    const colorOption = <HTMLButtonElement> document.querySelectorAll(".colorSelectMenu-option")[color];
    colorOption.click();
  }, 50);

}