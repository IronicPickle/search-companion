import chromep from "chrome-promise"
import { createNotification } from "../lib/utils";
import { settingsDefaults } from "../lib/vars";

chrome.runtime.onInstalled.addListener(async function() {

  chrome.storage.local.clear();
  chrome.storage.local.remove([ "notification" ]);

  const storage = await chromep.storage.local.get();
  if(storage.settings == null) await chromep.storage.local.set({ settings: settingsDefaults });


  chrome.webNavigation.onDOMContentLoaded.addListener(async (navDetails) => {
    if(navDetails.frameId !== 0) return;

    const tabUrl = navDetails.url;

    const filteredInterfaces = interfaces.filter(iface => 
      iface.urls.filter(url => tabUrl.includes(url)).length > 0
    );
    if(filteredInterfaces.length === 0) return;
    const scripts = filteredInterfaces[0].scripts;
    const urls = filteredInterfaces[0].urls;
    const restrictToOneTab = filteredInterfaces[0].restrictToOneTab;
    const tabs = await chromep.tabs.query({});
    const tabInstances = tabs.filter(tab =>
      urls.filter(url => tab.url?.includes(url)).length > 0
    );

    if(tabInstances.length > 1 && restrictToOneTab) {
      console.log("Closing Previous Tabs")
      tabInstances.map(tabInstance => {
        if(tabInstance.id == null) return;
        if(tabInstance.id === navDetails.tabId) return;
        chrome.tabs.remove(tabInstance.id);
      });
      const notification = createNotification({ severity: "warning", text: "This Page is Open Twice" });
      setTimeout(() => chrome.storage.local.set({ notification }), 500);;
    }

    
    for(const i in scripts) {
      console.log(`Injecting Interfaces: ${scripts[i].toString()}`)
      chrome.tabs.executeScript(navDetails.tabId, {
        file: scripts[i]
      });
    }
  });


});

const interfaces = [
  {
    urls: [ "https://indexcms.co.uk/2.7/case-management",
      "https://indexcms.co.uk/2.7/franchiseemenu.php"
    ],
    scripts: [ "js/content/interfaces/cms.js" ],
    restrictToOneTab: true
  }, {
    urls: [ "https://www.terrafirmaidc.co.uk/order/order_report",
      "https://www.terrafirmaidc.co.uk/order",
      "https://www.terrafirmaidc.co.uk/order/render_order_anc"
    ],
    scripts: [ "js/content/interfaces/terra.js" ],
    restrictToOneTab: true
  }, {
    urls: [ "/applicationDetails.do",
      "/buildingControlDetails.do",
      "/simpleSearchResults.do",
      "/shortUrlResults.do?action=firstPage&searchType=Application",
      "/caseDetails.do"
    ],
    scripts: [ "js/content/interfaces/simpleSearch.js" ],
    restrictToOneTab: false
  }
]