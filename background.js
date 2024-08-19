chrome.action.onClicked.addListener((tab) => {
    const files = ["script.js"];
    chrome.scripting.executeScript({
        target: { tabId: tab.id, allFrames: true },
        world: "MAIN",
        files,
    });
});
