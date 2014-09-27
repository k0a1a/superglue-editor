SC.loadPackage({ 'WidthMarkers': {

    comment: 'When the document has a centered layout, these markers show the left and right border of the page, and provide interaction functionality to change the width.',


    sharedProperties: {

        markerContainers:   { initValue: '<div id="sg-editing-width-marker-left"></div><div id="sg-editing-width-marker-right"></div>' }

    },

    properties: {

        markerLeft:       { comment: 'My left marker'  },
        markerRight:      { comment: 'My right marker' },
        editingContainer: { comment: 'I need a reference to the editingContainer.' },

        active:     { comment:      'Shall my markers be functional or not?',
                      transform:    function(aBoolean){
                                        if(aBoolean){
                                            this.get('editingContainer').appendChild(this.get('markerLeft'));
                                            this.get('editingContainer').appendChild(this.get('markerRight'))
                                        }else{
                                            if(    this.get('markerLeft').parentNode === this.get('editingContainer')
                                                && this.get('markerLeft').parentNode === this.get('editingContainer')){
                                                this.get('editingContainer').removeChild(this.get('markerLeft'));
                                                this.get('editingContainer').removeChild(this.get('markerRight'));
                                            }
                                        }
                                        return aBoolean;
                                    }
                    },
        visible:    { comment:      'Shall my markers be visible or not?',
                      transform:    function(aBoolean){
                                        if(aBoolean){
                                            this.get('markerLeft').classList.add('sg-editing-width-marker-left-visible');
                                            this.get('markerRight').classList.add('sg-editing-width-marker-right-visible');
                                        }else{
                                            this.get('markerLeft').classList.remove('sg-editing-width-marker-left-visible');
                                            this.get('markerRight').classList.remove('sg-editing-width-marker-right-visible');
                                        }
                                        return aBoolean;
                                    }
                    }

    },

    methods: {

        init: { 
            comment:    'I initalize myself.',
            code:       function(editingContainer){

                

                var widthMarkers = (new DOMParser()).parseFromString(this.class.get('markerContainers'), 'text/html').body,
                    markerLeft   = widthMarkers.childNodes.item(0),
                    markerRight  = widthMarkers.childNodes.item(1);

                this.set({ 
                    editingContainer:   editingContainer,
                    markerLeft:         markerLeft,
                    markerRight:        markerRight,
                    visible:            true
                });


                var self = this,

                    onMouseOver = function(evt){
                        if(!self.get('visible')){
                            self.get('markerLeft').classList.add('sg-editing-width-marker-left-visible');
                            self.get('markerRight').classList.add('sg-editing-width-marker-right-visible');
                        }
                    },
                    onMouseOut = function(evt){
                        if(!self.get('visible')){
                            self.get('markerLeft').classList.remove('sg-editing-width-marker-left-visible');
                            self.get('markerRight').classList.remove('sg-editing-width-marker-right-visible');
                        }
                    },

                    startX   = 0,
                    minWidth = 0,
                    leftSide = false,
                    wasVisible = true,

                    gridVisible,

                    onMouseDown = function(evt){
                        if(evt.button !== 0) return;
                        startX   = evt.pageX;
                        minWidth = SuperGlue.get('document').do('getMinWidth');
                        leftSide = evt.target === markerLeft;
                        SuperGlue.get('document').set({ interactionInProgress: true });
                        wasVisible = self.get('visible');
                        self.set({ visible: true });

                        gridVisible = SuperGlue.get('document').get('grid').get('visible');
                        SuperGlue.get('document').get('grid').set({ visible: true });

                        
                        (function(width){

                            SuperGlue.get('history').do('actionHasStarted', function(){
                                SuperGlue.get('document').set({ layout: {
                                    width:    width,
                                    centered: true
                                }})
                            })

                        }).call(this, SuperGlue.get('document').get('layout').width)


                        document.addEventListener('mousemove', onMouseMove, true);
                        document.addEventListener('mouseup',   onMouseUp,   true);

                        evt.stopPropagation();
                        evt.preventDefault();
                    },
                    onMouseUp = function(evt){
                        document.removeEventListener('mousemove', onMouseMove, true);
                        document.removeEventListener('mouseup',   onMouseUp,   true);
                        
                        var myDocument = SuperGlue.get('document');
                        myDocument.do('afterLayoutHasChanged');
                        myDocument.set({ interactionInProgress: false });
                        
                        self.set({ visible: wasVisible });
                        self.get('markerLeft').classList.add('sg-editing-width-marker-left-visible');
                        self.get('markerRight').classList.add('sg-editing-width-marker-right-visible');

                        SuperGlue.get('document').get('grid').set({ visible: gridVisible });

                        (function(width){

                            SuperGlue.get('history').do('actionHasSucceeded', function(){
                                SuperGlue.get('document').set({ layout: {
                                    width:    width,
                                    centered: true
                                }})
                            })

                        }).call(this, SuperGlue.get('document').get('layout').width)
                        
                        evt.stopPropagation();
                        evt.preventDefault();
                    },
                    onMouseMove = function(evt){
                        var diff       = 2 * (evt.pageX - startX) * (leftSide ? -1 : 1),
                            myDocument = SuperGlue.get('document'),
                            oldWidth   = myDocument.get('layout').width,
                            newWidth   = oldWidth + diff;
                        if(newWidth > minWidth){
                            myDocument.set({ layout: {
                                centered: true,
                                width:    newWidth
                            }});
                            startX = evt.pageX;
                        }else{
                            myDocument.set({ layout: {
                                centered: true,
                                width:    minWidth
                            }});
                        }

                        evt.stopPropagation();
                        evt.preventDefault();
                    };

                markerLeft.addEventListener('mouseover', onMouseOver, false);
                markerRight.addEventListener('mouseover', onMouseOver, false);
                markerLeft.addEventListener('mouseout', onMouseOut, false);
                markerRight.addEventListener('mouseout', onMouseOut, false);

                markerLeft.addEventListener('mousedown', onMouseDown, false);
                markerRight.addEventListener('mousedown', onMouseDown, false);

                window.addEventListener('resize', function(){
                    self.do('updateHeight');
                }, false)

            }
        },

        updateHeight: {

            comment:    'My height must be updated on all relevant changes of page content.',
            code:       function(){

                var minHeight = SuperGlue.get('document').do('getMinHeight');

                minHeight = minHeight > window.innerHeight ? minHeight : window.innerHeight;

                this.get('markerLeft').style.height = minHeight + 'px';
                this.get('markerRight').style.height = minHeight + 'px';
                

            }

        }


    }


}});