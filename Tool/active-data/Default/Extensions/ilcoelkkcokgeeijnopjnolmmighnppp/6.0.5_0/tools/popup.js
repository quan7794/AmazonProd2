// Update the relevant fields with the new data
async function setDOMInfo(info, isAnchorEnabled, wt, css) {
    switch (isAnchorEnabled) {
        case true:
            try { await makeTableAnc(wt); }
            catch (e) { }
            break;
        case false:
            try { if (info != undefined) { await makeTable(info, wt, css); } }
            catch (e) { }
            break;
        default:
            break;
    }
    if (shadow) {
        let ele = document.getElementsByTagName('h2')[0];
        ele.setAttribute('style', 'background:  #ffc107; text-align: center;');
        ele.textContent = 'Sorry 😟 Shadow Root not supported as of now';
        $(document).ready(function () {
            $(".showVaribale").append("<a href=\"https://sites.google.com/testleaf.com/ruto/blog/shadow-dom\"target =\"_blank\">Try alternate solution</a>");
        });
    }
}
async function makeTableAnc(wt) {
    showTableDetails(wt);
    showTextBox(this.defaultXP);
    let firstAnchor = document.getElementById('firstAnchor')
    setName('Source', firstAnchor);
    for (let i = 0; i < src.length; i++) {
        let tx = makeRadioButton(0, `//${src[i][1]}`, src[i][2])
        firstAnchor.appendChild(tx)
    }
    let secondAnchor = document.getElementById('secondAnchor')
    setName('Target', secondAnchor);
    for (let i = 0; i < dst.length; i++) {
        let tx = makeRadioButton(1, dst[i][1], dst[i][2])
        secondAnchor.appendChild(tx)
    }
    let adv = document.getElementById('collapsible');
    adv.style.display = 'block';
    function setName(text, node) {
        let src = document.createElement('span');
        src.setAttribute('class', 'ancHeader');
        src.textContent = text;
        node.appendChild(src);
    }
    // create radio b utton
    function makeRadioButton(name, value, text) {
        let label = document.createElement("label");
        label.setAttribute('class', 'containerAnc');
        let radio = document.createElement("input");
        radio.type = "radio";
        radio.name = name;
        radio.value = value;
        label.appendChild(radio);
        let span = document.createElement("span");
        span.setAttribute('class', 'checkmark')
        label.appendChild(span);
        label.appendChild(document.createTextNode(text));
        return label;
    }
}
// Display Xpath table in popup.html;
async function makeTable(infoContent, wt, css) {
    variableFromBg = variableFromBg != null ? variableFromBg : 'Element';
    if (hasFrame) {
        let ele = document.getElementsByTagName('h2')[0];
        ele.setAttribute('style', 'background:  #ffc107; text-align: center;');
        ele.textContent = variableFromBg + ' is in Frame';
    } else if (variableFromBg != 'Element') {
        let ele = document.getElementsByTagName('h2')[0];
        ele.setAttribute('style', 'color: black; background: #e6e6e680; text-align: center;');
        ele.textContent = variableFromBg;
    }
    var input;
    var ele = document.getElementById('outerDiv');
    let panel = document.getElementsByClassName('panel');
    var button;
    var select;
    // Creating table data
    try {
        for (let i = 0; i < 2; i++) {
            add(infoContent, i, 0, "XPath", false)
        }
    } catch (error) { }
    try {
        for (let index = 2; index < infoContent.length; index++) {
            add(infoContent, index, 0, "XPath", true)
        }
    } catch (error) { }
    try {
        for (let i = 0; i < css.length; i++) {
            add(css, i, infoContent.length + 10, "CSS", false);
        }
    } catch (error) { }
    // To add options in Select
    function addOptions(value, text, index) {
        var op = new Option();
        op.value = value;
        op.text = text;
        op.index = index;
        select.options.add(op);
    }
    let at = document.getElementById('attributesValuesfromNode')
    atrributesArray.forEach(ele => {
        if (ele != 'rutoxpath') {
            at.appendChild(makeRadioButtonAttributes(ele))
        }
    });
    showTableDetails(wt);
    function add(infoContent, i, j, value, bool) {
        let tDiv = document.createElement("div");
        tDiv.setAttribute("id", "tableXP");
        let label = document.createElement("LABEL");
        let a = document.createTextNode(infoContent[i][1]);
        label.appendChild(a)
        let tIDiv = document.createElement("div");
        tIDiv.setAttribute("id", "innertableXP");
        input = document.createElement("INPUT");
        // input.setAttribute('class', 'input is-rounded')
        input.setAttribute("type", "text");
        input.setAttribute("id", "xpath" + i + j);
        input.setAttribute("value", infoContent[i][2]);
        button = document.createElement("button");
        button.setAttribute("data-copytarget", "#xpath" + i + j);
        button.setAttribute("id", "btn")
        switch (i) {
            case 0:
                button.setAttribute("data-balloon", "Copy " + value);
                button.setAttribute("data-balloon-pos", "left");
                break;
        }
        // Create a text node
        let ifont = document.createElement("i")
        let bm = document.createElement("img");
        bm.setAttribute("src", "./../logo/icon/copy.svg")
        bm.setAttribute("data-copytarget", "#xpath" + i + j);
        ifont.appendChild(bm)
        button.appendChild(ifont);
        select = document.createElement("select");
        // select.setAttribute('class', 'select is-primary')
        select.setAttribute("id", "target" + i + j);
        addOptions('snippets', 'Code', i);
        switch (tag) {
            case 'select':
                addOptions(infoContent[i][2], 'DD Text', i);
                addOptions(infoContent[i][2], 'Value', i);
                addOptions(infoContent[i][2], 'Index', i);
                break;
            case 'input':
                if (type == 'text' || type == 'file' || type == 'password' || type == 'email' || type == 'search' || type == 'textarea') {
                    addOptions(infoContent[i][2], 'Type', i);
                    addOptions(infoContent[i][2], 'Attribute', i);
                } else {
                    addOptions(infoContent[i][2], 'Click', i);
                    addOptions(infoContent[i][2], 'Attribute', i);
                }
                break;
            case 'img':
                addOptions(infoContent[i][2], 'Click', i);
                addOptions(infoContent[i][2], 'Attribute', i);
                break;
            default:
                addOptions(infoContent[i][2], 'Click', i);
                addOptions(infoContent[i][2], 'Text', i);
                break;
        }
        document.body.appendChild(label);
        document.body.appendChild(input);
        document.body.appendChild(button);
        document.body.appendChild(select);
        tDiv.appendChild(label)
        tIDiv.appendChild(input)
        tIDiv.appendChild(button)
        tIDiv.appendChild(select);
        tDiv.appendChild(tIDiv)
        if (!bool) {
            ele.appendChild(tDiv);
        } else {
            panel[0].appendChild(tDiv);
            let acc = document.getElementsByClassName("accordion");
            acc[0].style.display = "block";
        }
    }
}
// To get content from Background page
var shadow = false;
var proOrFol = null;
var src = null;
var dst = null;
var type = null;
var pom = false;
var tag = null;
var hasFrame = null;
var method = null;
var variable = null;
var variableFromBg = null;
var clickMethodName = null;
var typeMethodName = null;
var getTextMethodName = null;
var getAtrMethodName = null;
var defaultXP = null;
var atrributesArray = null;
var gcx;
var snippets;
var valButton;
var atrvalFrmNode;
var webTableDetails = null;
var rec;
chrome.storage.local.get(['pom', 'click', 'type', 'getText', 'methodName', 'variableName', 'gcx', 'getAtr', 'isRecord'],
    function (pomSnip) {
        if (pomSnip.pom == 'true') { pom = true; }
        getAtrMethodName = pomSnip.getAtr;
        variable = pomSnip.variableName;
        method = pomSnip.methodName;
        clickMethodName = pomSnip.click;
        typeMethodName = pomSnip.type;
        getTextMethodName = pomSnip.getText;
        gcx = pomSnip.gcx;
        rec = pomSnip.isRecord;
        if (gcx == 'true') {
            document.getElementById('myonoffswitch').checked = true;
        } else if (gcx == 'false') {
            document.getElementById('myonoffswitch').checked = false;
        } if (rec == 'true') {
            document.getElementById('recordIcon').checked = true;
        } else if (rec == 'false') {
            document.getElementById('recordIcon').checked = false;
        }
    });
