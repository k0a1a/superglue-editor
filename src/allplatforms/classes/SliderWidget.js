SC.loadPackage({ 'SliderWidget': {

    comment: 'I am a trait class for Widget classes and provide the functionality for a slider.',

    traits: ['Widget'],

    
    properties: {

        widgetPanel:    { comment: 'I store the DOMElement containing the panel of controls of the widget.' },

        isWidgetActive: { comment: 'Wether the widget is active.',
                          transform: function(aBoolean){
                            
                                if(aBoolean){

                                    if(this.get('widgetPanel').parentNode !== this.get('widgetMenu')){
                                        this.get('widgetMenu').appendChild(this.get('widgetPanel'));
                                    }
                                    this.get('widgetMenu').classList.add('active');

                                    // update Value

                                }else{

                                    if(this.get('widgetPanel').parentNode === this.get('widgetMenu')){
                                        this.get('widgetMenu').removeChild(this.get('widgetPanel'));
                                    }
                                    this.get('widgetMenu').classList.remove('active');
                                
                                }
                                return aBoolean
                          }
                        }

    },

    methods: {

        initSliderWidget: { 
            comment:    'I init the widget as a SliderWidget.',
            code:       function(sliderConfig){

                var widgetPanel = '<div class="sg-editing-widget-slider-panel">'
                                        +'<div class="sg-editing-widget-panel">'
                                            +'<div class="sg-widget-triangle-up"></div>'
                                            +'<div class="sg-editing-widget-slider-range">'
                                                +'<div class="sg-editing-widget-slider-handle" style="top: 0px;"></div>'
                                            +'</div>'
                                        +'</div>'
                                    +'</div>',


                    self        = this,
                    widgetPanel = (new DOMParser()).parseFromString(widgetPanel, 'text/html').body.firstChild,
                    handle      = widgetPanel.querySelector('.sg-editing-widget-slider-handle');
                
                widgetPanel.querySelector('.sg-editing-widget-panel').addEventListener('mouseup', function(evt){
                    sliderConfig.theSelection.set({ activeWidget: self });
                    evt.stopPropagation();
                }, false);

                

                var startY,
                    maxY = 100,
                    clickOffset,
                    currentY,

                    onMouseDownOnRange = function(evt){

                        sliderConfig.theSelection.set({ activeWidget: self });
                        

                         
                        var currentElement = evt.currentTarget,
                            yPosition = 0,
                            newY;
                        
                        if(navigator.userAgent.indexOf('Firefox') > 0){
                            while(currentElement){
                                console.log('yes')
                                yPosition += (currentElement.offsetTop + currentElement.clientTop);
                                currentElement = currentElement.offsetParent;
                            }
                            yPosition -= document.documentElement.scrollTop;
                        }else{
                            while(currentElement){
                                yPosition += (currentElement.offsetTop - currentElement.scrollTop + currentElement.clientTop);
                                currentElement = currentElement.offsetParent;
                            }
                        }

                        newY = evt.clientY - yPosition;

                        if(newY < maxY){
                            handle.style.top = newY + 'px';
                            sliderConfig.setCallback.call(self, newY / maxY);
                        }else{
                            handle.style.top = maxY + 'px';
                            sliderConfig.setCallback.call(self, 1);
                        }


                        evt.stopPropagation();
                        evt.preventDefault();

                    },

                    onMouseDownOnHandle = function(evt){

                        sliderConfig.theSelection.set({ activeWidget: self });
                        

                        currentY = parseInt(handle.style.top);
                        startY   = evt.pageY - currentY;
                        
                        SuperGlue.get('document').set({ interactionInProgress: true });
                        document.addEventListener('mousemove', onMouseMove, true);
                        document.addEventListener('mouseup', onMouseUp, true);
                        evt.stopPropagation();
                        evt.preventDefault();

                    },

                    onMouseMove = function(evt){
                        
                        currentY = evt.pageY - startY;

                        if(currentY < 0){
                            handle.style.top = '0px';
                            sliderConfig.setCallback.call(self, 0);
                        }else if(currentY >= maxY){
                            handle.style.top = maxY + 'px';
                            sliderConfig.setCallback.call(self, 1);
                        }else{
                            handle.style.top = currentY + 'px';
                            sliderConfig.setCallback.call(self, currentY / maxY);
                        }

                        evt.stopPropagation();
                        evt.preventDefault();
                    },

                    onMouseUp = function(evt){
                        
                        SuperGlue.get('document').set({ interactionInProgress: false });
                        document.removeEventListener('mousemove', onMouseMove, true);
                        document.removeEventListener('mouseup', onMouseUp, true);
                        evt.stopPropagation();
                        evt.preventDefault();
                    };

                widgetPanel.querySelector('.sg-editing-widget-slider-handle').addEventListener('mousedown', onMouseDownOnHandle, false);

                widgetPanel.querySelector('.sg-editing-widget-slider-range').addEventListener('mousedown', onMouseDownOnRange, false);

                handle.style.top = sliderConfig.startValue * maxY + 'px';
                
                this.set({ 
                    widgetPanel: widgetPanel
                });

            }

        }


    }


}});