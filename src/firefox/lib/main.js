
var buttons     = require('sdk/ui/button/action'),
    tabs        = require('sdk/tabs'),
    self        = require('sdk/self'),
    pageMod     = require('sdk/page-mod'),
    clipboard   = require('sdk/clipboard'),

    workers     = [];


function detachWorker(worker, workerArray) {
    var index = workerArray.indexOf(worker);
    if(index != -1) {
        workerArray.splice(index, 1);
    }
}




var button = buttons.ActionButton({

        id:         'superglue-button',
        label:      'SuperGlue',
        icon:       {
                        "16": "./icon-16.png",
                        "32": "./icon-32.png",
                        "64": "./icon-64.png"
                    },
        onClick:    function() {

            
            var worker = tabs.activeTab.attach({
                contentScriptFile:      self.data.url("content_probeForSG.js"),
                contentScriptOptions:   { "dataPath" : self.data.url("superglue-client") + "/" }
            });

            
            workers.push(worker);

            

            worker.port.on('SuperGlueClipboard', function(message){

                if(message.action === 'copy'){
                    clipboard.set(message.value);
                }

                if(message.action === 'paste'){
                    worker.port.emit('SuperGlueClipboard', {
                        action: 'pasteResponse',
                        value:  clipboard.get()
                    })
                }

            });

            worker.on('detach', function () {
                detachWorker(this, workers);
            });


        }

    });