window.addEventListener('load', onInit, true);
function showTableDetails(wt) {
    if (wt != null) {
        let table = document.getElementById('webTable');
        table.style.display = "block";
        $(document).ready(function () {
            $("#webTable").append(`
            <li>total no.of tables available: ${wt.totalTables}</li>
            <li>Selected table</li>
            <div class="flex-containers"> 
            <input id="tableUniqueXpath" value= "${wt.tableLocator}"></input>
            <button data-copytarget="#tableUniqueXpath" id="btn">
            <img src="./../logo/icon/copy.svg" data-copytarget="#tableUniqueXpath">
            </button>
            </div>
            <li>Selected element</li>  
            <div class="flex-containers">
            <input id="tableSelectedData" value= "${wt.tableData}"></input>
            <button data-copytarget="#tableSelectedData" id="btn">
            <img src="./../logo/icon/copy.svg" data-copytarget="#tableSelectedData">
            </button>`);
        });
    }
}

function onInit() {
    chrome.storage.local.set({ 'total': 0 });
    snippets = document.getElementById('snippet');
    let bg = chrome.extension.getBackgroundPage();
    shadow = bg.shadowRoot;
    webTableDetails = bg.webtable;
    let w = bg.xpath;
    let css = bg.cssPath;
    defaultXP = bg.defaultXPath;
    tag = bg.tag;
    type = bg.type;
    hasFrame = bg.hasFrame;
    variableFromBg = bg.variableFromBg;
    proOrFol = bg.proOrFol;
    src = bg.src;
    dst = bg.dst;
    atrributesArray = [];
    atrributesArray = bg.atrributesArray;
    let isAnchorEnab = bg.anchor;
    setDOMInfo(w, isAnchorEnab, webTableDetails, css)
    valButton = document.getElementById('validateAnc');
    document.getElementById('collapsible').addEventListener("click", showAdvance, true);
    document.getElementById('validateAnc').addEventListener("click", validateAnc, true);
    document.querySelector('#anc').addEventListener('click', generateAnchor, true);
    document.getElementById('attributesValuesfromNode').addEventListener('click', getClickedAttributes, true)
    document.body.addEventListener('click', copy, true);
    document.body.addEventListener('change', generateSnippet, true);
    document.body.addEventListener('change', autosize);
    $(document).ready(function () {
        $('#myonoffswitch').change(function () {
            if (this.checked) {
                chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                    chrome.tabs.sendMessage(tabs[0].id, { subject: "changeXpSty", gcx: true });
                });
                chrome.storage.local.set({ 'gcx': 'true' }, () => {
                    show_notifications('Just click on any field to generate XPath')
                })
            } else {
                chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                    chrome.tabs.sendMessage(tabs[0].id, { subject: "cancelChangeXpSty", gcx: false });
                });
                chrome.storage.local.set({ 'gcx': 'false' }, () => {
                    show_notifications('Use Context click menu to get XPath')
                })
            }
        });
        $('#recordIcon').change(function () {
            if (this.checked) {
                send({ subject: 'startRecord' })
                chrome.storage.local.set({ 'isRecord': 'true' }, () => {
                    show_notifications('Click on the elements...')
                    // window.close();
                });
            } else {
                send({ subject: 'stopRecord' });
                chrome.storage.local.set({ 'isRecord': 'false' }, () => {
                    show_notifications('Recording stopped. Downloading... Snippet')
                });
            }
        })
    });
    document.querySelector('#setting').addEventListener('click', () => {
        if (chrome.runtime.openOptionsPage) {
            chrome.runtime.openOptionsPage();
        } else {
            window.open(chrome.runtime.getURL('option.html'));
        }
    });
    atrvalFrmNode = document.getElementById('attributesValuesfromNode');
    let acc = document.getElementsByClassName("accordion");
    acc[0].addEventListener("click", function () {
        this.classList.toggle("active");
        var panel = this.nextElementSibling;
        if (panel.style.display === "block") {
            panel.style.display = "none";
        } else {
            panel.style.display = "block";
        }
    });
}

