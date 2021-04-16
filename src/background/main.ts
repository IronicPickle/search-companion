import axios from "axios";
import chromep from "chrome-promise"
import { Order, Storage } from "../lib/interfaces";
import { createNotification } from "../lib/utils";
import { interfaces, settingsDefaults } from "../lib/vars";

chrome.runtime.onConnect.addListener(() => start());
chrome.runtime.onStartup.addListener(() => start());
chrome.runtime.onInstalled.addListener(() => start());

export async function resetSettings() {

  await chromep.storage.local.set({ settings: settingsDefaults });

}

export async function clearCurrentOrder() {

  await chromep.storage.local.remove([ "order", "planning", "building", "orderHistory" ]);

}

function closeOtherTabs(tabs: chrome.tabs.Tab[], exemptTabs: chrome.tabs.Tab[]) {
  console.log("Closing Previous Tabs")
  tabs.map(tab => {
    if(tab.id == null) return;
    const isExempt = exemptTabs.filter(exemptTab => exemptTab.id === tab.id).length > 0;
    if(isExempt) return;
    chrome.tabs.remove(tab.id);
  });
}

async function start() {

  console.log("Extension Started - Listening for Interface Compatible URLs");

  chrome.storage.onChanged.addListener(changes => storageChange(changes));

  chrome.storage.local.remove([ "notification" ]);

  const storage = <Storage> await chromep.storage.local.get();
  if(storage.settings == null) resetSettings();


  chrome.webNavigation.onDOMContentLoaded.addListener(async (navDetails) => {
    const storage = <Storage> await chromep.storage.local.get();
    if(navDetails.frameId !== 0) return;

    if(!storage.settings?.extensionState) return;
    
    const currentTab = await chromep.tabs.get(navDetails.tabId);
    const currnetInterface = interfaces.filter(filteredInterface => 
      filteredInterface.urls.filter((url: string) => navDetails.url.includes(url)).length > 0
    )[0];

    if(currnetInterface == null) return;
    const interfaceScripts = currnetInterface.scripts;
    const interfaceUrls = currnetInterface.urls;
    const interfaceSingleTab = currnetInterface.restrictToOneTab;

    
    const tabs = await chromep.tabs.query({});
    const tabsRunningInterface = tabs.filter(tab =>
      interfaceUrls.filter((interfaceUrl: string) => tab.url?.includes(interfaceUrl)).length > 0
    );

    if(tabsRunningInterface.length > 1 && interfaceSingleTab) {
      closeOtherTabs(tabsRunningInterface, [ currentTab ]);
      
      const notification = createNotification(
        { severity: "error", text: "Only One Instance of Tab Allowed" }, 0, currentTab.url
      );
      setTimeout(() => chrome.storage.local.set({ notification }), 500);
    }

    for(const i in interfaceScripts) {
      console.log(`Injecting Interfaces: ${interfaceScripts[i].toString()}`)
      chrome.tabs.executeScript(navDetails.tabId, {
        file: interfaceScripts[i]
      });
    }
  });

}

async function storageChange(changes: { [key: string]: chrome.storage.StorageChange }) {

  const storage = <Storage> await chromep.storage.local.get();
  let orderHistory = storage.orderHistory || [];

  const newOrder = <Order> changes.order?.newValue;
  if(newOrder == null) return;

  for(const i in orderHistory) {
    if(orderHistory[i].reference === newOrder.reference) {
      orderHistory.splice(parseInt(i), 1);
      break;
    }
  }

  orderHistory.unshift({ ...newOrder, lastViewed: new Date().getTime() });
  orderHistory = orderHistory.slice(0, 25);

  chrome.storage.local.set({ orderHistory });
  
}