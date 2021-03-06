SC.loadPackage({ 'MenuItemCenter': {

    comment: 'I am the MenuItem for switching the layout either in centered mode or in infinite space.',

    traits:  ['MenuItem'],

    sharedProperties: {

        menuContainer:  { initValue: '<div class="sg-editing-menu-container"><button id="sg-editing-menu-center" class="sg-editing-menu-button" title="centered layout / infinite layout"></button></div>' }

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

                    myDocument.set({ layout: {
                        centered: !myDocument.get('layout').centered
                    }});
                    self.do('updateMenuItem');

                    SuperGlue.get('history').do('actionHasSucceeded', createState(myDocument));
                    

                }, false);


    		}

    	},

        updateMenuItem: {
            comment: 'I update the MenuItem when the documentMenu is shown.',
            code: function(){
                this.set({ isMenuItemActive: false });

                if(SuperGlue.get('document').get('layout').centered){
                    this.get('menuContainer').firstElementChild.classList.remove('infinite');
                }else{
                    this.get('menuContainer').firstElementChild.classList.add('infinite');
                }


            }
        }


    }


}});