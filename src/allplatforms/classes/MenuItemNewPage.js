SC.loadPackage({ 'MenuItemNewPage': {

    comment: 'I am the MenuItem invoking the FileManger with context newPage.',

    traits:  ['MenuItem'],

    sharedProperties: {

        menuContainer:  { initValue: '<div class="sg-editing-menu-container"><button id="sg-editing-menu-newPage" class="sg-editing-menu-button"></button></div>' }

    },

    methods: {

    	init: { 
    		comment: 	'I init the MenuItem.',
    		code: 		function(theDocumentMenu){

                this.delegate('MenuItem', 'init', theDocumentMenu);
                this.set({ isActionButton: true });
                
                this.get('menuContainer').firstChild.addEventListener('mouseup', function(evt){

                    SuperGlue.get('fileManager').do('newPage')

                    theDocumentMenu.do('close');

                }, false);


    		}

    	}


    }


}});