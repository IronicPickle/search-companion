chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({test: "test"}, function() {
    console.log("test");
  });

  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [
        new chrome.declarativeContent.PageStateMatcher({
          pageUrl: { hostEquals: "https://www.google.com/" },
        })
      ], actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});