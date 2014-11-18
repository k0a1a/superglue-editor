SC.loadPackage({ 'MenuItemEditCSS': {

    comment: 'I am the MenuItem for editing costum CSS in the page\'s head.',

    traits:  ['MenuItem'],

    sharedProperties: {

        menuContainer:  { initValue: '<div class="sg-editing-menu-container"><button id="sg-editing-menu-editCSS" class="sg-editing-menu-button" title="edit costum CSS"></button></div>' }

    },

    methods: {

    	init: { 
    		comment: 	'I init the MenuItem.',
    		code: 		function(theDocumentMenu){

                this.delegate('MenuItem', 'init', theDocumentMenu);
                this.set({ isActionButton: true });

                var self = this;
                
                this.get('menuContainer').firstChild.addEventListener('mouseup', function(evt){

                    var myDocument  = SuperGlue.get('document'),
                        createState = function(myDocument){
                                            var savedLayout = myDocument.get('layout');
                                            return function(){
                                                myDocument.set({ layout: savedLayout });
                                            }
                                        };

                    SuperGlue.get('history').do('actionHasStarted', createState(myDocument));

                    

                    
                    
                    SuperGlue.get('history').do('actionHasSucceeded', createState(myDocument));
                    

                }, false);


    		}

    	}


    }


}});