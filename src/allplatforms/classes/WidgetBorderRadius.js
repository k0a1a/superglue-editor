SC.loadPackage({ 'WidgetBorderRadius': {

    comment: 'I am the widget controlling border radius.',

    traits:  ['SliderWidget'],

    sharedProperties: {

        widgetMenu:  { initValue: '<div class="sg-editing-widget-container"><button id="sg-editing-widget-borderRadius" class="sg-editing-widget-button"></button></div>' }

    },

    methods: {

    	init: { 
    		comment: 	'I init the widget.',
    		code: 		function(theSelection){

                this.delegate('Widget', 'init', theSelection);

                var startBorderRadius = parseInt(theSelection.get('elements')[0].get('contentNode').style.borderRadius);
                    startBorderRadius = theSelection.get('elements').length === 1
                                        ? isNaN(startBorderRadius) ? 0 : startBorderRadius
                                        : 0;
                
                this.do('initSliderWidget', {

                    theSelection:   theSelection,

                    startValue:     (startBorderRadius / 50),

                    setCallback:    function(sliderVal){
                                        
                                        var borderRadiusVal = Math.round(sliderVal * 50),
                                            elements  = theSelection.get('elements');

                                        if(borderRadiusVal === 0){

                                            for(var i = 0, l = elements.length; i < l; i++){
                                                elements[i].get('contentNode').style.borderRadius = '';
                                            }

                                        }else{

                                            for(var i = 0, l = elements.length; i < l; i++){
                                                elements[i].get('contentNode').style.borderRadius = borderRadiusVal + '%';
                                            }

                                        }

                                        this.set({ aValueWasChoosen: true });

                                    }
                });


    		}

    	},


        createState: {
            comment: 'I create a reflection function to restore a state.',
            code: function(){

                return  (function(elements){
                            var savedBorderRadii = []
                            for(var i = 0, l = elements.length; i < l; i++){
                                savedBorderRadii.push(elements[i].get('node').style.borderRadius)
                            }
                            return function(){
                                for(var i = 0, l = elements.length; i < l; i++){
                                    elements[i].get('node').style.borderRadius = savedBorderRadii[i]
                                }
                            }
                        }).call(this, this.get('selection').get('elements'));


            }

        }

    }


}});