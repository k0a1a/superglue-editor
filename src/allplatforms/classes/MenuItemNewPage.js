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

                SuperGlue.get('fileManager').do('newPage');

            }
        }


    }


}});