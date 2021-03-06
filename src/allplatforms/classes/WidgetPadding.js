SC.loadPackage({ 'WidgetPadding': {

    comment: 'I am the widget controlling padding of elements.',

    traits:  ['SliderWidget'],

    sharedProperties: {

        widgetMenu:  { initValue: '<div class="sg-editing-widget-container"><button id="sg-editing-widget-padding" class="sg-editing-widget-button" title="spacing"></button></div>' }

    },

    

    methods: {

    	init: { 
    		comment: 	'I init the widget.',
    		code: 		function(theSelection){

                this.delegate('Widget', 'init', theSelection);

                this.do('initSliderWidget', {

                    theSelection:   theSelection,

                    startValue:     theSelection.get('elements').length === 1
                                    ? (theSelection.get('elements')[0].get('padding') / 72)
                                    : 0,

                    setCallback:    function(sliderVal){
                                        
                                        var paddingVal = Math.round(sliderVal * 72),
                                            elements  = theSelection.get('elements'),
                                            width, height, borderWidth, appliedPaddingVal;

                                    
                                        for(var i = 0, l = elements.length; i < l; i++){

                                            borderWidth = elements[i].get('borderWidth');
                                            width       = elements[i].get('width')  - 2 * (borderWidth + elements[i].get('padding'));
                                            height      = elements[i].get('height') - 2 * (borderWidth + elements[i].get('padding'));
                                            

                                            if(     paddingVal * 2 >= borderWidth * 2 + width
                                                ||  paddingVal * 2 >= borderWidth * 2 + height
                                            ){
                                                // BUG BUG BUG BUG BUG BUG BUG BUG BUG BUG BUG BUG BUG BUG 

                                                var spaceX = Math.floor((borderWidth * 2 + width)  / 2),
                                                    spaceY = Math.floor((borderWidth * 2 + height) / 2);

                                                appliedPaddingVal = (spaceX < spaceY ? spaceX : spaceY);

                                            }else{
                                                appliedPaddingVal = paddingVal;
                                            }


                                            elements[i].set({ padding: appliedPaddingVal });
                                            elements[i].set({ 
                                                width:  elements[i].get('width'),
                                                height: elements[i].get('height')
                                            });
                                            
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
                            var savedPaddings = []
                            for(var i = 0, l = elements.length; i < l; i++){
                                savedPaddings.push(elements[i].get('padding'))
                            }
                            return function(){
                                for(var i = 0, l = elements.length; i < l; i++){
                                    elements[i].set({ padding: savedPaddings[i] });
                                    elements[i].set({ 
                                        width:  elements[i].get('width'),
                                        height: elements[i].get('height')
                                    });
                                }
                            }
                        }).call(this, this.get('selection').get('elements'));


            }
        }


    }


}});