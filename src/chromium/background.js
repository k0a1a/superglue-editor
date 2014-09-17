
var powerSwitch = false;

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.contentProbeForSG === "isPowerOn?"){
            sendResponse({ powerOn: powerSwitch });
        }   
    }
);


chrome.browserAction.onClicked.addListener(function(tab){

    powerSwitch = !powerSwitch;

    chrome.tabs.query({} ,function(tabs){
        for (var i = 0; i < tabs.length; i++) {
            chrome.tabs.executeScript(tabs[i].id, { file: 'content_probeForSG.js' });
        }
    });

    chrome.browserAction.setIcon({ path: 
        {
            '19': 'icon-19' + (powerSwitch ? '-powerOn' : '-powerOff') + '.png',
            '38': 'icon-38' + (powerSwitch ? '-powerOn' : '-powerOff') + '.png'
        }
    });

});
