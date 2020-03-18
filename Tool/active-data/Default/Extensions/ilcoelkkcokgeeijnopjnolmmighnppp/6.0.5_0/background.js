/**********************************************************************
 @see  https://www.testleaf.com
 @since - 2019
 @author - Koushik Chatterjee <koushik.chatterjee@testleaf.com>
 ***********************************************************************/
var installURL = "https://sites.google.com/testleaf.com/ruto/";
var updateURL = "https://sites.google.com/testleaf.com/ruto/videos"
var uninstallURL = "https://sites.google.com/testleaf.com/ruto/download/uninstall";

// Global var to get details form manifest.json
const manifest = chrome.runtime.getManifest();
// Open new tab on uninstall extension to get survey
chrome.runtime.setUninstallURL(uninstallURL, () => { })

// Open new tab on installation to show demo about Ruto
const installedListener = (details) => {
    if (details.reason == 'install') {
        installNotification();
        chrome.tabs.create({
            url: installURL
        })
    } else if (details.reason == 'update') {
        updateNotification();
        chrome.notifications.onClicked.addListener(onClickNoti);
    }
}
function onClickNoti() { chrome.tabs.create({ url: updateURL }) }
const updateNotification = () => {
    chrome.notifications.create({
        title: `Ruto`,
        message: `Click here to see the changelog of version ${manifest.version}`,
        type: 'basic',
        iconUrl: 'logo/128.png'
    });
}
const installNotification = () => {
    chrome.notifications.create('onInstalled', {
        title: `Ruto`,
        message: `Please restart your browser to use Ruto`,
        type: 'basic',
        iconUrl: 'logo/128.png'
    });
}
chrome.runtime.onInstalled.addListener(installedListener);
//- Required

// To toggle SRC and TGT context menu option
var checkedState = false;
function toggle() {
    checkedState = !checkedState;
    if (checkedState) {
        chrome.contextMenus.update('ruto@testleaf.comSRC', { "title": "Select Target", }, () => { })
    } else {
        chrome.contextMenus.update('ruto@testleaf.comSRC', { "title": "Select Source", }, () => { })
    }
}
// ContextMenus on Chrome
chrome.contextMenus.create({
    "title": "Add to Ruto",
    "contexts": ["all"],
    "onclick": getXPath
});
// src & target
chrome.contextMenus.create({
    "id": "ruto@testleaf.comSRC",
    "title": "Select Source",
    "contexts": ["all"],
    "onclick": getXPathMultiple
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId == "ruto@testleaf.comSRC") {
        toggle();
    }
});

function getXPathMultiple(info, tab) {
    let msg = { subject: "AnchorXP" };
    let inspectedId = tab.id;
    let selectedFrameId = info.frameId;
    chrome.tabs.sendMessage(inspectedId, msg, { frameId: selectedFrameId });
}
/********************************************************************* 
 * getXPath
 * Method handle the click event of add to Ruto Menu
 * Parameters:
 * info - Information about the item clicked
 * tab  - The details of the tab where the click took place
 **********************************************************************/

function getXPath(info, tab) {
    let msg = { subject: "getXPath" };
    let inspectedId = tab.id;
    let selectedFrameId = info.frameId;
    chrome.tabs.sendMessage(inspectedId, msg, { frameId: selectedFrameId });
}
// Badge (shows no.of XPath in Ruto Badge)
chrome.storage.onChanged.addListener(function (changes, storageName) {
    if (storageName == 'local' && 'total' in changes) {
        if (changes.total.newValue === '+1') {
            try { setbadgeAndColor(changes, "red"); } catch (error) { }
        } else {
            try { setbadgeAndColor(changes, "blue"); } catch (error) { }
        }
    }
})

function setbadgeAndColor(changes, color) {
    chrome.browserAction.setBadgeBackgroundColor({ color: color });
    chrome.browserAction.setBadgeText({ text: changes.total.newValue.toString() });
}

// Get values from content script
window.src = null;
window.dst = null;
window.proOrFol = null;
window.anchor = false;
window.type = null;
window.xpath = null;
window.tag = null;
window.hasFrame = null;
window.variableFromBg = null;
window.defaultXPath = null;
var atrributesArray = null;
window.shadowRoot = false;
var webtable = null;
window.cssPath = null;
chrome.runtime.onMessage.addListener(receiver);
function receiver(request, sender, sendResponse) {
    window.cssPath = request.cssPath;
    webtable = request.webtabledetails;
    window.shadowRoot = request.shadowRoot;
    window.xpath = request.xpathid;
    window.tag = request.tag;
    window.hasFrame = request.hasFrame;
    window.variableFromBg = request.variableFromBg;
    window.type = request.type;
    window.anchor = request.anchor;
    window.src = request.src;
    window.dst = request.dst;
    window.proOrFol = request.proOrFol;
    window.defaultXPath = request.defaultXPath;
    window.atrributesArray = request.atrributesArray;
}
// Deactivate extension if active tab is changed
chrome.tabs.onActiveChanged.addListener(function (tabId, selectInfo) {
    chrome.tabs.sendMessage(tabId, {
        subject: "OFF",
    })
});
// Deactivate extension if active tab is updated
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    chrome.tabs.sendMessage(tabId, {
        subject: "OFF",
    })
});

