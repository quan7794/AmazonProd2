// version 3.1.0 id = ilcoelkkcokgeeijnopjnolmmighnppp
/***
 * @see  https://www.testleaf.com
 * @since - 2019 - Feb
 * @author Koushik Chatterjee <koushik350@gmail.com>
 */
//Global propeties
"use strict";
var clickedElement = null;
/**********************************************************************
* getCurrentDocument - Return the window.document
***********************************************************************/
function getCurrentDocument() {
    return window.document;
}
// Extension namespaces
var ortoni = ortoni || {};

/**********************************************************************
* init
* Helper function for initialize
* Parameters:
* none
***********************************************************************/
var enablegcx = false;
var isRecordEnabled = false;
// add xpath on context menu click
ortoni.init = function () {
    document.addEventListener("mousedown", function (event) {
        clickedElement = event.target;
    }, true);
}

// add xpath on a click action
document.addEventListener("click", clickTogetXpath, true);
function clickTogetXpath(event) {
    if (enablegcx) {
        event.stopPropagation();
        event.preventDefault();
        clickedElement = event.target;
        ortoni.parseSelectedDOM();
        try {
            if (xpathArray != undefined) {
                let domInfo = {
                    cssPath: cssPathArray,
                    xpathid: xpathArray.sort(),
                    tag: tag,
                    type: type,
                    hasFrame: hasFrame,
                    variableFromBg: variableFromBg,
                    anchor: false,
                    atrributesArray: atrributesArray,
                    webtabledetails: webTableDetails
                };
                if (_doc == document) {
                    chrome.runtime.sendMessage(domInfo);
                }
                atrributesArray = [];
                webTableDetails = null;
            }
        } catch (error) { }
    }
}

ortoni.parseSelectedDOM = function () {
    if (clickedElement != null) {
        try {
            ortoni.clearHighlights()
        } catch (error) { }
        try {
            maxIndex = tempMaxIndex != null ? tempMaxIndex : 5;
            ortoni.buildXpath(clickedElement, 0);
        } catch (error) {
            if (error.message === 'shadow dom not yet supported')
                xpathArray = undefined
        }
        ortoni.highlightSelectedDOM()
        setTimeout(() => {
            ortoni.clearHighlights()
        }, 100);
    }
}
ortoni.parseAnchorXP = function () {
    if (clickedElement != null) {
        try {
            ortoni.clearHighlights1()
            // ortoni.clearHighlights2()
        } catch (error) { }
        try {
            maxIndex = 20;
            ortoni.buildXpath(clickedElement, 1);
        } catch (error) { }
        // ortoni.highlightSelectedDOM()
        setTimeout(() => {
            ortoni.clearHighlights2()
        }, 100);
    }
}
/**********************************************************************
* highlightSelectedDOM
* Helper function highlight selected the DOM element
* Parameters:
* none
***********************************************************************/
ortoni.highlightSelectedDOM = function () {
    clickedElement.className += ' chromexPathFinder';
}
/**********************************************************************
* clearHighlights
* Helper function clear the highlight
* Parameters:
* none
***********************************************************************/
ortoni.clearHighlights = function () {
    var els = document.getElementsByClassName('chromexPathFinder');
    // Note: getElementsByClassName() returns a live NodeList.
    while (els.length) {
        els[0].className = els[0].className.replace(' chromexPathFinder', '');
    }
};
ortoni.clearHighlights1 = () => {
    var els = document.getElementsByClassName('chromexPathFinder1');
    // Note: getElementsByClassName() returns a live NodeList.
    while (els.length) {
        els[0].className = els[0].className.replace(' chromexPathFinder1', '');
    }
};
ortoni.clearHighlights2 = () => {
    var els = document.getElementsByClassName('chromexPathFinder2');
    // Note: getElementsByClassName() returns a live NodeList.
    while (els.length) {
        els[0].className = els[0].className.replace(' chromexPathFinder2', '');
    }
};
/***************************************************************************
 *  Event is fired when the initial HTML document has been completely loaded
 * *************************************************************************/
getCurrentDocument().addEventListener('DOMContentLoaded', function () {
    ortoni.init();
    // chrome.storage.local.set({
    //     'gcx': 'false', 'isRecord': 'false'
    // });
    if (enablegcx) {
        document.addEventListener("mouseover", mouseOver, true);
        document.addEventListener("mouseout", mouseOut, true)
    }
    if (isRecordEnabled) {
        document.addEventListener("mouseover", mouseOver, true);
        document.addEventListener("mouseout", mouseOut, true)
    }
});

function mouseOver(e) {
    let t = e.target;
    t.style.outlineWidth = '2px';
    t.style.outlineStyle = 'ridge';
    t.style.outlineColor = 'orangered';
}
function mouseOut(e) {
    let t = e.target;
    t.style.outlineWidth = '';
    t.style.outlineStyle = '';
    t.style.outlineColor = '';
}
function addRemoveOutlineCustomeXpath(next) {
    next.setAttribute('style', 'outline: green solid;');
    setTimeout(() => {
        next.removeAttribute('style', 'outline: green solid;');
    }, 100);
}
// Listen for messages to the popup
/***************************************************************************
 *  Fired when a message is sent from either an extension process
 * (by runtime.sendMessage) or a content script (by tabs.sendMessage)
 * *************************************************************************/
