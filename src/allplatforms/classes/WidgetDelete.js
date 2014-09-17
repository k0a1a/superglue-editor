SC.loadPackage({ 'WidgetDelete': {

    comment: 'I am the delete widget.',

    traits:  ['Widget'],

    sharedProperties: {

        widgetMenu:  { initValue: '<div class="sg-editing-widget-container"><button id="sg-editing-widget-delete" class="sg-editing-widget-button"></button></div>' }

    },

    methods: {

    	init: { 
    		comment: 	'I init the widget.',
    		code: 		function(theSelection){

                this.delegate('Widget', 'init', theSelection);
                this.set({ isActionButton: true });

                var self = this;

                this.get('widgetButton').addEventListener('mouseup', function(evt){

                    self.set({ isWidgetActive: false });


                    var elements = self.get('selection').get('elements').slice();
                    self.get('selection').do('clearAll');

                    for(var i = 0, l = elements.length; i < l; i++){
                        
                        SuperGlue.get('document').do('removeElement', elements[i]);

                    }



                }, false);


    		}

    	}


    }


}});