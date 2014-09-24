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

                this.delegate('MenuItem', 'init', theDocumentMenu);
                this.set({ isActionButton: true });

                this.get('menuButton').addEventListener('mouseup', function(){
                    SuperGlue.get('history').do('undo');
                }, false);

    		}

    	}


    }


}});