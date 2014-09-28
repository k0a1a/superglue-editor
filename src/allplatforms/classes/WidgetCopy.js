SC.loadPackage({ 'WidgetCopy': {

    comment: 'I am the copy widget.',

    traits:  ['Widget'],

    sharedProperties: {

        widgetMenu:  { initValue: '<div class="sg-editing-widget-container"><button id="sg-editing-widget-copy" class="sg-editing-widget-button"></button></div>' }

    },

    methods: {

    	init: { 
    		comment: 	'I init the widget.',
    		code: 		function(theSelection){

                this.delegate('Widget', 'init', theSelection);
                this.set({ isActionButton: true });

                var self = this;

                this.get('widgetButton').addEventListener('mouseup', function(){

                    self.do('action');

                }, false)


    		}

    	}, 

        action: {
            comment: 'I do the job.',
            code: function(){

                var elements   = SuperGlue.get('selection').get('elements'),
                    copyString = '';

                for(var i = 0, l = elements.length; i < l; i++){

                    copyString += elements[i].do('renderYourself', { indent: 1 }) + '\n';

                }

                SuperGlue.get('clipboard').do('copy', copyString);

            }
        }


    }


}});