SC.loadPackage({ 'ResizeHandles': {

    comment: 'I am a set of resize handles for one element. I also control their behavior and their effect on the element.',

    sharedProperties: {
        handles: { initValue: '<div class="sg-editing-resize-handles"><div class="sg-editing-resize-handle nwgrip"></div><div class="sg-editing-resize-handle negrip"></div><div class="sg-editing-resize-handle swgrip"></div><div class="sg-editing-resize-handle segrip"></div><div class="sg-editing-resize-handle ngrip"></div><div class="sg-editing-resize-handle egrip"></div><div class="sg-editing-resize-handle sgrip"></div><div class="sg-editing-resize-handle wgrip"></div></div>' },
    },

    properties: {

        myElement:  { comment: 'The element I belong to.' },
        node:       { comment: 'My DOM node.' },
        top:        { transform: function(cssString){ return this.get('node').style.top = cssString; } },
        left:       { transform: function(cssString){ return this.get('node').style.left = cssString; } },
        width:      { transform: function(cssString){ return this.get('node').style.width = cssString; } },
        height:     { transform: function(cssString){ return this.get('node').style.height = cssString; } },

        mouseOnElement: { comment: 'Is the pointer over myElement\'s node?' },
        mouseOnHandle:  { comment: 'Is the pointer over one of my handle nodes?' },
        
        selected:   { comment: 'When my Element is selected, these ResizeHandles should be permantly visible.',
                      transform: function(aBoolean){
                            if(aBoolean){
                                this.do('showResizeHandles');
                            }else{
                                this.do('hideResizeHandles', true);
                            }
                            return aBoolean;
                        } 
                    }
    },

    methods: {

        init: { 
            comment:    'I initialize a set of ResizeHandles for a given Element.',
            code:       function(anElement){

                var self = this,
                    elementNode = anElement.get('node'),
                    handlesNode = (new DOMParser()).parseFromString(this.class.get('handles'), 'text/html').body.firstChild,
                    allResizeHandles = handlesNode.querySelectorAll('.sg-editing-resize-handle');;

                this.set({ mouseOnElement: false, mouseOnHandle: false });
                

                // Set-up the event listeners for show/hide on myElement's node
                elementNode.addEventListener('mouseover', function(evt){ 
                    self.set({ mouseOnElement: true });
                    self.do('showResizeHandles');
                }, false);
                elementNode.addEventListener('mouseout', function(evt){
                    self.set({ mouseOnElement: false });
                    self.do('hideResizeHandles');
                }, false);

                // Set-up the event listeners for show/hide on all my handles' nodes
                for(var i = 0, l = allResizeHandles.length; i < l; i++){
                    allResizeHandles.item(i).addEventListener('mouseover', function(evt){ 
                        self.set({ mouseOnHandle:true });
                        evt.stopPropagation();
                    }, true);
                    allResizeHandles.item(i).addEventListener('mouseout', function(evt){ 
                        self.set({ mouseOnHandle:false });
                        self.do('hideResizeHandles');
                        evt.stopPropagation();
                    }, true);
                }


                // Set-up the resizing functionality
                this.do('initResize', {
                    myElement:        anElement,
                    allResizeHandles: allResizeHandles
                });


                // Store references
                this.set({ 
                    myElement:  anElement,
                    node:       handlesNode
                });

            }
        },

        showResizeHandles: { 
            comment:    'I show the ResizeHandles.',
            code:       function(){
                var handlesNode      = this.get('node'),
                    editingContainer = SuperGlue.get('document').get('editingContainer');
                this.set({ mouseOnElement: true });
                if(handlesNode.parentNode !== editingContainer){
                    editingContainer.appendChild(handlesNode);
                }

            }
        },

        hideResizeHandles: { 
            comment:    'I hide the ResizeHandles.',
            code:       function(forceHide){

                if( !this.get('selected') || forceHide){
                    var self = this,
                        handlesNode      = this.get('node'),
                        editingContainer = SuperGlue.get('document').get('editingContainer');
                
                    window.setTimeout(function(){
                        if(     handlesNode.parentNode === editingContainer 
                            && !self.get('mouseOnElement') 
                            && !self.get('mouseOnHandle') ){
                            editingContainer.removeChild(handlesNode);
                        }
                    }, 20);

                }


            }
        },

        initResize: { 
            comment:    'I init the resize functionality for all my handles.',
            code:       function(config){

                // REMARK: THE CODE IN THIS FUNCTION IS HIGHLY OPTIMISED FOR SPEED,
                //         NOT READABILITY, BE CAREFUL WHEN YOU TOUCH IT!
                
                var self          = this,
                    myElement     = config.myElement,
                    selection     = SuperGlue.get('selection'),
                    wasSelected   = false,
                    startX        = 0,
                    startY        = 0,
                    maxTop        = 0,
                    maxLeft       = 0,
                    pageWidth,
                    infiniteSpace,
                    widthMarkersVisible,
                    gridVisible,

                    virtual       = {
                                        'top'    : 0,
                                        'left'   : 0,
                                        'width'  : 0,
                                        'height' : 0
                                    },
                    twoAxes       = null,
                    changeOne     = null,
                    changeTwo     = null,
                    handlerMap    = {
                                    //  css class   | 2-axes |  y-axis     |   x-axis   |
                                        'nwgrip'  : [ true   ,  'top'      ,   'left'   ],
                                        'negrip'  : [ true   ,  'top'      ,   'width'  ],
                                        'swgrip'  : [ true   ,  'height'   ,   'left'   ],
                                        'segrip'  : [ true   ,  'height'   ,   'width'  ],
                                    //                       | x-or-y-axis | is-x-axis? |
                                        'ngrip'   : [ false  ,  'top'      ,    false   ],
                                        'sgrip'   : [ false  ,  'height'   ,    false   ],
                                        'wgrip'   : [ false  ,  'left'     ,    true    ],
                                        'egrip'   : [ false  ,  'width'    ,    true    ]
                                    },
                    
                    onMouseDown = function(evt){

                        if(evt.button !== 0) return;

                        var widthMarkers = SuperGlue.get('document').get('widthMarkers');
                            grid         = SuperGlue.get('document').get('grid');
                        widthMarkersVisible = widthMarkers.get('visible');
                        gridVisible         = grid.get('visible');
                        widthMarkers.set({ visible: true });
                        grid.set({ visible: true });

                        startX          = evt.pageX;
                        startY          = evt.pageY;
                        
                        virtual.top    = myElement.get('top');
                        virtual.left   = myElement.get('left');
                        virtual.width  = myElement.get('width');
                        virtual.height = myElement.get('height');
                        maxTop  = virtual.top + virtual.height - 50;
                        maxLeft = virtual.left + virtual.width - 50;

                        infiniteSpace = ! SuperGlue.get('document').get('layout').centered;
                        pageWidth     =   SuperGlue.get('document').get('layout').width;
                        if(grid.get('active')){
                            var gridSize = grid.get('gridSize');
                            pageWidth = Math.floor(pageWidth / gridSize) * gridSize;
                        }


                        wasSelected = self.get('selected');

                        var classList = evt.target.classList;
                        for(var i = classList.length - 1; i > -1; i--){
                            var handlerMapItem = handlerMap[classList.item(i)];
                            if(handlerMapItem) {
                                twoAxes   = handlerMapItem[0];
                                changeOne = handlerMapItem[1];
                                changeTwo = handlerMapItem[2]
                                break;
                            }
                        }
                        
                        
                        SuperGlue.get('document').set({ interactionInProgress: true });
                        self.set({ selected: true });
                        document.addEventListener('mousemove', onMouseMove, true);
                        document.addEventListener('mouseup',   onMouseUp,   true);

                        // UNDO

                        evt.stopPropagation();
                        evt.preventDefault();
                    },

                    onMouseUp = function(evt){
                        
                        document.removeEventListener('mousemove', onMouseMove, true);
                        document.removeEventListener('mouseup',   onMouseUp,   true);
                        
                        var myDocument = SuperGlue.get('document');
                        myDocument.do('afterLayoutHasChanged');
                        myDocument.set({ interactionInProgress: false });

                        SuperGlue.get('document').get('widthMarkers').set({ visible: widthMarkersVisible });
                        SuperGlue.get('document').get('grid').set({ visible: gridVisible });
                        
                        self.set({ 
                            mouseOnElement: false,
                            mouseOnHandle: false
                        });
                        self.set({ selected: wasSelected });

                        // UNDO
                        

                        evt.stopPropagation();
                        evt.preventDefault();
                    },

                    onMouseMove = function(evt){

                        var diffX = evt.pageX - startX,
                            diffY = evt.pageY - startY;

                        // distinction for handlers with two free axes or one
                        if(twoAxes){

                            // changeOne is here dimension in y-axis,
                            // changeTwo is here dimension in x-axis

                            virtual[changeOne] += diffY;
                            virtual[changeTwo] += diffX;


                            
                            if(changeOne === 'top'){
                                virtual.height -= diffY;
                            }
                            if(changeTwo === 'left'){
                                virtual.width -= diffX;
                            }


                            if(virtual.left >= 0){
                                if(infiniteSpace || (virtual.width + virtual.left) <= pageWidth){
                                    myElement.set({ 
                                        left:  virtual.left < maxLeft ? virtual.left : maxLeft,
                                        width: virtual.width
                                    });
                                }else{
                                    myElement.set({ 
                                        left:  virtual.left < maxLeft ? virtual.left : maxLeft,
                                        width: pageWidth - virtual.left
                                    });
                                }
                            }else{
                                myElement.set({ 
                                    left:  0,
                                    width: virtual.width + virtual.left
                                });
                            }


                            if(virtual.top >= 0){
                                myElement.set({ 
                                    top:    virtual.top < maxTop ? virtual.top : maxTop,
                                    height: virtual.height
                                });
                            }else{
                                myElement.set({ 
                                    top:  0,
                                    height: virtual.height + virtual.top
                                });
                            }
                            
                            

                        }else{

                            // changeOne is here dimension in y- or x-axis,
                            // changeTwo is true for x-axis, and for y-axis is false
                            if(changeTwo){


                                virtual[changeOne] += diffX;
                                if(changeOne === 'left'){
                                    virtual.width -= diffX;
                                }
                                if(virtual.left >= 0){
                                    if(infiniteSpace || (virtual.width + virtual.left) <= pageWidth){
                                        myElement.set({ 
                                            left:  virtual.left < maxLeft ? virtual.left : maxLeft,
                                            width: virtual.width
                                        });
                                    }else{
                                        myElement.set({ 
                                            left:  virtual.left < maxLeft ? virtual.left : maxLeft,
                                            width: pageWidth - virtual.left
                                        });
                                    }
                                }else{
                                    myElement.set({ 
                                        left:  0,
                                        width: virtual.width + virtual.left
                                    });
                                }


                            }else{


                                virtual[changeOne] += diffY;
                                if(changeOne === 'top'){
                                    virtual.height -= diffY;
                                }
                                if(virtual.top >= 0){
                                    myElement.set({ 
                                        top:    virtual.top < maxTop ? virtual.top : maxTop,
                                        height: virtual.height
                                    });
                                }else{
                                    myElement.set({ 
                                        top:  0,
                                        height: virtual.height + virtual.top
                                    });
                                }


                            }
                            

                        }
                        
                        
                        startX = evt.pageX;
                        startY = evt.pageY;

                        selection.do('updateDimensions');
                    
                        evt.stopPropagation();
                        evt.preventDefault();
                        
                    };



                // finally: register mousedown eventhandler for all my handles

                for(var i = 0, l = config.allResizeHandles.length; i < l; i++){
                    config.allResizeHandles[i].addEventListener('mousedown', onMouseDown, false);
                }






            }
        }


    }


}});