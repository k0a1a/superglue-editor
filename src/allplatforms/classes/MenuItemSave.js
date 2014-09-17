SC.loadPackage({ 'MenuItemSave': {

    comment: 'I am the MenuItem for saving the page.',

    traits:  ['MenuItem'],

    sharedProperties: {

        menuContainer:  { initValue: '<div class="sg-editing-menu-container"><button id="sg-editing-menu-save" class="sg-editing-menu-button"></button></div>' }

    },

    methods: {

    	init: { 
    		comment: 	'I init the MenuItem.',
    		code: 		function(theDocumentMenu){

                this.delegate('MenuItem', 'init', theDocumentMenu);
                this.set({ isActionButton: true });

                this.get('menuContainer').firstChild.addEventListener('mouseup', function(evt){

                    SuperGlue.do('savePage', {
                        path: document.location.pathname
                    });

                    theDocumentMenu.do('close');

                }, false);


    		}

    	}


    }


}});