SC.loadPackage({ 'MenuItemServerSettings': {

    comment: 'I am the MenuItem which opens a new tab for the server settings.',

    traits:  ['MenuItem'],

    sharedProperties: {

        menuContainer:  { initValue: '<div class="sg-editing-menu-container"><button id="sg-editing-menu-serverSettings" class="sg-editing-menu-button"></button></div>' }

    },

    methods: {

    	init: { 
    		comment: 	'I init the MenuItem.',
    		code: 		function(theDocumentMenu){

                this.delegate('MenuItem', 'init', theDocumentMenu);
                this.set({ isActionButton: true });
                
                this.get('menuContainer').firstChild.addEventListener('mouseup', function(evt){

                    if(document.location.host){

                        window.open(SuperGlue.get('server').get('origin') + '/admin', '_blank');

                    }else{

                        alert('You are not working on a SuperGlue server.');

                    }
                    

                    theDocumentMenu.do('close');

                }, false);


    		}

    	}


    }


}});