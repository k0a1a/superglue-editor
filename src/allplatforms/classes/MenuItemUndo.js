SC.loadPackage({ 'MenuItemUndo': {

    comment: 'I am the MenuItem for Undo.',

    traits:  ['MenuItem'],

    sharedProperties: {

        menuContainer:  { initValue: '<div class="sg-editing-menu-container"><button id="sg-editing-menu-undo" class="sg-editing-menu-button"></button></div>' }

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

                SuperGlue.get('history').do('undo');

            }
        }


    }


}});