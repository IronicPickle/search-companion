import chromep from "chrome-promise";
import moment from "moment";
import { MenuData } from "../react/embed/TabController";
import { Product } from "./interfaces";
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
  const products = storage.order.products;

  const council = kanbanGetCouncil(products);
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
  { name: "Index Regulated Drainage & Water Report - United Utilities Water",
    abbreviation: "DW" },
    
  { name: "(con29 dw) - anglian",
  abbreviation: "Con29DW (Anglian)" },
  { name: "(con29 dw) - welsh water",
  abbreviation: "Con29DW (Welsh)" },
  { name: "(con29 dw) - hafren dyfrdwy",
  abbreviation: "Con29DW (Hafren Dyfrdwy)" },
  { name: "(con29 dw) - northumbrian",
  abbreviation: "Con29DW (Northumbrian)" },
  { name: "(con29 dw) - severn trent",
  abbreviation: "Con29DW (Severn Trent)" },
  { name: "(con29 dw) - south west",
  abbreviation: "Con29DW (South West)" },
  { name: "(con29 dw) - southern",
  abbreviation: "Con29DW (Southern)" },
  { name: "(con29 dw) - thames",
  abbreviation: "Con29DW (Thames)" },
  { name: "(con29 dw) - united utilities",
  abbreviation: "Con29DW (UU)" },
  { name: "(con29 dw) - wessex",
  abbreviation: "Con29DW (Wessex)" },
  { name: "(con29 dw) - yorkshire",
  abbreviation: "Con29DW (Yorkshire)" },

  { name: "terra",
    abbreviation: "Terra" },
  { name: "coal authority",
    abbreviation: "Coal Authority" }
]

export async function kanbanInsertProducts(id: string) {
  const storage = <Storage> await chromep.storage.local.get();
  const order = storage.order;
  const products = storage.order.products;
  
  const labels = kanbanGetProducts(products, productAbbreviations);
  if(labels.length === 0) return;
  const productString = labels.join(" / ");
  const kanbanTitle = `${order.reference} | ${productString} | ${moment(new Date()).format("DD/MM")}`;

  kanbanOpenTaskDialog(id);
  kanbanInsertTitle(kanbanTitle);
  await kanbanInsertLabels(labels);
  const color = (labels.includes("DW")) ? (labels.length > 1) ? 4 : 2 : 4;
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

function kanbanGetProducts(products: Product[], abbreviations: { name: string, abbreviation: string }[]) {
  const labels: string[] = [];
  
  abbreviations.map(abbreviation => {
    products.map(product => {
      if(product.name.toLowerCase().includes(abbreviation.name.toLowerCase())) {
        labels.push(abbreviation.abbreviation);
      }
    });
  });

  return labels;
}

function kanbanGetCouncil(products: Product[]) {
  for(const i in products) {
    const name = products[i].name;
    if(!name.includes("Index Regulated Local Authority Search - ")) return;
    const councilStart = name.indexOf("Index Regulated Local Authority Search - ") + 41;
    const matches = [
      "City Council", "District Council", "Metropolitan Borough Council",
      "Borough Council", "Unitary Council", "Council"
    ]
    for(const i in matches) {
      const match = matches[i];
      if(name.includes(match)) {
        return name.slice(councilStart, name.indexOf(` ${match}`));
      }
        
    }
    if(name.includes("")) {
      return name.slice(councilStart, name.indexOf(" Borough of")) + " - " + name.slice(name.indexOf("Borough of") + 11);
    }
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