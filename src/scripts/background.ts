import chromep from "chrome-promise"

chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({test: "joe"});

  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [
        new chrome.declarativeContent.PageStateMatcher({
          pageUrl: {}
        })
      ], actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});

chrome.webNavigation.onCompleted.addListener((details) => {
  if(details.url === "https://indexcms.co.uk/2.7/case-management") {
    console.log("CMS")
  }
});

chrome.tabs.onActivated.addListener((activeInfo: chrome.tabs.TabActiveInfo) => {
  chrome.tabs.get(activeInfo.tabId, async (currentTab?: chrome.tabs.Tab) => {
    //if(currentTab != null) console.log(currentTab.url)
    const storage = await chromep.storage.sync.get();
    //console.log(storage.test);
  })
});