SC.loadPackage({ 'MenuItemSaveAs': {

    comment: 'I am the MenuItem for saving the page under a different filename or even to a different domain.',

    traits:  ['MenuItem'],

    sharedProperties: {

        menuContainer:  { initValue: '<div class="sg-editing-menu-container"><button id="sg-editing-menu-saveAs" class="sg-editing-menu-button" title="save page as..."></button></div>' }

    },

    methods: {

    	init: { 
    		comment: 	'I init the MenuItem.',
    		code: 		function(theDocumentMenu){

                var self = this;

                this.delegate('MenuItem', 'init', theDocumentMenu);

                this.get('menuContainer').firstChild.addEventListener('mouseup', function(evt){
                    self.do('action');
                    theDocumentMenu.do('close');
                }, false);


    		}

    	}, 

        action: {
            comment: 'I do the job.',
            code: function(){

                SuperGlue.get('fileManager').do('saveAs', function(filePath){

                        SuperGlue.do('savePage', {
                            path: filePath
                        })

                    });

            }
        }


    }


}});