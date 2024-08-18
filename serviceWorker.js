(() => {
    let displayBounds;

    chrome.system.display.getInfo((displays) => {
        displayBounds = displays[0].bounds;
    });

    chrome.action.onClicked.addListener((tab) => {
        chrome.storage.sync.get({ count: 1 }, (data) => {
            let count = data.count;
            if (count % (count > 100 ? 1000 : count > 30 ? 100 : count > 10 ? 30 : 10) === 0) {
                chrome.windows.create({
                    type: "popup",
                    url: `/window.html?tabId=${tab.id}`,
                    focused: true,
                    height: 228,
                    width: 344,
                    left: Math.floor(displayBounds.width / 2 - 172),
                    top: Math.floor(displayBounds.height / 2 - 114)
                });
            }
            count++;
            chrome.storage.sync.set({ count });
            chrome.scripting.executeScript({
                target: { tabId: tab.id, allFrames: true },
                files: ["cnt.js"]
            });
        });
    });
})();
