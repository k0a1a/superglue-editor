SC.loadPackage({ 'Widget': {

    comment: 'I am the abstract base class of all widgets. Subclasses must include me as a trait, and call the init method of this class. Every Subclass must have a shared property called widgetMenu, which contains as a string the html of its widgetMenu.',


    properties: {

        selection:      { comment: 'I store a reference to the selection of the editing tool.' },

        widgetMenu:     { comment: 'I store a DOMElement containing my .widgetMenuContainer node.' },
        widgetButton:   { comment: 'I store a DOMElement containing my .widgetButton node.' },

        isActionButton: { comment: 'An action button does not stay active after being clicked. I should be set during mySubclass>>init' },

        isWidgetActive: { comment: 'Wether the widget is active. Transform function can be overriden by my subclasses to show e.g. a panel.',
                          transform: function(aBoolean){
                                if(aBoolean){
                                    this.get('widgetMenu').classList.add('active');
                                }else{
                                    this.get('widgetMenu').classList.remove('active');
                                }
                                return aBoolean
                          }
                        }

    },

    methods: {

    	init: { 
    		comment: 	'I init a widget, therefor all my subclasses must call me via this.delegate(\'Widget\', \'init\', theSelection).',
    		code: 		function(theSelection){

                var self = this,
                    widgetMenu  = (new DOMParser()).parseFromString(this.class.get('widgetMenu'), 'text/html').body.firstChild;


                widgetMenu.addEventListener('mouseenter', function(evt){

                    if(theSelection.get('activeWidget') === null){
                        self.set({ isWidgetActive: true });
                    }

                    evt.stopPropagation();

                }, false);

                widgetMenu.addEventListener('mouseleave', function(evt){

                    if(theSelection.get('activeWidget') !== self){
                        self.set({ isWidgetActive: false });
                    }

                    evt.stopPropagation();

                }, false);
                

                widgetMenu.addEventListener('mouseup', function(evt){

                    var activeWidget = theSelection.get('activeWidget');

                    if(self.get('isActionButton')){

                        theSelection.set({ activeWidget:   null  });
                        if(activeWidget){ 
                            activeWidget.set({ isWidgetActive: false }) 
                        }
                        self.set({ isWidgetActive: true });

                    }else{
                        
                        if(activeWidget === self){
                            theSelection.set({ activeWidget:   null });
                        }else if(activeWidget === null){
                            theSelection.set({ activeWidget: self });
                        }else{
                            theSelection.set({ activeWidget: self });
                            activeWidget.set({ isWidgetActive: false });
                                    self.set({ isWidgetActive: true  });
                        }

                    }

                    
                }, false);

                

                widgetMenu.addEventListener('mousedown', function(evt){
                    evt.stopPropagation();
                }, false);


                this.set({
                    selection:      theSelection,
                    widgetMenu:     widgetMenu,
                    widgetButton:   widgetMenu.firstElementChild,
                    isActionButton: false
                });

    		}

    	}


    }


}});