SC.loadPackage({ 'WidgetImgSrc': {

    comment: 'I am the widget controlling the image source of an ImageElement.',

    traits:  ['Widget'],

    sharedProperties: {

        widgetMenu:  { initValue: '<div class="sg-editing-widget-container"><button id="sg-editing-widget-imgSrc" class="sg-editing-widget-button"></button></div>' },

        widgetPanel: { initValue:   '<div id="sg-editing-widget-imgSrc-panel">'
                                        +'<div class="sg-editing-widget-panel">'
                                            +'<div class="sg-widget-triangle-up"></div>'
                                            +'<input  id="sg-editing-widget-imgSrc-input" type="text"></input>'
                                            +'<button id="sg-editing-widget-imgSrc-chooseFile" class="sg-editing-widget-button"></button>'
                                            +'<button id="sg-editing-widget-imgSrc-clear" class="sg-editing-widget-button"></button>'
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

                                    var elements = this.get('selection').get('elements');
                                        
                                    if(elements.length === 1){
                                        this.get('widgetPanel').querySelector('#sg-editing-widget-imgSrc-input').value = elements[0].get('imgSource');
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
                


                widgetPanel.querySelector('#sg-editing-widget-imgSrc-input').addEventListener('mouseup', function(evt){
                    theSelection.set({ activeWidget: self });
                    evt.stopPropagation();
                }, false);

                widgetPanel.querySelector('#sg-editing-widget-imgSrc-input').addEventListener('input', function(evt){
                    self.do('setImgSrc', this.value)
                }, false);

                widgetPanel.querySelector('#sg-editing-widget-imgSrc-chooseFile').addEventListener('mouseup', function(evt){
                    theSelection.set({ activeWidget: self });
                    evt.stopPropagation();


                    var pathParser = document.createElement('a');
                    pathParser.href = widgetPanel.querySelector('#sg-editing-widget-imgSrc-input').value;

                    SuperGlue.get('fileManager').do('chooseFile', {
                        oldPath:  pathParser.pathname,
                        callback: function(srcPath){
                                        widgetPanel.querySelector('#sg-editing-widget-imgSrc-input').value = srcPath;
                                        self.do('setImgSrc', srcPath);
                                    }
                    });
                }, false);

                widgetPanel.querySelector('#sg-editing-widget-imgSrc-clear').addEventListener('mouseup', function(evt){
                    theSelection.set({ activeWidget: self });
                    evt.stopPropagation();

                    widgetPanel.querySelector('#sg-editing-widget-imgSrc-input').value = '';
                    self.do('setImgSrc', '');
                }, false);


                this.set({ 
                    widgetPanel: widgetPanel
                });


    		}

    	},

        setImgSrc: {
            comment: 'I set the source of the imgElement',
            code: function(srcURL){

                var elements     = this.get('selection').get('elements'),
                    contentNode, imgElement;

                for(var i = 0, l = elements.length; i < l; i++){

                    elements[i].set({ imgSource: srcURL });


                }

                this.set({ aValueWasChoosen: true });

            }
        },


        createState: {
            comment: 'I create a reflection function to restore a state.',
            code: function(){

                return  (function(elements){
                            var savedImgSrc = []
                            for(var i = 0, l = elements.length; i < l; i++){
                                savedImgSrc.push(elements[i].get('imgSource'))
                            }
                            return function(){
                                for(var i = 0, l = elements.length; i < l; i++){
                                    elements[i].set({ imgSource: savedImgSrc[i] }) 
                                }
                            }
                        }).call(this, this.get('selection').get('elements'));


            }

        }


    }


}});