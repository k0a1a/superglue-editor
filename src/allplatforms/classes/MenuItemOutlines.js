SC.loadPackage({ 'MenuItemOutlines': {

    comment: 'I am the MenuItem for switching the outlines on and off.',

    traits:  ['MenuItem'],

    sharedProperties: {

        menuContainer:  { initValue: '<div class="sg-editing-menu-container"><button id="sg-editing-menu-outlines" class="sg-editing-menu-button"></button></div>' }

    },

    methods: {

    	init: { 
    		comment: 	'I init the MenuItem.',
    		code: 		function(theDocumentMenu){

                this.delegate('MenuItem', 'init', theDocumentMenu);
                this.set({ isActionButton: true });

                var self = this;
                
                this.get('menuContainer').firstChild.addEventListener('mouseup', function(evt){

                    var myDocument = SuperGlue.get('document');
                    myDocument.set({ 
                        
                        showOutlines: (! myDocument.get('showOutlines'))

                    });

                    self.do('updateMenuItem');

                }, false);


    		}

    	},

        updateMenuItem: {
            comment: 'I update the MenuItem when the documentMenu is shown.',
            code: function(){
                this.set({ isMenuItemActive: false });

                if(SuperGlue.get('document').get('showOutlines')){
                    this.get('menuContainer').firstElementChild.classList.add('hideOutlines');
                }else{
                    this.get('menuContainer').firstElementChild.classList.remove('hideOutlines');
                }


            }
        }


    }


}});