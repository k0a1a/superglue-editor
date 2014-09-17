SC.loadPackage({ 'MenuItemRedo': {

    comment: 'I am the MenuItem for redo.',

    traits:  ['MenuItem'],

    sharedProperties: {

        menuContainer:  { initValue: '<div class="sg-editing-menu-container"><button id="sg-editing-menu-redo" class="sg-editing-menu-button"></button></div>' }

    },

    methods: {

    	init: { 
    		comment: 	'I init the MenuItem.',
    		code: 		function(theDocumentMenu){

                this.delegate('MenuItem', 'init', theDocumentMenu);
                this.set({ isActionButton: true });




    		}

    	}


    }


}});