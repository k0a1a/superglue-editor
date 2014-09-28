SC.loadPackage({ 'Keyboard': {

    comment: 'I am a controller for keyboard commands.',

    properties: {

        helperOverlay: { comment: 'I store the helper overlay DOM node.' }

    },
    
    methods: {

        init: { 
            comment:    'method comment',
            code:       function(){

                var self = this;


                document.addEventListener('keydown', function(evt){
                    self.do('processKeyEvent', evt);
                }, false);



                var helperOverlay = document.createElement('div');
                    helperOverlay.setAttribute('id', 'sg-editing-helperOverlay');
                this.set({ helperOverlay: helperOverlay })

                document.addEventListener('keydown', function(evt){
                    if(evt.keyCode === 72){
                        var helperOverlay = self.get('helperOverlay');
                        helperOverlay.style.width  = window.innerWidth + 'px';
                        helperOverlay.style.height = window.innerHeight + 'px';
                        document.body.appendChild(helperOverlay);
                    }
                }, false);

                document.addEventListener('keyup', function(evt){
                    if(evt.keyCode === 72){
                        document.body.removeChild(self.get('helperOverlay'));
                    }
                }, false);


            }
        },


        processKeyEvent: {
            comment: 'I process key events.',
            code: function(evt){

                var self      = this,
                    relevant  = true;

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

                        case 83:
                            // Ctrl+S
                                alert('ja SSSSS')
                            break;

                        case 86:
                            // Ctrl+V
                                
                            break;

                        case 89:
                            // Ctrl+Y
                            
                            break;

                        case 90:
                            // Ctrl+Z
                            
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

                        case 32:
                            // Space
                            
                            break;

                        case 37:
                            // ArrowLeft
                            
                            break;

                        case 38:
                            // ArrowUp
                            
                            break;

                        case 39:
                            // ArrowRight
                            
                            break;

                        case 40:
                            // ArrowDown
                            
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
        }

    }


}});