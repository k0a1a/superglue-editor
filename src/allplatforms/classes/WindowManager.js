SC.loadPackage({ 'WindowManager': {

    comment: 'I am the WindowManager which organizes the editing interface in the 2nd level.',


    properties: {

        windowsContainer:   { comment: 'I hold the DOM node which contains the windows.' },
        windows:            { comment: 'I hold an map of id-->references to my window DOM nodes.' }

    },

    methods: {

    	init: { 
    		comment: 	'I init the WindowManager.',
    		code: 		function(){

                var self = this;

                this.set({  
                    
                    windows:            [],

                    windowsContainer:   (function(){
                                            var windowsContainer = document.createElement('div');
                                            windowsContainer.setAttribute('id', 'sg-editing-windows-container');
                                            document.body.appendChild(windowsContainer);
                                            return windowsContainer;
                                        }).call(this)
                });

                window.addEventListener('resize', function(){
                    var windows = self.get('windows'); 
                    for(var i in windows){
                        windows[i].set({
                            top:    windows[i].get('top'),
                            left:   windows[i].get('left'),
                            width:  windows[i].get('width'),
                            height: windows[i].get('height')
                        });
                    }
                }, false)


    		}
    	},

        createWindow: {
            comment:    'I create a Window according to the windowConfig object: '+
                        '{ class: aWindowClass, top: anInt, left: anInt, width: anInt, height: anInt }',
            code: function(windowConfig){

                var self      = this,
                    newWindow = SC.init(windowConfig.class, windowConfig),

                    windowsContainer = this.get('windowsContainer');


                newWindow.get('node').addEventListener('mousedown', function(evt){
                    if(windowsContainer.lastElementChild !== newWindow.get('node')){
                        windowsContainer.appendChild(newWindow.get('node'));
                    }
                }, false);


                windowsContainer.appendChild(newWindow.get('node'));

                this.get('windows').push(newWindow);

                return newWindow;

            }
        },

        closeWindow: {
            comment: 'I close a given window',
            code: function(aWindow){

                var windows = this.get('windows');
                windows.splice(windows.indexOf(aWindow), 1);

                this.get('windowsContainer').removeChild(aWindow.get('node'));



            }
        }



    }


}});