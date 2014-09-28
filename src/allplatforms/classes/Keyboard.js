SC.loadPackage({ 'Keyboard': {

    comment: 'I am a controller for keyboard commands.',

    properties: {

        helperOverlay: { comment: 'I store the helper overlay DOM node.' }

    },
    
    methods: {

        init: { 
            comment:    'method comment',
            code:       function(){

                var self = this,
                    spaceBarDown = false;


                document.addEventListener('keydown', function(evt){
                    if(evt.target.tagName === 'INPUT' || evt.target.tagName === 'TEXTAREA' ){
                        return;
                    }
                    self.do('processKeyEvent', evt);
                }, false);



                var helperOverlay = document.createElement('div');
                    helperOverlay.setAttribute('id', 'sg-editing-helperOverlay');
                this.set({ helperOverlay: helperOverlay })

                document.addEventListener('keydown', function(evt){

                    if(evt.target.tagName === 'INPUT' || evt.target.tagName === 'TEXTAREA' ){
                        return;
                    }

                    if(evt.keyCode === 72){

                        var helperOverlay = self.get('helperOverlay');
                        helperOverlay.style.width  = window.innerWidth + 'px';
                        helperOverlay.style.height = window.innerHeight + 'px';
                        document.body.appendChild(helperOverlay);

                    } else if(evt.keyCode === 32){

                        if(spaceBarDown === false){
                            var myDocument = SuperGlue.get('document');
                            myDocument.set({ showOutlines: !myDocument.get('showOutlines') });
                            spaceBarDown = true;
                        }
                        evt.stopPropagation();
                        evt.preventDefault();

                    }

                }, false);

                document.addEventListener('keyup', function(evt){

                    if(evt.target.tagName === 'INPUT' || evt.target.tagName === 'TEXTAREA' ){
                        return;
                    }

                    if(evt.keyCode === 72){

                        document.body.removeChild(self.get('helperOverlay'));

                    } else if(evt.keyCode === 32){

                        if(spaceBarDown === true){
                            var myDocument = SuperGlue.get('document');
                            myDocument.set({ showOutlines: !myDocument.get('showOutlines') });
                            spaceBarDown = false;
                        }
                        evt.stopPropagation();
                        evt.preventDefault();

                    }

                }, false);


            }
        },


        processKeyEvent: {
            comment: 'I process key events.',
            code: function(evt){

                var relevant  = true;

                if(evt.ctrlKey){


                    switch(evt.keyCode){

                        case 38:
                            // Ctrl+ArrowUp
                            
                            SuperGlue.get('selection').do('callWidgetAction', { 
                                widget:   'WidgetLayerTop',
                                modifier: evt.shiftKey
                            });
                            
                            break;

                        case 40:
                            // Ctrl+ArrowDown
                            
                            SuperGlue.get('selection').do('callWidgetAction', { 
                                widget:   'WidgetLayerBottom',
                                modifier: evt.shiftKey
                            });

                            break;

                        case 65:
                            // Ctrl+A

                            this.do('selectAll');
                            
                            break;

                        case 67:
                            // Ctrl+C

                            SuperGlue.get('selection').do('callWidgetAction', { 
                                widget:   'WidgetCopy'
                            });
                            
                            break;

                        case 71:
                            // Ctrl+G
                            
                            SuperGlue.get('selection').do('callWidgetAction', { 
                                widget:   'WidgetLock'
                            });

                            break;

                        case 73:
                            // Ctrl+I
                            
                            SuperGlue.get('document').get('documentMenu').do('callMenuItemAction', { 
                                menuItem: 'MenuItemNewPage'
                            });

                            break;

                        case 79:
                            // Ctrl+O
                            
                            SuperGlue.get('document').get('documentMenu').do('callMenuItemAction', { 
                                menuItem: 'MenuItemFileManager'
                            });

                            break;

                        case 83:
                            // Ctrl+S
                            
                            if(evt.shiftKey){
                                SuperGlue.get('document').get('documentMenu').do('callMenuItemAction', { 
                                    menuItem: 'MenuItemSaveAs'
                                });
                            }else{
                                SuperGlue.get('document').get('documentMenu').do('callMenuItemAction', { 
                                    menuItem: 'MenuItemSave'
                                });
                            }

                            break;

                        case 86:
                            // Ctrl+V
                            
                            SuperGlue.get('selection').do('clearAll');

                            SuperGlue.get('document').get('documentMenu').do('callMenuItemAction', { 
                                menuItem: 'MenuItemPaste'
                            });

                            break;

                        case 89:
                            // Ctrl+Y

                            SuperGlue.get('selection').do('clearAll');
                            
                            SuperGlue.get('document').get('documentMenu').do('callMenuItemAction', { 
                                menuItem: 'MenuItemRedo'
                            });

                            break;

                        case 90:
                            // Ctrl+Z

                            SuperGlue.get('selection').do('clearAll');
                            
                            SuperGlue.get('document').get('documentMenu').do('callMenuItemAction', { 
                                menuItem: 'MenuItemUndo'
                            });

                            break;

                        default:
                            relevant = false;
                            break;

                    }


                }else{

                    switch(evt.keyCode){

                        case 46:
                            
                            SuperGlue.get('selection').do('callWidgetAction', { 
                                widget:   'WidgetDelete'
                            });
                            
                            break;


                        case 37:
                            // ArrowLeft

                            this.do('moveSelection', 'left');
                            
                            break;

                        case 38:
                            // ArrowUp

                            this.do('moveSelection', 'up');
                            
                            break;

                        case 39:
                            // ArrowRight

                            this.do('moveSelection', 'right');
                            
                            break;

                        case 40:
                            // ArrowDown

                            this.do('moveSelection', 'down');
                            
                            break;

                        default:
                            relevant = false;
                            break;

                    }


                }

                if(relevant){
                    evt.stopPropagation();
                    evt.preventDefault();
                }


            }
        },


        selectAll: {
            comment: 'I select all (Ctrl+A)',
            code: function(){

                for(var selection   = SuperGlue.get('selection'),
                        allElements = SuperGlue.get('document').get('children'),
                        i = 0, l = allElements.length;
                        i < l; i++){

                    selection.do('addElement', allElements[i]);

                }

            }
        },


        moveSelection: {
            comment: 'I move the selected elements on arrow key strokes in the given direction.',
            code: function(direction){

                var elements = SuperGlue.get('selection').get('elements'),
                    stepSize = SuperGlue.get('document').get('grid').get('active') 
                                ? SuperGlue.get('document').get('grid').get('gridSize') 
                                : 1,
                    layout   = SuperGlue.get('document').get('layout');


                (function(elements){

                    var savedDimensions = []

                    for(var i = 0, l = elements.length; i < l; i++){
                        savedDimensions.push({
                            top:    elements[i].get('top'),
                            left:   elements[i].get('left'),
                            width:  elements[i].get('width'),
                            height: elements[i].get('height')
                        })
                    }
                    
                    SuperGlue.get('history').do('actionHasStarted', function(){
                        
                        for(var i = 0, l = elements.length; i < l; i++){
                            elements[i].set({
                                top:    savedDimensions[i].top,
                                left:   savedDimensions[i].left,
                                width:  savedDimensions[i].width,
                                height: savedDimensions[i].height
                            })
                        }
                    
                    });

                }).call(this, elements);



                for(var i = 0, l = elements.length; i < l; i++){

                    switch(direction){

                        case 'up':
                            elements[i].set({ top: (elements[i].get('top') - stepSize) });
                            break;

                        case 'down':
                            elements[i].set({ top: (elements[i].get('top') + stepSize) });
                            break;

                        case 'left':
                            elements[i].set({ left: (elements[i].get('left') - stepSize) });
                            break;

                        case 'right':
                            if(layout.centered){
                                if(layout.width >= elements[i].get('left') + elements[i].get('width') + stepSize){
                                    elements[i].set({ left: (elements[i].get('left') + stepSize) });
                                }
                            }else{
                                elements[i].set({ left: (elements[i].get('left') + stepSize) });
                            }
                            break;

                    }

                }

                SuperGlue.get('selection').do('updateDimensions');


                (function(elements){

                    var savedDimensions = []

                    for(var i = 0, l = elements.length; i < l; i++){
                        savedDimensions.push({
                            top:    elements[i].get('top'),
                            left:   elements[i].get('left'),
                            width:  elements[i].get('width'),
                            height: elements[i].get('height')
                        })
                    }
                    
                    SuperGlue.get('history').do('actionHasSucceeded', function(){
                        
                        for(var i = 0, l = elements.length; i < l; i++){
                            elements[i].set({
                                top:    savedDimensions[i].top,
                                left:   savedDimensions[i].left,
                                width:  savedDimensions[i].width,
                                height: savedDimensions[i].height
                            })
                        }
                    
                    });

                }).call(this, elements);

                
            }
        }



    }


}});