

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

    chrome.tabs.executeScript(null, { file: 'content_probeForSG.js' });

});
