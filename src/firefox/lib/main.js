
var buttons     = require('sdk/ui/button/action'),
    tabs        = require('sdk/tabs'),
    self        = require('sdk/self'),
    pageMod     = require('sdk/page-mod'),
    iconsOn     =   {
                        '16': './icon-16-powerOn.png',
                        '32': './icon-32-powerOn.png',
                        '64': './icon-64-powerOn.png'
                    },
    iconsOff    =   {
                        '16': './icon-16-powerOff.png',
                        '32': './icon-32-powerOff.png',
                        '64': './icon-64-powerOff.png'
                    },

    workers     = [],

    powerSwitch = false;


function detachWorker(worker, workerArray) {
    var index = workerArray.indexOf(worker);
    if(index != -1) {
        workerArray.splice(index, 1);
    }
}

pageMod.PageMod({
    include:                [ '*', 'file://*' ],
    contentScriptFile:      self.data.url('content_probeForSG.js'),
    contentScriptOptions:   {'dataPath' : self.data.url('superglue-client') + '/'},
    onAttach: function(worker){

        workers.push(worker);

        worker.port.on('SuperGlue', function(request) {
            if(request.contentProbeForSG === 'isPowerOn?'){
                worker.port.emit('SuperGlue', { powerOn: powerSwitch })
            }
        });

        worker.on('detach', function () {
            detachWorker(this, workers);
        });

    }
});


var button = buttons.ActionButton({

        id:         'superglue-button',
        label:      'SuperGlue',
        icon:       iconsOff,
        onClick:    function() {

            powerSwitch = !powerSwitch;

            for(var i = 0, l = workers.length; i < l; i++){
                workers[i].port.emit('SuperGlueState', { contentProbeForSG: 'updateStatusOfSG' })
            }

            button.state(button, { icon: powerSwitch ? iconsOn : iconsOff });
            

        }
    });

