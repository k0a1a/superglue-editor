SC.loadPackage({ 'MenuItemRedo': {

    comment: 'I am the MenuItem for redo.',

    traits:  ['MenuItem'],

    sharedProperties: {

        menuContainer:  { initValue: '<div class="sg-editing-menu-container"><button id="sg-editing-menu-redo" class="sg-editing-menu-button" title="redo [ctrl+y]"></button></div>' }

    },

    methods: {

    	init: { 
    		comment: 	'I init the MenuItem.',
    		code: 		function(theDocumentMenu){

                var self = this;

                this.delegate('MenuItem', 'init', theDocumentMenu);
                this.set({ isActionButton: true });

                this.get('menuButton').addEventListener('mouseup', function(){
                    self.do('action');
                }, false);


    		}

    	}, 

        action: {
            comment: 'I do the job.',
            code: function(){

                SuperGlue.get('history').do('redo');

            }
        }


    }


}});