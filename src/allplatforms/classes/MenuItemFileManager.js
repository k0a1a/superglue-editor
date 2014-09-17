SC.loadPackage({ 'MenuItemFileManager': {

    comment: 'I am the MenuItem invoking the FileManger.',

    traits:  ['MenuItem'],

    sharedProperties: {

        menuContainer:  { initValue: '<div class="sg-editing-menu-container"><button id="sg-editing-menu-fileManager" class="sg-editing-menu-button"></button></div>' }

    },

    methods: {

    	init: { 
    		comment: 	'I init the MenuItem.',
    		code: 		function(theDocumentMenu){

                this.delegate('MenuItem', 'init', theDocumentMenu);
                this.set({ isActionButton: true });
                
                this.get('menuContainer').firstChild.addEventListener('mouseup', function(evt){

                    SuperGlue.get('fileManager').do('open')

                    theDocumentMenu.do('close');

                }, false);


    		}

    	}


    }


}});