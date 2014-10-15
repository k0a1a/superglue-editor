SC.loadPackage({ 'MenuItemSave': {

    comment: 'I am the MenuItem for saving the page.',

    traits:  ['MenuItem'],

    sharedProperties: {

        menuContainer:  { initValue: '<div class="sg-editing-menu-container"><button id="sg-editing-menu-save" class="sg-editing-menu-button" title="save page [ctrl+s]"></button></div>' }

    },

    methods: {

    	init: { 
    		comment: 	'I init the MenuItem.',
    		code: 		function(theDocumentMenu){

                var self = this;

                this.delegate('MenuItem', 'init', theDocumentMenu);
                this.set({ isActionButton: true });

                this.get('menuContainer').firstChild.addEventListener('mouseup', function(evt){
                    self.do('action');
                    theDocumentMenu.do('close');
                }, false);


    		}

    	}, 

        action: {
            comment: 'I do the job.',
            code: function(){

                SuperGlue.do('savePage', {
                        path: document.location.pathname
                    });

            }
        }


    }


}});