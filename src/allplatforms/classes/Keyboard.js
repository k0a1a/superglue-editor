SC.loadPackage({ 'Keyboard': {

    comment: 'I am a controller for keyboard commands.',

    
    methods: {

        init: { 
            comment:    'method comment',
            code:       function(){

                var self = this;

                document.addEventListener('keydown', function(evt){
                    self.do('processKeyEvent', evt);
                }, false);

            }
        },


        processKeyEvent: {
            comment: 'I process key events.',
            code: function(evt){

                var self       = this,
                    irrelevant = false;

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
                            irrelevant = true;
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

                        case 72:
                            // H (Help)
                            
                            break;

                        default:
                            irrelevant = true;
                            break;

                    }


                }

                if(!irrelevant){
                    evt.stopPropagation();
                    evt.preventDefault();
                }


            }
        }

    }


}});