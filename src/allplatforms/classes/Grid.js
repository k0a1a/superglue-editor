SC.loadPackage({ 'Grid': {

    comment: 'I provide a grid for the page, with controls to set the configuration of the grid. When I am active, I arrange Elements with my method Grid>>arrangeElement.',

    properties: {

        gridContainer: { comment: 'I hold the DOM container in which the grid is shown as background image. ' },

        gridControl:   { comment: 'I hold the DOM container for the grid controls.' },

        myDocument:    { comment: 'I store a reference to my document.' },

        active:     { comment: 'Wether the grid is active.',
                      transform: function(aBoolean){

                            var gridContainer = this.get('gridContainer');

                            if(aBoolean){
                                if(gridContainer.parentNode !== document.body){
                                    document.body.insertBefore(gridContainer, this.get('myDocument').get('pageContainer'));
                                }
                            }else{
                                if(gridContainer.parentNode === document.body){
                                    document.body.removeChild(gridContainer);
                                }
                            }
                            
                            return aBoolean;

                      }
                    },

        gridSize:   { comment: 'The grid size in pixel.',
                      transform: function(anInt){

                            var canvas, ctx;

                            if(anInt >= 7){
                                
                                canvas = document.createElement('canvas');
                                canvas.width  = anInt;
                                canvas.height = anInt;
                                ctx = canvas.getContext('2d');

                                ctx.strokeStyle = 'rgba(255,41,61,0.4)';

                                ctx.beginPath();
                                ctx.moveTo(anInt, 0);
                                ctx.lineTo(anInt, anInt);
                                ctx.stroke();

                                ctx.beginPath();
                                ctx.moveTo(0, anInt);
                                ctx.lineTo(anInt, anInt);
                                ctx.stroke();

                                this.get('gridContainer').style.backgroundImage  = 'url("' + canvas.toDataURL() + '")';

                            }
                            return anInt < 7 ? 0 : anInt;
                      }
                    },

        visible:    { comment: 'Wether I am visible or not.',
                      transform: function(aBoolean){
                            if(aBoolean){
                                this.get('gridContainer').style.display = 'block';
                                this.get('gridControl').classList.remove('sg-editing-grid-control-hidden');
                            }else{
                                this.get('gridContainer').style.display = 'none';
                                this.get('gridControl').classList.add('sg-editing-grid-control-hidden');
                            }
                            return aBoolean;
                      }
                    }
        

    },
    

    methods: {

    	init: { 
    		comment: 	'I initalize myself.',
    		code: 		function(theDocument){

                this.set({ myDocument: theDocument });

                var self = this,
                    pageContainer = theDocument.get('pageContainer'),
                    config        = pageContainer.getAttribute('data-superglue-grid').split('/'),
                    active        = config[0] === 'on',
                    gridSize      = active ? parseInt(config[1]) : 0,

                    gridContainer = this.set({ gridContainer: (function(){
                                                        var gridContainer = document.createElement('div');
                                                        gridContainer.setAttribute('id', 'sg-editing-grid-container');
                                                        return gridContainer;
                                                    }).call(this)
                                    }),

                    gridControl   = this.set({ gridControl: (function(){
                                                        var gridControl = document.createElement('div');
                                                        gridControl.setAttribute('id', 'sg-editing-grid-control');
                                                        theDocument.get('editingContainer').appendChild(gridControl);
                                                        return gridControl;
                                                    }).call(this)
                                    });


                window.addEventListener('resize', function(){
                    self.do('updateDimensions');
                }, false);

                this.set({
                    active:   active,
                    gridSize: gridSize
                });


                this.do('initGridControl');


    		}
    	},


        updateDimensions: {
            comment:    'I update the gridContainer\'s dimensions and position.',
            code:       function(newConfig){

                var gridContainer = this.get('gridContainer');

                var layout        = newConfig ? newConfig : SuperGlue.get('document').get('layout'),
                    minHeight     = SuperGlue.get('document') ? SuperGlue.get('document').do('getMinHeight') : 0,
                    minWidth;


                if(layout.centered){

                    if(window.innerWidth >= layout.width){
                        gridContainer.style.width      = layout.width + 'px';
                        gridContainer.style.left       = '50%';
                        gridContainer.style.marginLeft = layout.width / -2 + 'px';
                    }else{
                        gridContainer.style.width      = layout.width + 'px';
                        gridContainer.style.left       = '0px';
                        gridContainer.style.marginLeft = '0px';
                    }

                }else{

                    minWidth  = SuperGlue.get('document') ? SuperGlue.get('document').do('getMinWidth') : 0;
                    
                    gridContainer.style.width      = (minWidth < window.innerWidth - 20 ? window.innerWidth - 20 : minWidth) + 'px';
                    gridContainer.style.left       = '0px';
                    gridContainer.style.marginLeft = '0px';

                }

                gridContainer.style.height = (minHeight < window.innerHeight ? window.innerHeight : minHeight) + 'px';


            }
        },

        initGridControl: {
            comment: 'I init the gridControl.',
            code: function(){

                var self = this,
                    startX,
                    gridSize,
                    wasVisible,
                    gridControl = this.get('gridControl'),

                    allElements,
                    allElementDimensions,
                    pageWidth,

                    onMouseDown = function(evt){

                        startX   = evt.pageX;
                        gridSize = self.get('gridSize');

                        SuperGlue.get('document').set({ interactionInProgress: true });
                        SuperGlue.get('selection').do('clearAll');

                        wasVisible = self.get('visible');
                        self.set({ visible: true });


                        allElements = SuperGlue.get('document').get('children');
                        allElementDimensions = [];
                        for(var i = 0, l = allElements.length; i < l; i++){
                            allElementDimensions.push({
                                top:    allElements[i].get('top'),
                                left:   allElements[i].get('left'),
                                width:  allElements[i].get('width'),
                                height: allElements[i].get('height')
                            })
                        }
                        pageWidth = self.get('myDocument').get('layout').width;


                        document.addEventListener('mousemove', onMouseMove, true);
                        document.addEventListener('mouseup',   onMouseUp,   true);

                        // UNDO

                        evt.stopPropagation();
                        evt.preventDefault();

                    },
                    onMouseMove = function(evt){

                        var newGridSize = Math.floor(gridSize + ((evt.pageX - startX) / 2));

                        if(newGridSize < 7){

                            if(self.get('active')){ 
                                self.set({ active: false }); 
                            }
                            gridControl.style.left = '-20px';

                            newGridSize = 0;

                        }else if(newGridSize > 70){

                            self.set({ gridSize: 70 });
                            gridControl.style.left = '120px';

                        }else{

                            if(!self.get('active')){ 
                                self.set({ active: true }); 
                            }
                            self.set({ gridSize: newGridSize });
                            gridControl.style.left = newGridSize * 2 - 20 + 'px';

                        }

                        for(var i = 0, l = allElements.length; i < l; i++){

                            allElements[i].set(allElementDimensions[i]);

                            if(pageWidth && (allElements[i].get('left') + allElements[i].get('width')) > pageWidth){

                                var newLeft  = allElements[i].get('left'),
                                    newWidth = allElements[i].get('width');

                                while(newLeft + newWidth > pageWidth){

                                    newLeft   = allElements[i].set({ 
                                                    left:  (allElementDimensions[i].left  - 0.5 * newGridSize)
                                                });

                                    newWidth  = allElements[i].set({ 
                                                    width: (allElementDimensions[i].width - newGridSize)
                                                });
                                    
                                }


                            }
                        }

                        
                    },
                    onMouseUp = function(evt){

                        document.removeEventListener('mousemove', onMouseMove, true);
                        document.removeEventListener('mouseup',   onMouseUp,   true);
                        
                        SuperGlue.get('document').set({ interactionInProgress: false });
                        self.set({ visible: wasVisible });
                        
                        // UNDO
                        
                        evt.stopPropagation();
                        evt.preventDefault();
                        
                    };

                gridControl.style.left = this.get('gridSize') * 2 - 20 + 'px';

                gridControl.addEventListener('mousedown', onMouseDown, false);



            }
        }


    }


}});