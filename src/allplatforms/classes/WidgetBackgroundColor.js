SC.loadPackage({ 'WidgetBackgroundColor': {

    comment: 'I am the background color widget.',

    traits:  ['ColorPickerWidget'],

    sharedProperties: {

        widgetMenu:  { initValue: '<div class="sg-editing-widget-container"><button id="sg-editing-widget-backgroundColor" class="sg-editing-widget-button"></button></div>' }

    },

    methods: {

    	init: { 
    		comment: 	'I init the widget.',
    		code: 		function(theSelection){

                this.delegate('Widget', 'init', theSelection);


                var initialColor = theSelection.get('elements')[0].get('node').style.backgroundColor,
                    pickerLoad   = true;

                this.do('initColorPickerWidget', {

                    theSelection: theSelection,

                    initialColor: initialColor,

                    setCallback: function(colorCode){

                        if(pickerLoad){
                            return pickerLoad = false;
                        }

                        var elements = theSelection.get('elements')

                        for(var i = 0, l = elements.length; i < l; i++){

                            elements[i].get('node').style.backgroundColor = colorCode;

                        }

                    }


                });




    		}

    	}


    }


}});