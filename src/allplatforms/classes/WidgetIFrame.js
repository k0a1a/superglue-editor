SC.loadPackage({ 'WidgetIFrame': {

    comment: 'I am the widget controlling an IFrame element.',

    traits:  ['Widget'],

    sharedProperties: {

        widgetMenu:  { initValue: '<div class="sg-editing-widget-container"><button id="sg-editing-widget-iframe" class="sg-editing-widget-button" title="URL"></button></div>' },

        widgetPanel: { initValue:   '<div id="sg-editing-widget-iframe-panel">'
                                        +'<div class="sg-editing-widget-panel">'
                                            +'<div class="sg-widget-triangle-up"></div>'
                                            +'<input  id="sg-editing-widget-iframe-input" type="text"></input>'
                                            +'<button id="sg-editing-widget-iframe-chooseFile" class="sg-editing-widget-button"></button>'
                                            +'<button id="sg-editing-widget-iframe-clear" class="sg-editing-widget-button"></button>'
                                        +'</div>'
                                    +'</div>' }

    },

    properties: {

        widgetPanel:    { comment: 'I store the DOMElement containing the panel of controls of the widget.' },

        isWidgetActive: { comment: 'Wether the widget is active.',
                          transform: function(aBoolean){

                                if(aBoolean){

                                    if(this.get('widgetPanel').parentNode !== this.get('widgetMenu')){
                                        this.get('widgetMenu').appendChild(this.get('widgetPanel'));
                                    }
                                    this.get('widgetMenu').classList.add('active');

                                    var elements = this.get('selection').get('elements')
                                    if(elements.length === 1){
                                        this.get('widgetPanel').querySelector('#sg-editing-widget-iframe-input').value = (
                                            elements[0].get('contentNode').firstElementChild.getAttribute('src')
                                        );
                                    }

                                    // prepare undo
                                    this.set({ aValueWasChoosen: false });
                                    SuperGlue.get('history').do('actionHasStarted', this.do('createState'));

                                }else{

                                    if(this.get('widgetPanel').parentNode === this.get('widgetMenu')){
                                        this.get('widgetMenu').removeChild(this.get('widgetPanel'));
                                    }
                                    this.get('widgetMenu').classList.remove('active');

                                    // finish undo
                                    if(this.get('aValueWasChoosen')){
                                        SuperGlue.get('history').do('actionHasSucceeded', this.do('createState'));
                                    }
                                    this.set({ aValueWasChoosen: false })
                                
                                }
                                return aBoolean
                          }
                        },

        aValueWasChoosen: { comment: 'Wether a value was choosen (needed for undo).' }

    },

    methods: {

    	init: { 
    		comment: 	'I init the widget.',
    		code: 		function(theSelection){

                this.delegate('Widget', 'init', theSelection);


                var self = this,
                    widgetPanel = (new DOMParser()).parseFromString(this.class.get('widgetPanel'), 'text/html').body.firstChild;
                


                widgetPanel.querySelector('#sg-editing-widget-iframe-input').addEventListener('mouseup', function(evt){
                    theSelection.set({ activeWidget: self });
                    evt.stopPropagation();
                }, false);

                widgetPanel.querySelector('#sg-editing-widget-iframe-input').addEventListener('input', function(evt){
                    self.do('setIFrameSrc', this.value)
                }, false);

                widgetPanel.querySelector('#sg-editing-widget-iframe-chooseFile').addEventListener('mouseup', function(evt){
                    theSelection.set({ activeWidget: self });
                    evt.stopPropagation();

                    var pathParser = document.createElement('a');
                    pathParser.href = widgetPanel.querySelector('#sg-editing-widget-iframe-input').value;

                    SuperGlue.get('fileManager').do('chooseFile', {
                        oldPath:  pathParser.pathname,
                        callback: function(srcPath){
                                        widgetPanel.querySelector('#sg-editing-widget-iframe-input').value = srcPath;
                                        self.do('setIFrameSrc', srcPath);
                                    }
                    });
                }, false);

                widgetPanel.querySelector('#sg-editing-widget-iframe-clear').addEventListener('mouseup', function(evt){
                    theSelection.set({ activeWidget: self });
                    evt.stopPropagation();

                    widgetPanel.querySelector('#sg-editing-widget-iframe-input').value = '';
                    self.do('setIFrameSrc', '');
                }, false);


                this.set({ 
                    widgetPanel: widgetPanel
                });



    		}

    	},

        setIFrameSrc: {
            comment: 'I set the src for an iFrameElement.',
            code: function(srcURL){

                var elements     = this.get('selection').get('elements');

                for(var i = 0, l = elements.length; i < l; i++){

                    elements[i].get('contentNode').firstElementChild.src = srcURL;

                }

                this.set({ aValueWasChoosen: true });


            }
        },


        createState: {
            comment: 'I create a reflection function to restore a state.',
            code: function(){

                return  (function(elements){
                            var savedIFrameSrc = []
                            for(var i = 0, l = elements.length; i < l; i++){
                                savedIFrameSrc.push(elements[i].get('node').firstElementChild.src)
                            }
                            return function(){
                                for(var i = 0, l = elements.length; i < l; i++){
                                    elements[i].get('node').firstElementChild.src = savedIFrameSrc[i]
                                }
                            }
                        }).call(this, this.get('selection').get('elements'));


            }

        }



    }


}});