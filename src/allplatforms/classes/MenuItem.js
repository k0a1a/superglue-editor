SC.loadPackage({ 'MenuItem': {

    comment: 'I am the abstract base class of all MenuItems. Subclasses must include me as a trait, and call the init method of this class. Every Subclass must have a shared property called menuContainer, which contains as a string the html of its menuContainer.',


    properties: {

        menuContainer:  { comment: 'I store the DOMElement containing my menuContainer.' },
        menuButton:     { comment: 'I store the DOMElement containing my menuButton.' },

        documentMenu:   { comment: 'I hold a reference to the documentMenu.' },

        isActionButton:     { comment: 'An action button does not stay active after being clicked. I should be set during mySubclass>>init' },
        isMenuItemActive:   { comment: 'Wether the menuItem is active. Transform function can be overriden by my subclasses to show e.g. a panel.',
                              transform: function(aBoolean){
                                    if(aBoolean){
                                        this.get('menuContainer').classList.add('active');
                                    }else{
                                        this.get('menuContainer').classList.remove('active');
                                    }
                                    return aBoolean
                              }
                            }

    },

    methods: {

    	init: { 
    		comment: 	'I init a menuItem, therefor all my subclasses must call me via this.delegate(\'MenuItem\', \'init\', theDocumentMenu).',
    		code: 		function(theDocumentMenu){

                var self = this,
                    menuContainer = (new DOMParser()).parseFromString(this.class.get('menuContainer'), 'text/html').body.firstChild;

                menuContainer.addEventListener('mouseenter', function(evt){

                    if(theDocumentMenu.get('activeMenuItem') === null){
                        self.set({ isMenuItemActive: true });
                    }

                    evt.stopPropagation();

                }, false);

                menuContainer.addEventListener('mouseleave', function(evt){

                    if(theDocumentMenu.get('activeMenuItem') !== self){
                        self.set({ isMenuItemActive: false });
                    }

                    evt.stopPropagation();

                }, false);
                

                menuContainer.addEventListener('mouseup', function(evt){

                    var activeMenuItem = theDocumentMenu.get('activeMenuItem');
                    if(activeMenuItem === self){
                        theDocumentMenu.set({ activeMenuItem:   null });
                    }else if(activeMenuItem === null){
                        theDocumentMenu.set({ activeMenuItem: self });
                    }else{
                        theDocumentMenu.set({ activeMenuItem: self });
                        activeMenuItem.set({ isMenuItemActive: false });
                                  self.set({ isMenuItemActive: true  });
                    }

                    
                }, true);

                menuContainer.addEventListener('mouseup', function(evt){
                    if(self.get('isActionButton')){
                        theDocumentMenu.set({ activeMenuItem:   null  });
                                   self.set({ isMenuItemActive: false });
                    }
                }, false);


                menuContainer.addEventListener('mousedown', function(evt){
                    evt.stopPropagation();
                }, false);


                this.set({
                    menuContainer:  menuContainer,
                    menuButton:     menuContainer.firstElementChild,
                    isActionButton: false,
                    documentMenu:   theDocumentMenu
                });



    		}

    	}


    }


}});