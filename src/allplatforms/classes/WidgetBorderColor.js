SC.loadPackage({ 'WidgetBorderColor': {

    comment: 'I am the widget controlling border color.',

    traits:  ['ColorPickerWidget'],

    sharedProperties: {

        widgetMenu:  { initValue: '<div class="sg-editing-widget-container"><button id="sg-editing-widget-borderColor" class="sg-editing-widget-button" title="border color"></button></div>' }

    },



    methods: {

    	init: { 
    		comment: 	'I init the widget.',
    		code: 		function(theSelection){

                this.delegate('Widget', 'init', theSelection);

                var initialColor = theSelection.get('elements')[0].get('borderColor'),
                    pickerLoad   = true,
                    self = this;


                this.do('initColorPickerWidget', {

                    theSelection: theSelection,

                    initialColor: initialColor,

                    setCallback: function(colorCode){

                        if(pickerLoad){
                            return pickerLoad = false;
                        }

                        var elements = theSelection.get('elements');

                        for(var i = 0, l = elements.length; i < l; i++){

                            elements[i].set({ borderColor: colorCode });

                        }

                        self.set({ aColorWasChoosen: true });

                    }


                })               


    		}

    	},


        createState: {
            comment: 'I create a reflection function to restore a state.',
            code: function(){

                return  (function(elements){
                            var savedColors = []
                            for(var i = 0, l = elements.length; i < l; i++){
                                savedColors.push(elements[i].get('borderColor'));
                            }
                            return function(){
                                for(var i = 0, l = elements.length; i < l; i++){
                                    elements[i].set({ borderColor: savedColors[i] });
                                }
                            }
                        }).call(this, this.get('selection').get('elements'));


            }
        }



    }


}});