function send(data) {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, data)
    });
}
function search(e) {
    let val = e.target.previousElementSibling.value;
    let searchData = {
        subject: 'search',
        data: val
    }
    send(searchData);
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// validate anchor based xpath based on validate click button
let validateAnc = async function (e) {
    let c = e.target.value;
    let anchorDetails = {
        subject: 'validateAnchorDetails',
        data: c
    }
    send(anchorDetails);
    await sleep(100).then(() => {
        chrome.storage.local.get('anchorEvalXPath', (f) => {
            showTextBox(f.anchorEvalXPath);
        });
    });
}
var org = null;
function getClickedAttributes(e) {
    let text = e.target.tagName == 'INPUT' ? e.target.value : e.target.firstElementChild.value;
    let replaced = org.replace('attribute_value', text);
    document.getElementById('snippet').textContent = replaced
}
function showTextBox(f) {
    snippets.style.display = 'block';
    snippets.textContent = f;
    let cop = document.getElementById("copySnippet");
    cop.textContent = 'Copy XPath';
    cop.style.display = 'block';
}

// Chrome notifications
function show_notifications(text) {
    var notify = {
        type: 'basic',
        iconUrl: 'logo/128.png',
        title: 'Ruto',
        message: `${text}`
    }
    chrome.notifications.create('notify', notify)
}
// To autosize textarea
function autosize() {
    let el = document.querySelector('textarea');
    if (el.textLength > 1) {
        el.style.cssText = 'height:' + el.scrollHeight + 'px';
    }
}
// To generate Snippets DropDown
function generateSnippet(e) {
    try {
        let t = e.target;
        let snippetType = t.selectedOptions[0].textContent;
        let str = t.selectedOptions[0].value;
        let locator = t.parentElement.parentElement.firstChild.textContent;
        let snippets = document.getElementById('snippet');
        let cop = document.getElementById("copySnippet");

        switch (locator.trim()) {
            case "CSS":
                if (pom) {
                    variable = variable != null ? variable : 'ele';
                    str = `@FindBy(how = How.CSS, using="${str}")\nprivate WebElement ${variable};\npublic void methodName(){\n`
                } else str = `driver.findElement(By.cssSelector("${str}"))`;
                break;
            case "ClassName is unique":
                if (pom) {
                    variable = variable != null ? variable : 'ele';
                    str = `@FindBy(how = How.CLASS_NAME, using="${str}")\nprivate WebElement ${variable};\npublic void methodName(){\n`
                } else str = `driver.findElement(By.className("${str}"))`;
                break;
            case "Tag Name is unique":
                if (pom) {
                    variable = variable != null ? variable : 'ele';
                    str = `@FindBy(how = How.TAG_NAME, using="${str}")\nprivate WebElement ${variable};\npublic void methodName(){\n`
                } else str = `driver.findElement(By.tagName("${str}"))`;
                break;
            case "Link Text:":
                if (pom) {
                    variable = variable != null ? variable : 'ele';
                    str = `@FindBy(how = How.LINK_TEXT, using="${str}")\nprivate WebElement ${variable};\npublic void methodName(){\n`
                } else str = `driver.findElement(By.linkText("${str}"))`;
                break;
            case "Id is unique:":
                if (pom) {
                    variable = variable != null ? variable : 'ele';
                    str = `@FindBy(how = How.ID, using="${str}")\nprivate WebElement ${variable};\npublic void methodName(){\n`
                } else str = `driver.findElement(By.id("${str}"))`;
                break;
            case "Name is unique:":
                if (pom) {
                    variable = variable != null ? variable : 'ele';
                    str = `@FindBy(how = How.NAME, using="${str}")\nprivate WebElement ${variable};\npublic void methodName(){\n`
                } else str = `driver.findElement(By.name("${str}"))`;
                break;
            case "Partial Link Text:":
                if (pom) {
                    variable = variable != null ? variable : 'ele';
                    str = `@FindBy(how = How.PARTIAL_LINK_TEXT, using="${str}")\nprivate WebElement ${variable};\npublic void methodName(){\n`
                } else str = `driver.findElement(By.partialLinkText("${str}"))`;
                break;
            default: if (pom) {
                variable = variable != null ? variable : 'ele';
                str = `@FindBy(how = How.XPATH, using="${str}")\nprivate WebElement ${variable};\npublic void methodName(){\n`
            } else str = `driver.findElement(By.xpath("${str}"))`;
                break;
        }
        switch (snippetType) {
            case 'Code':
                snippets.style.display = 'none';
                snippets.textContent = "";
                cop.style.display = 'none';
                atrvalFrmNode.style.display = 'none'
                break;
            case 'Type':
                atrvalFrmNode.style.display = 'none'
                snippets.style.display = 'block';
                if (pom) {
                    variable = variable != null ? variable : 'ele';
                    str += `\t${typeMethodName}(${variable},str);\n//return page;\n}`
                    let mn = method;
                    mn = mn != null ? mn : 'MethodName';
                    snippets.textContent = str.replace('methodName()', `enterOn${mn}(String str)`)
                } else { snippets.textContent = str += `.sendKeys("values to send");` }
                cop.style.display = 'block';
                break;
            case 'Click':
                atrvalFrmNode.style.display = 'none'
                snippets.style.display = 'block';
                if (pom) {
                    variable = variable != null ? variable : 'ele';
                    str += `\t${clickMethodName}(${variable});\n//return page;\n}`
                    let mn = method;
                    mn = mn != null ? mn : 'MethodName';
                    snippets.textContent = str.replace('methodName', `clickOn${mn}`)
                } else {
                    snippets.textContent = str += '.click();';
                }
                cop.style.display = 'block';
                break;
            case 'Text':
                atrvalFrmNode.style.display = 'none'
                snippets.style.display = 'block';
                if (pom) {
                    variable = variable != null ? variable : 'ele';
                    str += `\t${getTextMethodName}(${variable});\n//return page;\n}`
                    let mn = method;
                    mn = mn != null ? mn : 'MethodName';
                    snippets.textContent = str.replace('methodName', `getTextOf${mn}`)
                } else {
                    variable = variable != null ? variable : 'str';
                    snippets.textContent = `String ${variable} = ${str}.getText();`
                }
                cop.style.display = 'block';
                break;
            case 'Attribute':
                snippets.style.display = 'block';
                if (pom) {
                    variable = variable != null ? variable : 'ele';
                    str += `\t${getAtrMethodName}(${variable});\n//return page;\n}`
                    let mn = method;
                    mn = mn != null ? mn : 'MethodName';
                    snippets.textContent = str.replace('methodName', `getAttributeOf${mn}`)
                } else {
                    atrvalFrmNode.style.display = 'block';
                    variable = variable != null ? variable : 'attribute';
                    snippets.textContent = `String ${variable} = ${str}.getAttribute("attribute_value");`
                    org = document.getElementById('snippet').textContent;
                }
                cop.style.display = 'block';
                break;
            case 'DD Text':
                snippets.style.display = 'block';
                variable = variable != null ? variable : 'ele';
                if (pom) {
                    str += `new Select(${variable}).selectByVisibleText(text); \n}`
                    let mn = method;
                    mn = mn != null ? mn : 'MethodName';
                    snippets.textContent = str.replace('methodName()', `select${mn} (String text)`)
                } else {
                    snippets.style.display = 'block';
                    snippets.textContent = `WebElement ${variable} = ${str}; \nnew Select(${variable}).selectByVisibleText("Text"); `
                }
                cop.style.display = 'block';
                break;
            case 'Value':
                snippets.style.display = 'block';
                variable = variable != null ? variable : 'ele';
                if (pom) {
                    str += `new Select(${variable}).selectByValue(text); \n}`
                    let mn = method;
                    mn = mn != null ? mn : 'MethodName';
                    snippets.textContent = str.replace('methodName()', `select${mn} (String text)`)
                } else {
                    snippets.style.display = 'block';
                    snippets.textContent = `WebElement ${variable} = ${str}; \nnew Select(${variable}).selectByValue("Text"); `
                }
                cop.style.display = 'block';
                break;
            case 'Index':
                snippets.style.display = 'block';
                variable = variable != null ? variable : 'ele';
                if (pom) {
                    str += `new Select(${variable}).selectByIndex(index); \n}`
                    let mn = method;
                    mn = mn != null ? mn : 'MethodName';
                    snippets.textContent = str.replace('methodName()', `select${mn} (int index)`)
                } else {
                    snippets.style.display = 'block';
                    snippets.textContent = `WebElement ${variable} = ${str}; \nnew Select(${variable}).selectByIndex(index); `
                }
                cop.style.display = 'block';
                break;
            default:
                break;
        }
        // autosize();
    } catch (error) {

    }
}
// To copy Xpath
function copy(e) {
    // find target element
    let t = e.target,
        c = t.dataset.copytarget,
        inp = (c ? document.querySelector(c) : null);
    // is element selectable?
    if (inp && inp.select) {
        // select text
        inp.select();
        try {
            // copy text
            document.execCommand('copy');
            inp.blur();
            // copied animation 
            if (t.tagName == 'IMG') {
                t.parentElement.classList.add('copied');
                setTimeout(function () { t.parentElement.classList.remove('copied'); }, 1500);
            } else {
                t.classList.add('copied');
                setTimeout(function () { t.classList.remove('copied'); }, 1500);
            }
        }
        catch (err) {
            alert('please press Ctrl/Cmd+C to copy');
        }
    }
}
// Generate Anchor based XPath based on two selection
var one = null;
var sec = null;
function generateAnchor(e) {
    let anchor = e.target;
    if (anchor.hasAttribute('class') && anchor.parentElement.parentElement.id == 'firstAnchor') {
        one = anchor.previousElementSibling.value
    } else if (anchor.parentElement.id == 'firstAnchor') {
        one = anchor.firstChild.value
    }
    if (anchor.hasAttribute('class') && anchor.parentElement.parentElement.id == 'secondAnchor') {
        sec = anchor.previousElementSibling.value
    } else if (anchor.parentElement.id == 'secondAnchor') {
        sec = anchor.firstChild.value
    }
    if (one != null && sec != null) {
        let xp = `${one}${proOrFol}${sec} `;
        let b = document.getElementById('validateAnc');
        b.setAttribute('value', xp);
        valButton.style.display = 'block'
    }
}
function showAdvance() {
    let a = document.getElementById('collapsible');
    a.classList.toggle("active");
    var content = a.nextElementSibling;
    if (content.style.display === "block") {
        content.style.display = "none";
    } else {
        content.style.display = "block";
    }
}

function makeRadioButtonAttributes(value) {
    let label = document.createElement("label");
    let radio = document.createElement("input");
    radio.type = "radio";
    radio.name = 1;
    radio.value = value;
    label.appendChild(radio);
    label.appendChild(document.createTextNode(value))
    return label;
}
// Receive
var changesInstorage = function (ch, ns) {
    if (ch.downloadData != undefined) {
        values = ch.downloadData.newValue;
        downloadFiles(values)
    }
}
chrome.storage.onChanged.addListener(changesInstorage);
function downloadFiles(values) {
    let downloadFile = "";
    let xpath = values.xpath;
    let xpathPOM = values.xpathPOM;
    if (xpath != undefined && xpath.length > 0) {
        for (let index in xpath) {
            downloadFile = downloadFile + xpath[index] + '\n'
        }
        downloadFile += '\n***********@FindBy***********\n\n';
        for (let index in xpathPOM) {
            downloadFile = downloadFile + xpathPOM[index] + '\n'
        }
        let lines = '------------------------------------';
        downloadFile += `\n${lines}\n|Generated by Ruto-XPath Finder|\n${lines}\nPage Title: ${values.title}\nPage URL: ${values.URL}`
        // if (values.frameCount >= 1) {
        //     downloadFile += `\nWARNING:\n\tThere is a Iframe or Frame in this page, please handle the frame.\nNumber of Frames: ${values.frameCount}`
        // }
        let t = saveTextInFile(downloadFile);
        filename = `RutoCode(${Date.now().toString()}).txt`;
        chrome.downloads.download({ url: t.href, filename: filename },
            function (id) {
                chrome.downloads.onChanged.addListener(function (downloadDelta) {
                    try {
                        if (downloadDelta.state.current != undefined && downloadDelta.state.current === "complete") {
                            chrome.downloads.open(id);
                            window.close();
                        }
                    } catch (error) { }
                });
            });
    }
}
function saveTextInFile(text) {
    var tempElem = document.createElement('a');
    tempElem.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    return tempElem;
}