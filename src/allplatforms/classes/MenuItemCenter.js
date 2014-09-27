SC.loadPackage({ 'MenuItemCenter': {

    comment: 'I am the MenuItem for switching the layout either in centered mode or in infinite space.',

    traits:  ['MenuItem'],

    sharedProperties: {

        menuContainer:  { initValue: '<div class="sg-editing-menu-container"><button id="sg-editing-menu-center" class="sg-editing-menu-button"></button></div>' }

    },

    methods: {

    	init: { 
    		comment: 	'I init the MenuItem.',
    		code: 		function(theDocumentMenu){

                this.delegate('MenuItem', 'init', theDocumentMenu);
                this.set({ isActionButton: true });
                
                this.get('menuContainer').firstChild.addEventListener('mouseup', function(evt){

                    var myDocument  = SuperGlue.get('document'),
                        createState = function(myDocument){
                                            var savedLayout = myDocument.get('layout');
                                            return function(){
                                                myDocument.set({ layout: savedLayout });
                                            }
                                        };

                    SuperGlue.get('history').do('actionHasStarted', createState(myDocument));

                    myDocument.set({ layout: {
                        centered: !myDocument.get('layout').centered
                    }});

                    SuperGlue.get('history').do('actionHasSucceeded', createState(myDocument));
                    

                }, false);


    		}

    	}


    }


}});