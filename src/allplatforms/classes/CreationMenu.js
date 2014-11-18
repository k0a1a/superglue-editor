SC.loadPackage({ 'CreationMenu': {

    comment: 'I am the CreationMenu which is shown when the user drags over the document background.',

    sharedProperties: {
        menuContainer: { initValue: '<div id="sg-editing-creation-menu"><div id="sg-editing-creation-menu-items"></div></div>' },
    },

    properties: {
        myNode:        { comment: 'I hold my DOM node.' },
        myItemsNode:   { comment: 'I hold the DOM node for the items container.' },
        startX:        { transform: function(anInt){
                                
                                return anInt;
                            }
                       },
        startY:        { transform: function(anInt){
                                return anInt;
                            }
                       },
        stopX:         { transform: function(anInt){

                                var startX = this.get('startX'),
                                    myNode = this.get('myNode'),
                                    grid     = SuperGlue.get('document').get('grid'),
                                    gridSize = grid.get('gridSize'),
                                    left, width;

                                if(anInt > startX){
                                    if(grid.get('active')){
                                        left  = Math.floor(startX / gridSize) * gridSize;
                                        width = Math.ceil((anInt - startX) / gridSize) * gridSize;
                                    }else{
                                        left  = startX;
                                        width = anInt - startX;
                                    }
                                }else{
                                    if(grid.get('active')){
                                        left  = Math.floor(anInt / gridSize) * gridSize;
                                        width = Math.ceil(startX / gridSize) * gridSize - Math.floor(anInt / gridSize) * gridSize;
                                    }else{
                                        left  = anInt;
                                        width = startX - anInt;
                                    }
                                }

                                myNode.style.width = width + 'px';
                                myNode.style.left  = left  + 'px';
                                

                                return anInt;
                            }
                       },
        stopY:         { transform: function(anInt){

                                var startY = this.get('startY'),
                                    myNode = this.get('myNode'),
                                    grid     = SuperGlue.get('document').get('grid'),
                                    gridSize = grid.get('gridSize'),
                                    top, height;

                                if(anInt > startY){
                                    if(grid.get('active')){
                                        top    = Math.floor(startY / gridSize) * gridSize;
                                        height = Math.ceil((anInt - startY) / gridSize) * gridSize;
                                    }else{
                                        top    = startY;
                                        height = anInt - startY;
                                    }
                                }else{
                                    if(grid.get('active')){
                                        top    = Math.floor(anInt / gridSize) * gridSize;
                                        height = Math.ceil(startY / gridSize) * gridSize - Math.floor(anInt / gridSize) * gridSize;
                                    }else{
                                        top    = anInt;
                                        height = startY - anInt;
                                    }
                                }

                                myNode.style.height = height + 'px';
                                myNode.style.top    = top    + 'px';
                                

                                return anInt;
                            }
                       },

        active:        { comment: 'I store my state as a boolean.' }

    },

    methods: {

    	init: { 
    		comment: 	'I init myself.',
    		code: 		function(){

                var self = this,
                    myNode        = (new DOMParser()).parseFromString(this.class.get('menuContainer'), 'text/html').body.firstChild,
                    myItemsNode   = myNode.firstChild,
                    
                    menuItemsClasses = (function(){ 
                                            return SC.getClasses().filter(function(classname){
                                                return SC.behavesLike(classname, 'Element');
                                            });
                                        }).call(this),
                    menuItem = null;


                for(var i = menuItemsClasses.length - 1; i >= 0; i--){

                    menuItem = (new DOMParser()).parseFromString(
                                        SC.getSharedProperty(menuItemsClasses[i], 'creationMenuItem'),
                                        'text/html').body.firstChild;
                    
                    var onMouseUp = (function(classname){
                        return function(evt){
                            self.do('performCreation', classname);
                        }
                    }).call(this, menuItemsClasses[i])
                    menuItem.addEventListener('mouseup', onMouseUp, false);

                    myItemsNode.appendChild(menuItem);

                }

                
                this.set({
                    myNode:         myNode,
                    myItemsNode:    myItemsNode
                });

    		}
    	},

        trigger: {
            comment: 'Show me at { startX: anInt, startY: anInt }',
            code: function(myCoordinates){

                var self   = this,
                    myNode = this.get('myNode'),
                    myItemsNode = this.get('myItemsNode'),
                    editingContainer = SuperGlue.get('document').get('editingContainer');
                    
                myItemsNode.style.display = 'none';

                this.set({ 
                    startX: myCoordinates.startX,
                    startY: myCoordinates.startY
                })
                
                if(myNode.parentNode !== editingContainer){
                    editingContainer.appendChild(myNode);
                }
                this.set({ active: true })
                

            }
        },




        showItems: {
            comment: 'After dragging has finished, I am called to show the menu items to create an instance of a Element class.',
            code: function(){

                var myItemsNode = this.get('myItemsNode')
                    westSide   = this.get('stopX') < this.get('startX'),
                    northSide  = this.get('stopY') < this.get('startY');

                myItemsNode.className = '';

                if(westSide){
                    if(northSide){
                        myItemsNode.classList.add('sg-editing-creation-menu-nw');
                    }else{
                        myItemsNode.classList.add('sg-editing-creation-menu-sw');
                    }
                }else{
                    if(northSide){
                        myItemsNode.classList.add('sg-editing-creation-menu-ne');
                    }else{
                        myItemsNode.classList.add('sg-editing-creation-menu-se');
                    }
                }

                myItemsNode.style.display = 'block';
                
            }
        },

        close: {
            comment: 'Hide me!',
            code: function(){

                var myNode           = this.get('myNode'),
                    editingContainer = SuperGlue.get('document').get('editingContainer');

                if(myNode.parentNode === editingContainer){
                    editingContainer.removeChild(myNode);
                }
                this.set({ active: false });

            }
        },

        performCreation: {
            comment: 'Tell the document to create a new Element.',
            code: function(classname){
                
                var myNodeStyle = this.get('myNode').style;
                
                var newElement = SuperGlue.get('document').do('createNewElement', {
                    classname:  classname,
                    top:        parseInt(myNodeStyle.top),
                    left:       parseInt(myNodeStyle.left),
                    width:      parseInt(myNodeStyle.width),
                    height:     parseInt(myNodeStyle.height)
                });

                if(newElement.class() === 'ImageElement'){
                    SuperGlue.get('fileManager').do('chooseFile', {
                        oldPath:  '',
                        callback: function(srcPath){
                                        newElement.set({ imgSource: srcPath });
                                    }
                    });
                }

                (function(newElement){

                    SuperGlue.get('history').do('actionHasStarted', function(){
                        SuperGlue.get('document').do('removeElement', newElement)
                    });

                    SuperGlue.get('history').do('actionHasSucceeded', function(){
                        SuperGlue.get('document').do('insertElement', {
                            index:   SuperGlue.get('document').get('children').length,
                            element: newElement
                        })
                    });

                }).call(this, newElement)


            }
        }



    }


}});