chrome.runtime.onMessage.addListener(senderM);
function senderM(request, sender, sendResponse) {
    switch (request.subject) {
        case 'OFF':
            enablegcx = false;
            document.removeEventListener("mouseover", mouseOver, true);
            document.removeEventListener("mouseout", mouseOut, true);
            chrome.storage.local.set({
                'gcx': 'false', 'isRecord': 'false'
            });
            isRecordEnabled = false;
            stopRecord();
            let domInfo = {
                xpathid: undefined,
            }
            chrome.runtime.sendMessage(domInfo);
            break;
        case 'validateAnchorDetails':
            if (_doc == document) {
                let value = request.data;
                let snapShot = document.evaluate(value, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
                let count = snapShot.snapshotLength;
                if (count == 0 || count == undefined) {
                    chrome.storage.local.set({
                        "anchorEvalXPath": 'Sorry! Please try with different XPath combination'
                    });
                } else if (count == 1) {
                    chrome.storage.local.set({
                        "anchorEvalXPath": value
                    });
                    addRemoveOutlineCustomeXpath(evaluateXpath(value).singleNodeValue);
                } else if (count > 1) {
                    let ex = addIndexToXpath(value);
                    if (ex != null) {
                        chrome.storage.local.set({
                            "anchorEvalXPath": ex
                        });
                        addRemoveOutlineCustomeXpath(evaluateXpath(ex).singleNodeValue);
                    } else
                        chrome.storage.local.set({
                            "anchorEvalXPath": 'Sorry! Please try with different XPath combination'
                        });
                }
            }
            break;
        case "AnchorXP":
            ortoni.parseAnchorXP();
            atrributesArray = [];
            webTableDetails = null;
            return true;
        case "changeXpSty":
            // draw border
            enablegcx = true;
            document.addEventListener("mouseover", mouseOver, true);
            document.addEventListener("mouseout", mouseOut, true);
            break;
        // remove border
        case "cancelChangeXpSty":
            enablegcx = !true;
            document.removeEventListener("mouseover", mouseOver, true);
            document.removeEventListener("mouseout", mouseOut, true);
            return true;
        // build possible xpath
        case "getXPath":
            ortoni.parseSelectedDOM();
            try {
                if (xpathArray != undefined) {
                    let domInfo = {
                        cssPath: cssPathArray,
                        webtabledetails: webTableDetails,
                        xpathid: xpathArray.sort(),
                        tag: tag,
                        type: type,
                        hasFrame: hasFrame,
                        variableFromBg: variableFromBg,
                        anchor: false,
                        atrributesArray: atrributesArray
                    };
                    if (_doc == document) {
                        chrome.runtime.sendMessage(domInfo);
                    }
                    atrributesArray = [];
                    webTableDetails = null;
                }
            } catch (error) { }
            return true;
        case 'startRecord':
            try {
                let domInfo = {
                    xpathid: undefined,
                }
                chrome.runtime.sendMessage(domInfo);
                isRecordEnabled = true;
                recordArray = [];
                recordArrayPOM = []
                startRecording();
            } catch (error) { }
            break;
        case 'stopRecord':
            try {
                isRecordEnabled = false;
                stopRecord();
            } catch (error) { }
            break;
        default:
            return true;
    }
}
// get index value from user!
// get index value from user!
// gcx  - get clicked xpath
var maxIndex = 5;
var tempMaxIndex = 5;
var maxId = 3;
chrome.storage.local.get(['index', 'idNum'], function (data) {
    if (data.index != undefined) {
        tempMaxIndex = data.index;
    }
    if (data.idNum != undefined) {
        maxId = data.idNum;
    }
});
var setPreOrFol = null;
var variableName = null;
var methodName = null;
var hasFrame = null;
var variableFromBg = null;
var type = null;
var tag = null;
var tagArrHolder = [];
let dupArray = [];
var xpathArray;
var cssPathArray = null;
var mulXpathArray = [];
var rutoInc = null
var ruto = "[@rutoxpath='ruto']";
var _doc = '';
var atrributesArray = [];
var webTableDetails = null;

ortoni.buildXpath = (element, boolAnchor) => {
    if (element.shadowRoot != null) {
        setStorage('-1');
        chrome.runtime.sendMessage({
            shadowRoot: true,
            anchor: undefined
        });
        throw new TypeError('shadow dom not yet supported')
    }
    let removeRuto = `//*${ruto}`;
    let re = evaluateXpath(removeRuto)
    if (re.singleNodeValue != null) {
        re.singleNodeValue.removeAttribute('rutoxpath');
    }
    // To avoid  multiple message calling
    _doc = document;
    // add a attribute to locate the element
    element.setAttribute('rutoxpath', 'ruto')
    // generate method and varible name
    try {
        let name = getMethodOrVarText(element);
        getVariableAndMethodName(name);
        methodName = methodName.length >= 2 && methodName.length < 25 ? methodName : methodName.slice(0, 10);
        chrome.storage.local.set({
            'methodName': methodName
        });
        variableName = variableName.length >= 2 && variableName.length < 25 ? variableName : variableName.slice(0, 10);
        chrome.storage.local.set({
            'variableName': variableName
        });
        variableFromBg = variableName;
    } catch (error) {
        variableFromBg = null;
        chrome.storage.local.set({
            'methodName': null
        });
        chrome.storage.local.set({
            'variableName': null
        });
    }
    // create an array to put available xpath - generate different type and add
    xpathArray = [];

    // Handle SVG
    if ((element.farthestViewportElement != undefined) || (element.tagName === 'SVG') || (element.tagName === 'svg')) {
        try {
            element = element.farthestViewportElement.parentNode;
        } catch (error) {
            element = element.parentNode
        }
    }
    // To get tag name
    let tagName = element.tagName.toLowerCase();
    tag = tagName;
    if (element.hasAttribute('type')) {
        type = element.type
    }

    if (document.getElementsByTagName(tag).length == 1) {
        xpathArray.push([10, 'Tag Name is unique', tag])
    }
    // to find whether element is in frame
    hasFrame = frameElement != null ? frameElement : null;

    // TODO:
    // Find no.of frames available, then generate XPath or index for that

    // let frameLength = window.frames.length;

    // To get all attribuites
    let attributeElement = element.attributes;

    // let childNextSibling = element.nextSibling;
    let preiousSiblingElement = element.previousElementSibling;

    // To iterate all attributes xpath
    try {
        xpathAttributes(attributeElement, tagName, element);
    } catch (e) { }

    // Following-sibling push to array
    try {
        xpathFollowingSibling(preiousSiblingElement, tagName);
    } catch (e) { }

    // Text Based xpath
    try {
        if (element.innerText != '')
            xpathText(element, tagName);
    } catch (e) { }

    // to find label - following xpath only if tag name name is 'input or textarea'
    try {
        if ((tagName === 'input' || tagName === 'textarea')) {
            findLabel(element, tagName)
        }
    } catch (e) { }

    // get Parent node
    try {
        getParent(element, tagName)
    } catch (error) { }

    try {
        if (element.closest('table')) {
            handleTable(element);
        }
    } catch (error) { }
    // if no xpath found
    try {
        if (xpathArray.length < 3)
            xpathArray.push([90, 'Long XPATH', getXPathWithPosition(element)])
    } catch (error) { }
    try {
        cssPathArray = [];
        let css = getLongCssPath(element)
        if (document.querySelectorAll(css).length == 1)
            cssPathArray.push([11, 'CSS', css]);
    } catch (error) { }

    // Code changes for ANCHOR BASED XPATH
    switch (boolAnchor) {
        case 0:
            setStorage(xpathArray.length + cssPathArray.length)
            try {
                removeTunaXpath(element);
            } catch (e) { }
            // TODO check condition
            if (isRecordEnabled) {
                xpathArray.sort();
                searchXPathArray.push([variableName, methodName, xpathArray[0][1], xpathArray[0][2]]);
            }
            break;
        case 1:
            tagArrHolder.push(tagName);
            anchorXPath(xpathArray, tagArrHolder, dupArray, element);
            break;
    }
}
function extractElefromNode(ele, array) {
    if (ele.hasAttribute('id')) {
        if (document.querySelectorAll(`[id='${ele.id}']`).length == 1)
            return array.unshift(`//${ele.tagName.toLowerCase()}[@id='${ele.id}']`);
    } else if (ele.hasAttribute('name')) {
        if (document.querySelectorAll(`[name='${ele.name}']`).length == 1)
            return array.unshift(`//${ele.tagName.toLowerCase()}[@name='${ele.name}']`);
    }
    return null;
}
function getXPathWithPosition(ele) {
    let rowsPath = [];
    while (ele.nodeType === 1) {
        let tag = ele.tagName.toLowerCase();
        if (extractElefromNode(ele, rowsPath) != null) {
            break;
        } else {
            let prevSib = ele, position = 1;
            while (prevSib = prevSib.previousElementSibling) {
                if (prevSib.tagName.toLowerCase() == tag) position++;
            }
            tag += `[${position}]`
        }
        rowsPath.unshift(tag);
        ele = ele.parentNode
    }
    return rowsPath.join('/');
}
function anchorXPath(getsingleXPath, tagArr, dupArray, element) {
    if (dupArray.length == 0) {
        let r = evaluateXpath("//*[@rutoxpath='ruto']");
        r.singleNodeValue.removeAttribute('rutoxpath');
    }
    dupArray.push(getsingleXPath);
    let length = dupArray.length
    if (length == 1) {
        clickedElement.className += ' chromexPathFinder1';
        setStorage('+1')
        try {
            removeTunaXpath(element);
        } catch (e) { }
    }
    if (length == 2) {
        let srcArrayXP = [];
        let dstArrayXP = [];
        let firstElement = dupArray[0][0][2];
        if (firstElement.startsWith("//") || firstElement.startsWith("(")) {
            firstElement = firstElement;
        } else {
            let a = dupArray[0];
            for (let index = 0; index < a.length; index++) {
                let c = dupArray[0][index][2];
                if (c.startsWith('//') || c.startsWith('(')) {
                    firstElement = dupArray[0][index][2];
                    break;
                }
            }
        }
        let secondElement = `*${ruto}`;
        if (getCountForEachXpath(`${firstElement}/following::${secondElement}`) == 1) {
            setPreOrFol = '/following::'
        } else if (getCountForEachXpath(`${firstElement}/preceding::${secondElement}`) == 1) {
            setPreOrFol = '/preceding::'
        } else {
            setPreOrFol = null;
        }
        let sxp = dupArray[0];
        let dxp = dupArray[1];
        extractXPathFormArray(sxp, srcArrayXP, tagArr[0]);
        extractXPathFormArray(dxp, dstArrayXP, tagArr[1]);
        let defaultXP = `//${srcArrayXP[0][1]}${setPreOrFol}${dstArrayXP[0][1]}`;
        let defaultCount = getCountForEachXpath(defaultXP);
        if (defaultCount == 0 || defaultCount == undefined) {
            defaultXP = "Pattern not matched, Please try other option by click on 'Advance'";
        } else if (defaultCount == 1) {
            defaultXP = defaultXP;
        } else if (defaultCount > 1) {
            defaultXP = addIndexToXpath(defaultXP);
        }
        let dom = {
            webtabledetails: webTableDetails,
            anchor: true,
            proOrFol: setPreOrFol,
            src: srcArrayXP,
            dst: dstArrayXP,
            defaultXPath: defaultXP,
        }
        clickedElement.className += ' chromexPathFinder2';
        if (_doc == document) {
            chrome.runtime.sendMessage(dom);
        }
        webTableDetails = null;
        // make xpath to 0 so it can be used again
        tagArrHolder = [];
        dupArray.length = 0
        setStorage(1)
    }
    function extractXPathFormArray(sxp, anchorArr, tag) {
        for (const key in sxp) {
            let xpathNumber = sxp[key][0];
            let xpathValue = sxp[key][1];
            let xpathData = sxp[key][2];
            switch (xpathNumber) {
                case 1:
                    // ID
                    pushXPath(xpathData, anchorArr, tag, 'id', 1, xpathValue);
                    break;
                case 2:
                    // Name
                    pushXPath(xpathData, anchorArr, tag, 'name', 2, xpathValue);
                    break;
                case 3:
                    // CLASS
                    pushXPath(xpathData, anchorArr, tag, 'class', 3, xpathValue);
                    break;
                case 0:
                    // LINK
                    if (xpathData.startsWith('//') || xpathData.startsWith('(')) {
                        // let temp = xpathData.substring(0, xpathData.lastIndexOf(')'));
                        if (xpathData.startsWith('//')) {
                            xpathData = xpathData.substring(2, xpathData.length);
                            anchorArr.push([0, xpathData, xpathValue.split(' ')[0]]);
                        } else if (xpathData.startsWith('(//')) {
                            xpathData = xpathData.substring(3, xpathData.lastIndexOf(')'));
                            anchorArr.push([0, xpathData, xpathValue.split(' ')[0]]);
                        }
                    } else {
                        //a[text()[normalize-space()='Docs Wiki']]
                        let temp = `${tag}[text()[normalize-space()='${xpathData}']]`;
                        anchorArr.push([0, temp, xpathValue.split(' ')[0]]);
                    }
                    break;
                case 10:
                    // TAG
                    anchorArr.push([10, tag, xpathValue.split(' ')[0]]);
                    break;
                default:
                    // Others
                    if (xpathData.startsWith('//') || xpathData.startsWith('(')) {
                        // let temp = xpathData.substring(0, xpathData.lastIndexOf(')'));
                        if (xpathData.startsWith('//')) {
                            xpathData = xpathData.substring(2, xpathData.length);
                            anchorArr.push([2, xpathData, xpathValue.split(' ')[0]]);
                        } else if (xpathData.startsWith('(//')) {
                            xpathData = xpathData.substring(3, xpathData.lastIndexOf(')'));
                            anchorArr.push([-1, xpathData, xpathValue.split(' ')[0]]);
                        }
                    }
                    break;
            }
        }
    }
    function pushXPath(xpathData, anchorArr, tag, attr, number, xpathValue) {
        if (xpathData.startsWith('//') || xpathData.startsWith('(')) {
            // let temp = xpathData.substring(0, xpathData.lastIndexOf(')'));
            if (xpathData.startsWith('//')) {
                xpathData = xpathData.substring(2, xpathData.length);
                anchorArr.push([number, xpathData, xpathValue.split(' ')[0]]);
            } else if (xpathData.startsWith('(//')) {
                xpathData = xpathData.substring(3, xpathData.lastIndexOf(')'));
                anchorArr.push([number, xpathData, xpathValue.split(' ')[0]]);
            }
        } else {
            let temp = `${tag}[@${attr}='${xpathData}']`;
            anchorArr.push([number, temp, xpathValue.split(' ')[0]]);
        }
    }
}
// Set XPath length in Chrome Badge
function setStorage(c) {
    chrome.storage.local.set({
        'total': c
    });
}
// get parent based XPath
function getParent(element, tagName) {
    let parent = element.parentNode;
    let bo = false;
    bo = checkIDNameClassHref(parent, bo);
    while (bo == false) {
        parent = parent.parentNode;
        bo = checkIDNameClassHref(parent, bo);
    }
    let attributeElement = parent.attributes;
    var tag = parent.tagName.toLowerCase();
    var parentId = null;
    var parentClass = null;
    var parentName = null;
    var others = null;
    Array.prototype.slice.call(attributeElement).forEach(function (item) {
        if (!(filterAttributesFromElement(item))) {
            switch (item.name) {
                case "id":
                    parentId = getParentId(parent, tag)
                    break;
                case "class":
                    parentClass = getParentClassName(parent, tag)
                    break;
                case "name":
                    parentName = getParentName(parent, tag)
                    break;
                default:
                    let temp = item.value;
                    if (temp != '') {
                        others = `//${tag}[@${item.name}='${temp}']`
                    }
                    break;
            }
        }
    });
    if (parentId != null && parentId != undefined) {
        getParentXp(parentId, tagName, 'id', element);
    }
    if (parentClass != null && parentClass != undefined) {
        getParentXp(parentClass, tagName, 'class', element);
    }
    if (parentName != null && parentName != undefined) {
        getParentXp(parentName, tagName, 'name', element);
    }
    if (others != null && others != undefined) {
        getParentXp(others, tagName, 'attribute', element);
    }
    function getParentXp(parent, tagName, locator, element) {
        let tem = `${parent}//${tagName}[1]`;
        let checkTem = evaluateXpath(tem)
        let c = getCountForEachXpath(tem);
        if (c == 0) {
            return null;
        }
        if (c == 1) {
            try {
                if (checkTem.singleNodeValue.hasAttribute('rutoxpath')) {
                    xpathArray.push([9, `Parent based ${locator} XPath`, tem]);
                } else {
                    tem = `${parent}//${tagName}`;
                    c = getCountForEachXpath(tem);
                    if (c == 0) {
                        return null;
                    }
                    if (c >= 1) {
                        try {
                            let te = addIndexToXpath(tem)
                            checkTem = evaluateXpath(te)
                            if (checkTem.singleNodeValue.attributes.rutoxpath.value === "ruto") {
                                xpathArray.push([9, `Parent based ${locator} XPath`, te]);
                            }
                        } catch (e) { }
                    }
                }
            } catch (e) { }
        } else if (c > 1) {
            tem = `${parent}//${tagName}`;
            let t = addIndexToXpath(tem);
            if (t != undefined && t != null) {
                xpathArray.push([9, `Parent based ${locator} XPath`, t]);
            }
        }
    }
}
function checkIDNameClassHref(parent, bo) {
    Array.prototype.slice.call(parent.attributes).forEach(function (item) {
        if (item.name === 'id' || item.name === 'class' || item.name === 'name')
            bo = true;
    });
    return bo;
}
// Add all XPath based on attributes
function xpathAttributes(attributeElement, tagName, element) {
    addAllXpathAttributesBbased(attributeElement, tagName, element);
}
// Add xpath following-sibling
function xpathFollowingSibling(preiousSiblingElement, tagName) {
    if (preiousSiblingElement != null || preiousSiblingElement != undefined) {
        addPreviousSibling(preiousSiblingElement, tagName);
    }
}
// Remove manual added element
function removeTunaXpath(element) {
    element.removeAttribute('rutoxpath', 'ruto');
}
// Get Text based XPath 
function xpathText(element, tagName) {
    let textBasedXpathEle = getTextBasedXpath(element, tagName);
    if (!((textBasedXpathEle === null) || (textBasedXpathEle === undefined))) {
        xpathArray.push([6, 'Text based XPath', textBasedXpathEle]);
    }
}
function findLabel(element, tagName) {
    var label, span = undefined;
    let ele = `//*[@rutoxpath='ruto']`;
    try {
        label = getLabelTxet(ele, tagName)
    } catch (error) { }
    try {
        span = getSpanText(ele, tagName)
    } catch (error) { }
    try {
        if (label === undefined && span === undefined) {
            let xp = getParentText(element, tagName)
            let temp = xp;
            xp = evaluateXpath(xp);
            if (xp != null && xp != undefined && ((xp.singleNodeValue.attributes.rutoxpath) != undefined)) {
                xpathArray.push([6, 'Text based following XPath', temp]);
            } else {
                temp = addIndexToXpath(temp)
                if (temp != null) {
                    xpathArray.push([6, 'Text based following XPath', temp]);
                }
            }
        }
    } catch (error) { }
}
function getParentText(element, tagName) {
    let ep = element.parentNode.parentNode;
    var child = ep.children;
    var tagN = null;
    var setBool = false;
    for (var i = 0; i < child.length; i++) {
        let innerChildLen = child[i].children.length;
        for (let i = 0; i < innerChildLen; i++) {
            if (child[i].children[i].textContent.length > 1) {
                ep = child[i].children[i];
                tagN = ep.tagName;
                setBool = true;
                break;
            }
        }
        if (setBool)
            break;
    }
    let text = getTextBasedXpath(ep, tagN.toLowerCase())
    let temp = `${text}/following::${tagName}`;
    let count = getCountForEachXpath(temp);
    if (count == 1) {
        let xp = `${text}/following::${tagName}[1]`;
        return xp;
    } else if (count > 1) {
        let xp = `${text}/following::${tagName}`;
        xp = addIndexToXpath(xp)
        return xp;
    } else
        return null;
}
function getLabelTxet(ele, tagName) {
    var labelNode = `${ele}/preceding::label[1]`;
    let checkLabelType = evaluateXpath(labelNode);
    try {
        if (typeof (checkLabelType.singleNodeValue.textContent) === 'string') {
            return getLabel(labelNode, tagName);
        } else {
            throw 'no label preceding';
        }
    } catch (error) { }
}
function getSpanText(ele, tagName) {
    var spanNode = `${ele}/preceding::span[1]`;
    let checkSpanType = evaluateXpath(spanNode);
    try {
        if (typeof (checkSpanType.singleNodeValue.textContent) === 'string') {
            return getLabel(spanNode, tagName);
        } else {
            throw 'no span text'
        }
    } catch (error) { }
}
function getLabel(node, tagName) {
    let c = getCountForEachXpath(node);
    if (c > 0) {
        var label = evaluateXpath(node);
        var newEle = label.singleNodeValue;
        var labelTag = newEle.tagName.toLowerCase();
        var labelText = getTextBasedXpath(newEle, labelTag);
        var newLabelXpath = labelText + '/' + 'following::' + tagName;
        if (getCountForEachXpath(newLabelXpath) == 1) {
            let newLabel = evaluateXpath(newLabelXpath);
            if (newLabel != null && newLabel != undefined && ((newLabel.singleNodeValue.attributes.rutoxpath) != undefined)) {
                xpathArray.push([6, 'Text based following XPath', newLabelXpath]);
                return newLabelXpath;
            }
        } else {
            var labelTextWithIndex = addIndexToXpath(newLabelXpath)
            let newLabel = evaluateXpath(labelTextWithIndex);
            if (!((newLabel === null) || (newLabel === undefined) || ((newLabel.singleNodeValue.attributes.rutoxpath) === undefined))) {
                xpathArray.push([6, 'Text based following XPath', labelTextWithIndex]);
                return labelTextWithIndex;
            }
        }
    }
}
// Add preceding element
function addPreviousSibling(preSib, tagName) {
    try {
        let classHasSpace = false;
        let temp;
        let previousSiblingTagName = preSib.tagName.toLowerCase();
        Array.prototype.slice.call(preSib.attributes).forEach(function (item) {
            if (!(filterAttributesFromElement(item))) {
                var tempvalue = null;
                switch (item.name) {
                    case 'id':
                        if (preSib.hasAttribute('id')) {
                            let id = preSib.id;
                            let re = new RegExp('\\d{' + maxId + ',}', '\g');
                            let matches = re.test(id);
                            if ((id != null) && (id.length > 0) && matches == false) {
                                tempvalue = id;
                            }
                        }
                        break;
                    case 'class':
                        if (preSib.hasAttribute('class')) {
                            tempvalue = preSib.className;
                            let splClass = tempvalue.trim().split(" ");
                            if (splClass.length > 2) {
                                tempvalue = `contains(@class,'${splClass[0]} ${splClass[1]}')`;
                                classHasSpace = true;
                            }
                        }
                        break;
                    case 'name':
                        if (preSib.hasAttribute('name')) {
                            tempvalue = preSib.name;
                        }
                        break;
                    default:
                        tempvalue = item.value;
                }
                if (tempvalue == '') {
                    tempvalue = null;
                }
                if (classHasSpace) {
                    temp = `//${previousSiblingTagName}[${tempvalue}]/following-sibling::${tagName}[1]`
                    if (temp.startsWith('//')) {
                        if (getCountForEachXpath(temp) == 1 && evaluateXpath(temp).singleNodeValue.attributes.rutoxpath != undefined) {
                            xpathArray.push([8, 'Following sibling based XPath', temp]);
                        } else {
                            let t = addIndexToXpath(`//${previousSiblingTagName}[${tempvalue}]/following-sibling::${tagName}`)
                            if (t != undefined) {
                                xpathArray.push([8, 'Following sibling based XPath', t])
                            } else
                                temp = null;
                        }
                    }

                } else if (tempvalue != null) {
                    temp = `//${previousSiblingTagName}[@${item.name}='${tempvalue}']/following-sibling::${tagName}[1]`
                    if (temp.startsWith('//')) {
                        if (getCountForEachXpath(temp) == 1 && evaluateXpath(temp).singleNodeValue.attributes.rutoxpath != undefined) {
                            xpathArray.push([8, 'Following sibling based XPath', temp]);
                        } else {
                            let t = addIndexToXpath(`//${previousSiblingTagName}[@${item.name}='${tempvalue}']/following-sibling::${tagName}`)
                            if (t != undefined) {
                                xpathArray.push([8, 'Following sibling based XPath', t])
                            } else
                                temp = null;
                        }
                    }
                }
            }
        });
        if (temp == null || (preSib.innerText.length > 1)) {
            let temp1;
            let labelText;
            let tag;
            let bo = false;
            let child = preSib.parentNode.children;
            for (let i in child) {
                let text = child[i].textContent;
                if (text != '') {
                    labelText = text;
                    tag = child[i].tagName.toLowerCase()
                    break;
                }
            }
            if (labelText.match(/[\r\n\x0B\x0C\u0085\u2028\u2029]+/g)) {
                labelText = labelText.replace(/[\r\n\x0B\x0C\u0085\u2028\u2029]+/g, " ")
                bo = true;
            }
            if (bo && labelText.trim().length > 1) {
                temp1 = `//${tag}[text()[normalize-space()='${labelText.trim()}']]/following-sibling::${tagName}[1]`;
            } else {
                temp1 = `//${tag}[text()='${labelText}']/following-sibling::${tagName}[1]`;
            }
            let c = getCountForEachXpath(temp1)
            temp1 = `//${tag}[text()='${labelText}']/following-sibling::${tagName}`;
            if (c == 0) {
                return null
            }
            if (c == 1 && evaluateXpath(temp1).singleNodeValue.attributes.rutoxpath != undefined) {
                xpathArray.push([8, 'Following sibling based XPath', temp1])
            } else if ((c != undefined) || (c != null)) {
                xp = addIndexToXpath(temp1)
                if (xp != undefined) {
                    xpathArray.push([8, 'Following sibling based XPath', xp])
                }
            }
        }
    } catch (error) { }
}
// Add all atrributes xpath except filter
function addAllXpathAttributesBbased(attribute, tagName, element) {
    Array.prototype.slice.call(attribute).forEach(function (item) {
        // Filter attribute not to shown in xpath
        atrributesArray.push(item.name);
        if (!(filterAttributesFromElement(item))) {
            // Pushing xpath to arrays
            switch (item.name) {
                case 'id':
                    let id = getIdBasedXpath(element, tagName)
                    if (id != null) {
                        xpathArray.push([1, 'Id is unique:', id])
                    }
                    ; break;
                case 'class':
                    let className = getClassBasedXpath(element, tagName)
                    if (className != null) {
                        xpathArray.push([3, 'Class based XPath', className])
                    }
                    break;
                case 'name':
                    let name = getNameBasedXpath(element, tagName)
                    if (name != null) {
                        xpathArray.push([2, 'Name based XPath', name])
                    }
                    break;
                default:
                    let temp = item.value;
                    var allXpathAttr = null;
                    if (temp != '') {
                        allXpathAttr = `//${tagName}[@${item.name}='${temp}']`
                    }
                    if (getCountForEachXpath(allXpathAttr) == 1) {
                        xpathArray.push([4, 'Collection based XPath', allXpathAttr]);
                    } else {
                        let temp = addIndexToXpath(allXpathAttr);
                        if (temp != undefined) {
                            xpathArray.push([4, 'Collection based XPath', temp]);
                        }
                    }
                    break;
            }
        }
    });

}
// Filter values not to push
function filterAttributesFromElement(item) {
    return (item.name === 'rutoxpath') || (item.name === 'jsname') || (item.name === 'jsmodel') || (item.name === 'jsdata') || (item.name === 'jscontroller') || (item.name === 'face') || (item.name.includes('pattern')) || (item.name.includes('length')) || (item.name === 'border') || (item.name === 'formnovalidate') || (item.name === 'required-field') || (item.name === 'ng-click') || (item.name === 'tabindex') || (item.name === 'required') || (item.name === 'strtindx') || ((item.name === 'title') && (item.value === '')) || (item.name === 'autofocus') || (item.name === 'tabindex') || ((item.name === 'type') && (item.value === 'text')) || (item.name === 'ac_columns') || // (item.name.startsWith('d')) ||
        (item.name === 'ac_order_by') || (item.name.startsWith('aria-')) || (item.name === 'href' && !(item.value.length <= 50)) || (item.name === 'aria-autocomplete') || (item.name === 'autocapitalize') || (item.name === 'jsaction') || (item.name === 'autocorrect') || (item.name === 'aria-haspopup') || (item.name === 'style') || (item.name === 'size') || (item.name === 'height') || (item.name === 'width') || (item.name.startsWith('on')) || (item.name === 'autocomplete') || (item.name === 'value' && item.value.length <= 2) || (item.name === 'ng-model-options') || (item.name === 'ng-model-update-on-enter') || (item.name === 'magellan-navigation-filter') || (item.name === 'ng-blur') || (item.name === 'ng-focus') || (item.name === 'ng-trim') || (item.name === 'spellcheck') || (item.name === 'target') || (item.name === 'rel') || (item.name === 'maxlength');
}
// Add Index to All XPATH
function addIndexToXpath(allXpathAttr) {
    try {
        var index = 0;
        let doc = document.evaluate(allXpathAttr, document, null, XPathResult.ANY_TYPE, null);
        var next = doc.iterateNext();
        try {
            while (next && index <= maxIndex) {
                index++;
                if ((next.attributes.rutoxpath) != undefined) {
                    throw 'break';
                }
                next = doc.iterateNext();
            }
        } catch (error) { }
        let indexedXpath = `(${allXpathAttr})[${index}]`;
        if (index <= maxIndex) {
            let c = getCountForEachXpath(indexedXpath)
            if (c > 0) {
                return indexedXpath;
            }
        } else
            return null;
    } catch (error) { }

}
// To get text(contains() & text() & starts-with & dot contains(for <br>)) based xpath
function getTextBasedXpath(element, tagName) {
    let textBasedXpath = null;
    var checkReturn;
    let link;
    let hasSpace = false;
    let gotPartial = false;
    if (element.textContent.length > 0) {
        // link text
        if (tagName === 'a') {
            link = element.textContent;
            if (element.childElementCount > 0) {
                link = element.children[0].innerText;
                if (link != undefined) {
                    let partialLink = `//a[contains(text(),'${link.trim()}')]`;
                    if (getCountForEachXpath(partialLink) == 1) {
                        xpathArray.push([0, 'Partial Link Text: ', link.trim()])
                        gotPartial = true;
                    }
                } else {
                    link = element.textContent;
                }
            }
            let temp = `//a[contains(text(),'${link.trim()}')]`
            checkReturn = link.match(/[\r\n\x0B\x0C\u0085\u2028\u2029]+/g);
            if (checkReturn && gotPartial == false) {
                link = link.replace(/[\r\n\x0B\x0C\u0085\u2028\u2029]+/g, " ")
                hasSpace = link.match(/\s/g);
                if (hasSpace) {
                    link = link.replace(/\s+/g, " ");
                    xpathArray.push([0, 'Link Text: ', link.trim()])
                }
            } else if (gotPartial == false && getCountForEachXpath(temp) == 1) {
                xpathArray.push([0, 'Link Text: ', link.trim()])
            } else if (gotPartial == false && getCountForEachXpath(`//a[text()='${link.trim()}']`) == 1) {
                xpathArray.push([0, 'Link Text: ', link.trim()])
            }
        }
        if (hasSpace) {
            let normalizeSpace = `//${tagName}[text()[normalize-space()='${link.trim()}']]`;
            let validNSXP = getCountForEachXpath(normalizeSpace)
            if (validNSXP == 1) {
                xpathArray.push([6, 'Normalize Space', normalizeSpace])
            } else if (validNSXP > 1) {
                let xp = addIndexToXpath(normalizeSpace)
                if (xp != null && xp != undefined)
                    xpathArray.push([6, 'Normalize Space', xp])
            }
        }

        // if tagName is select then text should not appears
        if (tagName != "select" && tagName != 'a') {
            var innerText = element.textContent;
            let hasBr = false;
            if (innerText.match(/[\r\n\x0B\x0C\u0085\u2028\u2029]+/g)) {
                hasSpace = innerText.match(/\s/g);
                if (hasSpace) {
                    innerText = innerText.replace(/\s+/g, " ");
                    if (innerText != " ") {
                        textBasedXpath = `//${tagName}[text()[normalize-space()='${innerText.trim()}']]`;
                    }
                    let validText = getTextCount(textBasedXpath)
                    while (validText) {
                        return textBasedXpath;
                    }
                }
            } else {
                textBasedXpath = `//${tagName}[text()='${innerText}']`;
                let simpleText = getTextCount(textBasedXpath);
                while (simpleText) {
                    return simpleText;
                }
            }
            let findBr = element.childNodes;
            let otherChild = element.childNodes;
            for (let br in findBr) {
                if (findBr[br].nodeName === 'BR') {
                    hasBr = true;
                    break;
                }
            }
            if (hasBr) {
                let containsdotText = '[contains(.,\'' + innerText.trim() + '\')]';
                textBasedXpath = '//' + tagName + containsdotText;
                let containsDotText = getTextCount(textBasedXpath);
                while (containsDotText) {
                    return containsDotText;
                }
            } else if (otherChild.length > 1) {
                var temp = null;
                for (var i = 0; i < otherChild.length; i++) {
                    if ((otherChild[i].textContent.length > 1) && (otherChild[i].textContent.match(/\w/g))) {
                        temp = otherChild[i].textContent;
                        textBasedXpath = '//' + tagName + '[text()=\'' + temp.trim() + '\']';
                        let otherChilText = getTextCount(textBasedXpath);
                        while (otherChilText) {
                            return otherChilText;
                        }
                    }
                }
            }
            if (innerText.length > 0) {
                if (innerText.match(/[\r\n\x0B\x0C\u0085\u2028\u2029]+/g)) {
                    hasSpace = innerText.match(/\s/g);
                    if (hasSpace) {
                        innerText = innerText.replace(/\s+/g, " ");
                        textBasedXpath = `//${tagName}[text()[normalize-space()='${innerText.trim()}']]`;
                    }
                } else if (innerText.match("\\s")) {
                    let containsText = '[contains(text(),\'' + innerText.trim() + '\')]';
                    textBasedXpath = '//' + tagName + containsText;
                    if (getCountForEachXpath(textBasedXpath) == 0) {
                        let t = innerText.split(/\u00a0/g)[1];
                        textBasedXpath = `//${tagName}[text()='${t}']`;
                    } else if (getCountForEachXpath(textBasedXpath) === 0) {
                        let startsWith = '[starts-with(text(),\'' + innerText.split(/\u00a0/g)[0].trim() + '\')]';
                        textBasedXpath = '//' + tagName + startsWith;
                    }
                }
            }
        }
        let count = getCountForEachXpath(textBasedXpath);
        if (count == 0 || count == undefined) {
            textBasedXpath = null;
        } else if (count > 1) {
            textBasedXpath = addIndexToXpath(textBasedXpath);
        }
        /**
         * To handle wild character like single quotes in a text
         */
        if (textBasedXpath.startsWith('//') || textBasedXpath.startsWith('(')) {
            let len = textBasedXpath.split('\'').length;
            if (len > 2) {
                let firstIndex = textBasedXpath.indexOf('\'');
                let temp = textBasedXpath.replace(textBasedXpath.charAt(firstIndex), `"`);
                let lastIndex = temp.lastIndexOf('\'');
                textBasedXpath = setCharAt(temp, lastIndex, '"');
            }
        }
        return textBasedXpath;
    }
}
function setCharAt(str, index, chr) {
    if (index > str.length - 1)
        return str;
    return str.substr(0, index) + chr + str.substr(index + 1);
}
// Find no.of text based xpath
function getTextCount(text) {
    let c = getCountForEachXpath(text)
    if (c == 0 || c == undefined) {
        return null;
    } else if (c == 1) {
        return text;
    } else {
        return text = addIndexToXpath(text)
    }
}
// To get Id based xpath
function getParentId(element, tagName) {
    let clicketItemId = element.id;
    let re = new RegExp('\\d{' + maxId + ',}', '\g');
    let matches = re.test(clicketItemId);
    if ((clicketItemId != null) && (clicketItemId.length > 0) && matches == false) {
        let temp = `//${tagName}[@id='${clicketItemId}']`;
        return temp;
    } else
        return null;

}
function getParentName(element, tagName) {
    let clickedItemName = element.name;
    let matches = clickedItemName.match(/\d{3,}/g);
    if (!((clickedItemName === "") || (clickedItemName === undefined))) {
        let tempName = `//${tagName}[@name='${clickedItemName}']`
        return tempName;
    } else
        return null;
}
function getParentClassName(element, tagName) {
    let clickedItemClass = element.className;
    let splitClass = clickedItemClass.trim().split(" ");
    if (splitClass.length > 2) {
        let cl = `${splitClass[0]} ${splitClass[1]}`;
        let temp = `//${tagName}[contains(@class,'${cl}')]`;
        return temp;
    } else if (!((clickedItemClass === "") || (clickedItemClass === undefined))) {
        let tempClass = `//${tagName}[@class='${clickedItemClass}']`
        return tempClass;
    } else
        return null;
}
function getIdBasedXpath(element, tagName) {
    let idBasedXpath = null;
    let clicketItemId = element.id;
    let re = new RegExp('\\d{' + maxId + ',}', '\g');
    let matches = re.test(clicketItemId);
    if ((clicketItemId != null) && (clicketItemId.length > 0) && matches == false) {
        let tempId = "[@id=\'" + clicketItemId + "\']";
        idBasedXpath = '//' + '*' + tempId;
        let count = getCountForEachXpath(idBasedXpath)
        if (count == 0) {
            return null;
        } else if (count == 1) {
            return clicketItemId;
        } else {
            idBasedXpath = '//' + tagName + tempId;
            if (count > 1) {
                idBasedXpath = addIndexToXpath(idBasedXpath)
                if (idBasedXpath != null) {
                    xpathArray.push([1, 'Id based XPath:', idBasedXpath])
                }
                return null;
            }
        }
    }
    return idBasedXpath;
}
// To get class based xpath
function getClassBasedXpath(element, tagName) {
    let classBasedXpath = null;
    let clickedItemClass = element.className;
    let splitClass = clickedItemClass.trim().split(" ");
    if (splitClass.length > 2) {
        let cl = `${splitClass[0]} ${splitClass[1]}`;
        let temp = `//${tagName}[contains(@class,'${cl}')]`;
        let count = getCountForEachXpath(temp)
        if (count == 0) {
            return null;
        } else if (count > 1) {
            temp = addIndexToXpath(temp)
        }
        return temp;
        //  return null;
    }
    if (!((clickedItemClass === "") || (clickedItemClass === undefined))) {
        let tempClass = `//*[@class='${clickedItemClass}']`;
        let count = getCountForEachXpath(tempClass);
        let spl = clickedItemClass.trim().split(" ")
        if (count == 1 && spl.length == 1) {
            xpathArray.push([3, 'ClassName is unique', clickedItemClass]);
            return null;
        } else {
            classBasedXpath = `//${tagName}[@class='${clickedItemClass}']`;
            let count = getCountForEachXpath(classBasedXpath)
            if (count == 0) {
                return null;
            } else if (count == 1) {
                return classBasedXpath;
            } else {
                classBasedXpath = addIndexToXpath(classBasedXpath)
            }
        }
    }
    return classBasedXpath;
}
// To get Name based xpath
function getNameBasedXpath(element, tagName) {
    let nameBasedXpath = null;
    let clickedItemName = element.attributes.name.value;
    let matches = clickedItemName.match(/\d{3,}/g);
    if (!((clickedItemName === "") || (clickedItemName === undefined) || matches != null)) {
        let tempName = "[@name=\'" + clickedItemName + "\']";
        let tem = `//*${tempName}`;
        let count = getCountForEachXpath(tem)
        if (count == 1) {
            xpathArray.push([2, 'Name is unique:', clickedItemName])
        } else if (count > 1) {
            tem = `//${tagName}${tempName}`;
            nameBasedXpath = addIndexToXpath(tem)
        }
    }
    return nameBasedXpath;
}
// To get count of each element returns int
function getCountForEachXpath(element) {
    try {
        return document.evaluate('count(' + element + ')', document, null, XPathResult.ANY_TYPE, null).numberValue;
    } catch (error) { }
}
// Check if xpath is correct or not returns boolean
function evaluateXpath(element) {
    try {
        return document.evaluate(element, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
    } catch (error) { }
}