SC.loadPackage({ 'WidgetBorder': {

    comment: 'I am the widget controlling border styles.',

    traits:  ['SliderWidget'],

    sharedProperties: {

        widgetMenu:  { initValue: '<div class="sg-editing-widget-container"><button id="sg-editing-widget-border" class="sg-editing-widget-button" title="border width"></button></div>' }

    },

    

    methods: {

        init: { 
            comment:    'I init the widget.',
            code:       function(theSelection){

                this.delegate('Widget', 'init', theSelection);

                
                this.do('initSliderWidget', {

                    theSelection:   theSelection,

                    startValue:     theSelection.get('elements').length === 1
                                    ? (theSelection.get('elements')[0].get('borderWidth') / 24)
                                    : 0,

                    setCallback:    function(sliderVal){
                                        
                                        var borderVal = Math.round(sliderVal * 24),
                                            elements  = theSelection.get('elements');
                                    
                                        for(var i = 0, l = elements.length; i < l; i++){

                                            if(borderVal !== 0 && !elements[i].get('borderColor')){
                                                elements[i].set({ borderColor: '#000000' });
                                            }
                                            elements[i].set({ borderWidth: borderVal });
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
                            var savedBorders = []
                            for(var i = 0, l = elements.length; i < l; i++){
                                savedBorders.push({
                                    borderColor: elements[i].get('borderColor'),
                                    borderWidth: elements[i].get('borderWidth')
                                })
                            }
                            return function(){
                                for(var i = 0, l = elements.length; i < l; i++){
                                    elements[i].set({
                                        borderColor: savedBorders[i].borderColor,
                                        borderWidth: savedBorders[i].borderWidth
                                    });
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