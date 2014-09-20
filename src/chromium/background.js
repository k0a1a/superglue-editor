
var powerSwitch = false;



chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {

        if(request.contentProbeForSG === "isPowerOn?"){
            sendResponse({ powerOn: powerSwitch });
        }

        if(request.action === 'copy'){

            var input = document.createElement('textarea');
            document.body.appendChild(input);
            input.value = request.value;
            input.focus();
            input.select();
            document.execCommand('copy');
            input.remove();

        }

        if(request.action === 'paste'){

            var input = document.createElement('textarea');
            document.body.appendChild(input);
            input.value = request.value;
            input.focus();
            input.select();
            document.execCommand('paste');
            sendResponse({
                action: 'pasteResponse',
                value:  input.value
            });
            input.remove();
            
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
