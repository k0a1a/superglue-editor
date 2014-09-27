SC.loadPackage({ 'WidgetImgDimensions': {

    comment: 'I am the widget controlling border styles.',

    traits:  ['Widget'],

    sharedProperties: {

        widgetMenu:  { initValue: '<div class="sg-editing-widget-container"><button id="sg-editing-widget-imgDimensions" class="sg-editing-widget-button"></button></div>' },

        widgetPanel: { initValue: '<div id="sg-editing-widget-imgDimensions-panel">'
                                        +'<div class="sg-editing-widget-panel">'
                                            +'<div class="sg-widget-triangle-up"></div>'
                                            +'<button id="sg-editing-widget-imgDimensions-stretchAspectRatio" data-superglue-imgDimensions="stretchAspectRatio" class="sg-editing-widget-button"></button>'
                                            +'<button id="sg-editing-widget-imgDimensions-stretch"            data-superglue-imgDimensions="stretch" class="sg-editing-widget-button"></button>'
                                            +'<button id="sg-editing-widget-imgDimensions-tile"               data-superglue-imgDimensions="tile" class="sg-editing-widget-button"></button>'
                                            +'<button id="sg-editing-widget-imgDimensions-tileX"              data-superglue-imgDimensions="tileX" class="sg-editing-widget-button"></button>'
                                            +'<button id="sg-editing-widget-imgDimensions-tileY"              data-superglue-imgDimensions="tileY" class="sg-editing-widget-button"></button>'
                                            +'<button id="sg-editing-widget-imgDimensions-aspectRatio"        data-superglue-imgDimensions="aspectRatio" class="sg-editing-widget-button"></button>'
                                        +'</div>'
                                    +'</div>' 
                     }

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
                    widgetPanel = (new DOMParser()).parseFromString(this.class.get('widgetPanel'), 'text/html').body.firstChild,
                
                    onMouseUp = function(evt){

                        var newDim   = this.getAttribute('data-superglue-imgDimensions'),
                            elements = theSelection.get('elements');

                        for(var i = 0, l = elements.length; i < l; i++){
                            elements[i].set({ dimensions: newDim });
                        }

                        self.set({ aValueWasChoosen: true });

                        evt.stopPropagation()

                    },

                    buttons = widgetPanel.querySelectorAll('.sg-editing-widget-button');


                for(var i = buttons.length - 1; i >= 0; i--){
                    buttons[i].addEventListener('mouseup', onMouseUp, false)
                }
                


                this.set({ 
                    widgetPanel: widgetPanel
                });


    		}

    	},


        createState: {
            comment: 'I create a reflection function to restore a state.',
            code: function(){

                return  (function(elements){
                            var savedImgState = []
                            for(var i = 0, l = elements.length; i < l; i++){
                                savedImgState.push(elements[i].get('node').innerHTML)
                            }
                            return function(){
                                for(var i = 0, l = elements.length; i < l; i++){
                                    elements[i].get('node').innerHTML = savedImgState[i]
                                }
                            }
                        }).call(this, this.get('selection').get('elements'));


            }

        }


    }


}});