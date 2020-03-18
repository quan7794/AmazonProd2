window.addEventListener('load', function () {
    document.body.addEventListener('click', save, true);
    try {
        chrome.storage.local.get(['pom', 'anchorSetUp'], function (pom) {
            if (pom.pom == 'true') {
                document.getElementById("pom").checked = true;
                document.getElementsByClassName("hideMe")[0].hidden = false
            } else if (pom.pom == 'false') {
                document.getElementById("pom").checked = false;
            }
            // if (pom.anchorSetUp == 'true') {
            //     document.getElementById("anchor").checked = true;
            // } else if (pom.anchorSetUp == 'false') {
            //     document.getElementById("anchor").checked = false;
            // }
        })
    } catch (error) { }
    $(document).ready(function () {
        $('#pom').change(function () {
            if (this.checked) {
                document.getElementsByClassName("hideMe")[0].hidden = false
                chrome.storage.local.set({ 'pom': 'true' }, function () {
                    show_notifications('Page Object Model Snippets are enabled')
                })
            } else {
                chrome.storage.local.set({ 'pom': 'false' }, function () {
                    document.getElementsByClassName("hideMe")[0].hidden = true
                    show_notifications('Page Object Model Snippets are disabled')
                })
            }
        });
        // $('#anchor').change(function () {
        //     if (this.checked) {
        //         chrome.storage.local.set({ 'toggleAnchorXPathMenu': 'true' }, function () {
        //             show_notifications('Anchor XPath ON')
        //         })
        //     } else {
        //         chrome.storage.local.set({ 'toggleAnchorXPathMenu': 'false' }, function () {
        //             show_notifications('Anchor XPath OFF')
        //         })
        //     }
        // });
    });
})
// saved animations
function save(e) {
    var t = e.target;
    try {
        c = t.dataset.copytarget,
            inp = (c ? document.querySelector(c) : null);
        if (inp != null) {
            t.value = 'Saved'
        }
    }
    catch (err) {
    }
}
// GETATTRIBUTE
$(function () {
    $('#getAtr').click(function () {
        var getAtr = $('#getAtrPomMethod').val();
        if (getAtr) {
            chrome.storage.local.set({ 'getAtr': getAtr }, function () {
                show_notifications(`Default getAttribute method name has been changed to ${getAtr}`)
            })
        }
    })
})
// GETTEXT
$(function () {
    $('#getText').click(function () {
        var getText = $('#getTextPomMethod').val();
        if (getText) {
            chrome.storage.local.set({ 'getText': getText }, function () {
                show_notifications(`Default getText method name has been changed to ${getText}`)
            })
        }
    })
})
// CLICK
$(function () {
    $('#click').click(function () {
        var click = $('#clickPomMethod').val();
        if (click) {
            chrome.storage.local.set({ 'click': click }, function () {
                show_notifications(`Default click method name has been changed to ${click}`)
            })
        }
    })
})
// TYPE
$(function () {
    $('#type').click(function () {
        var type = $('#typePomMethod').val();
        if (type) {
            chrome.storage.local.set({ 'type': type }, function () {
                show_notifications(`Default type method name has been changed to ${type}`)
            })
        }
    })
})
// INDEX
$(function () {
    $('#indexSave').click(function () {
        var index = $('#index').val();
        if (index) {
            chrome.storage.local.set({ 'index': index }, function () {
                show_notifications(`Max INDEX value has been changed to ${index}`)
            })
        }
    })
})
// ID
$(function () {
    $('#idSave').click(function () {
        var idNum = $('#idNum').val();
        if (idNum) {
            chrome.storage.local.set({ 'idNum': idNum }, function () {
                show_notifications(`Max ID value has been changed to ${idNum}`)
            })
        }
    })
})

function show_notifications(text) {
    var notify = {
        type: 'basic',
        iconUrl: 'logo/128.png',
        title: 'Ruto Notification',
        message: `${text}`
    }
    chrome.notifications.create('notify', notify)
}