SC.loadPackage({ 'WidgetOpacity': {

    comment: 'I am the widget controlling the opacity of elements.',

    traits:  ['SliderWidget'],

    sharedProperties: {

        widgetMenu:  { initValue: '<div class="sg-editing-widget-container"><button id="sg-editing-widget-opacity" class="sg-editing-widget-button"></button></div>' }

    },

    methods: {

    	init: { 
    		comment: 	'I init the widget.',
    		code: 		function(theSelection){

                this.delegate('Widget', 'init', theSelection);

                var startOpacity = parseFloat(theSelection.get('elements')[0].get('contentNode').style.opacity);
                    startOpacity = theSelection.get('elements').length === 1
                                    ? isNaN(startOpacity) ? 1 : startOpacity
                                    : 1;
                
                this.do('initSliderWidget', {

                    theSelection:   theSelection,

                    startValue:     (1 - startOpacity),

                    setCallback:    function(sliderVal){
                                        
                                        var opacityVal = 1 - sliderVal,
                                            elements  = theSelection.get('elements');

                                        if(opacityVal === 1){

                                            for(var i = 0, l = elements.length; i < l; i++){
                                                elements[i].get('contentNode').style.opacity = '';
                                            }

                                        }else{

                                            for(var i = 0, l = elements.length; i < l; i++){
                                                elements[i].get('contentNode').style.opacity = opacityVal;
                                            }

                                        }
                                        

                                    

                                    }
                });


    		}

    	}


    }


}});