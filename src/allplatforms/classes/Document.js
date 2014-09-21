SC.loadPackage({ 'Document': {

    comment: 'I am the document the user works on.',

    properties: {

        pageContainer:      { comment: 'I store the div element containing the pages\' elements.' },
        editingContainer:   { comment: 'I am a container holding all user interface components of the editing tool.'},
        children:           { comment: 'I care for my (array of) children, which are the instances of some Element class.' },

        showOutlines:       { comment: 'Shall I put outlines around all my child Elements?', 
                              transform: function(aBoolean){
                                if(aBoolean){
                                    this.get('pageContainer').classList.add('sg-editing-outlines');
                                    this.get('widthMarkers').set({ visible: true });
                                    this.get('grid').set({ visible: true });
                                }else{
                                    this.get('pageContainer').classList.remove('sg-editing-outlines');
                                    this.get('widthMarkers').set({ visible: false });
                                    this.get('grid').set({ visible: false });
                                }
                                return aBoolean;
                              }
                            },

        interactionInProgress:  { comment: 'Some interaction require a modal change of editing state, while the interaction is in progress. This concerns all interactions which listen for mouse moves.', 

                              transform: function(aBoolean){
                                if(aBoolean){
                                    this.get('pageContainer').classList.add('sg-editing-block-events');
                                    this.get('documentMenu').do('close');
                                    this.get('creationMenu').do('close');
                                }else{
                                    this.get('pageContainer').classList.remove('sg-editing-block-events');
                                }
                                return aBoolean;
                              }
                            },

        documentMenu:       { comment: 'I hold the DocumentMenu.' },
        creationMenu:       { comment: 'I hold the CreationMenu.' },
        widthMarkers:       { comment: 'When the document has a defined width, WidthMarkers visualize this and provide interaction.' },
        grid:               { comment: 'The document always has a Grid to arrange its Elements.' },
        
        layout:             { comment: 'The document manages the basic layout: it can either be (centered with a defined width) or can be (of undefined dimensions). To change this property give me a newConfig like { centered: true, width: \'70%\' } or { centered: false }.',
                              transform: function(newConfig){

                                var pageContainer    = this.get('pageContainer'),
                                    editingContainer = this.get('editingContainer');

                                if(newConfig.centered){

                                    if(newConfig.width === undefined){
                                        this.do('cropEmptySpaceOnLeftSide');
                                        newConfig.width = this.do('getMinWidth');
                                    }

                                    newConfig.width = newConfig.width > 140 ? newConfig.width : 140;

                                    pageContainer.classList.add('sg-page-centered');
                                    editingContainer.classList.add('sg-editing-container-centered');
                                    pageContainer.style.width = editingContainer.style.width = newConfig.width + 'px';

                                    this.get('widthMarkers').set({ active: true });

                                }else{

                                    pageContainer.classList.remove('sg-page-centered');
                                    editingContainer.classList.remove('sg-editing-container-centered');
                                    pageContainer.style.width = editingContainer.style.width = null;

                                    this.get('widthMarkers').set({ active: false });

                                }

                                var returnConfig = { centered: newConfig.centered, width: newConfig.width };
                                this.get('grid').do('updateDimensions', returnConfig);
                                return returnConfig;

                              }
                            }

        

    },

    methods: {

        init: { 
            comment:    'I set up the Document during system initialization, called from SuperGlue>>init.',
            code:       function(){

                var pageContainer    = this.set({  pageContainer: document.body.querySelector('#sg-page') }),
                    editingContainer = this.set({  editingContainer: (function(){
                                                        var editingContainer = document.createElement('div');
                                                        editingContainer.setAttribute('id', 'sg-editing-container');
                                                        document.body.appendChild(editingContainer);
                                                        return editingContainer;
                                                    }).call(this)
                                        });

                this.set({ 

                    documentMenu:       SC.init('DocumentMenu'),

                    creationMenu:       SC.init('CreationMenu'),

                    widthMarkers:       SC.init('WidthMarkers', editingContainer),

                    grid:               SC.init('Grid', this)

                });

                this.set({

                    layout:             {
                                            centered:   pageContainer.classList.contains('sg-page-centered'),
                                            width:      parseInt(pageContainer.style.width)
                                        }
                });


            }
        },

        setUpWorkspace: {
            comment:    'I wake up my children from the DOM and prepare the document for work.',
            code:       function(){

                this.set({ 

                    children:   (function(){
                                    var nodeList = this.get('pageContainer').querySelectorAll('.sg-element'),
                                        children = [];
                                    for (var i = 0, l = nodeList.length; i < l; ++i) {
                                        children.push(SC.do('Element', 'awakeFromDOM', nodeList.item(i)));
                                    }
                                    return children;
                                }).call(this),
                    
                    showOutlines: document.querySelector('meta[name=generator]').getAttribute('data-superglue-settings').indexOf('wireframe') > -1

                });

                this.do('afterLayoutHasChanged');

                this.do('registerEventListeners');

            }
        },

        createNewElement: {
            comment: 'I create a new Element, with the arguments configuration { classname: aString, top: anInt, left: anInt, width: anInt, height: anInt }.',
            code: function(configuration){

                var protoHTML = SC.getSharedProperty(configuration.classname, 'protoHTML'),
                    newNode   = (new DOMParser()).parseFromString(protoHTML, 'text/html').body.firstChild,
                    newChild;

                this.get('pageContainer').appendChild(newNode);
                newChild = SC.do('Element', 'awakeFromDOM', newNode)
                newChild.set({
                    top:    configuration.top,
                    left:   configuration.left,
                    width:  configuration.width,
                    height: configuration.height
                })

                this.get('children').push(newChild);

                this.do('afterLayoutHasChanged');

                return newChild;

            }
        },

        removeElement: {
            comment: 'I remove an Element.',
            code: function(anElement){

                var indexOfElement = this.get('children').indexOf(anElement);
                if(indexOfElement >= 0){
                    this.get('children').splice(indexOfElement, 1);
                    this.get('pageContainer').removeChild(anElement.get('node'));
                }
                this.do('afterLayoutHasChanged');

            }
        },


        layerUp: {
            comment: 'I move an Element upwards in the layer order.',
            code: function(anElement){

                var pageContainer = this.get('pageContainer'),
                    children      = this.get('children'),
                    childIndex    = children.indexOf(anElement),
                    swapTemp;

                if(childIndex === (children.length - 1)){
                    return; 
                }

                swapTemp = children[childIndex + 1];
                children[childIndex + 1] = children[childIndex];
                children[childIndex] = swapTemp;
                
                pageContainer.insertBefore(
                    children[childIndex + 1].get('node'),
                    children[childIndex].get('node').nextElementSibling
                );

            }
        },


        layerDown: {
            comment: 'I move an Element downwards in the layer order.',
            code: function(anElement){

                var pageContainer = this.get('pageContainer'),
                    children      = this.get('children'),
                    childIndex    = children.indexOf(anElement),
                    swapTemp;

                if(childIndex === 0){
                    return; 
                }

                swapTemp = children[childIndex - 1];
                children[childIndex - 1] = children[childIndex];
                children[childIndex] = swapTemp;
                
                pageContainer.insertBefore(
                    children[childIndex - 1].get('node'),
                    children[childIndex].get('node')
                );

            }
        },


        getMinWidth: {
            comment: 'I calculate the minimal width I need to fit in all my child Elements.',
            code: function(){
                var minWidth = 0,
                    children = this.get('children');
                for(var i = 0, l = children.length; i < l; i++){
                    var childWidth = children[i].get('left') + children[i].get('width');
                    minWidth = (childWidth > minWidth) ? childWidth : minWidth;
                }
                return minWidth;
            }
        },


        getMinHeight: {
            comment: 'I calculate the minimal height to fit in all my child Elements.',
            code: function(){
                var minHeight = 0,
                    children  = this.get('children');
                for(var i = 0, l = children.length; i < l; i++){
                    var childHeight = children[i].get('top') + children[i].get('height');
                    minHeight = (childHeight > minHeight) ? childHeight : minHeight;
                }
                return minHeight;
            }
        },

        getMostLeft: {
            comment: 'I get the left value of the most left positioned of all my child Elements.',
            code: function(){
                var children = this.get('children');
                if(children.length === 0){ return 0; }
                var mostLeft = children[0].get('left');
                for(var i = 0, l = children.length; i < l; i++){
                    var childLeft = children[i].get('left');
                    mostLeft = (childLeft < mostLeft) ? childLeft : mostLeft;
                }
                return mostLeft;
            }
        },

        cropEmptySpaceOnLeftSide: {
            comment: 'I crop the empty space on the left side of the page. Should be called when centering the page.',
            code:    function(){
                
                var children = this.get('children');
                if(children.length === 0){ return 0; }

                for(var cropWidth = this.do('getMostLeft'), i = 0, l = children.length; i < l; i++){

                    children[i].set({ left: children[i].get('left') - cropWidth });

                }

                this.do('afterLayoutHasChanged');
            }
        },

        afterLayoutHasChanged: {
            comment: 'After the layout has changed (resizing, moving, or adding anything), I must be called to ensure the layout constraints.',
            code: function(){
                this.get('widthMarkers').do('updateHeight');
                this.get('grid').do('updateDimensions');
            }
        },

        registerEventListeners: {
            comment: 'I register eventListeners on the window.document for DocumentMenu and CreationMenu.',
            code: function(){

                var self = this,
                    creationMenu = this.get('creationMenu'),

                    startX, 
                    startY,
                    dragging,

                    outOfBounds,
                    centeredPage,
                    pseudoMargin,
                    pageLeft,
                    pageWidth,

                    widthMarkersVisible,
                    gridVisible,
                    

                    onMouseDown = function(evt){

                        if(evt.button !== 0) return;

                        if(    evt.clientX > document.documentElement.clientWidth
                            || evt.clientY > document.documentElement.clientHeight ){
                            // browser scrollbars
                            return;
                        }

                        startX    = evt.pageX;
                        startY    = evt.pageY;
                        dragging  = false;

                        centeredPage = self.get('layout').centered;
                        pageWidth    = self.get('layout').width;
                        if(SuperGlue.get('document').get('grid').get('active')){
                            var gridSize = SuperGlue.get('document').get('grid').get('gridSize');
                            pageWidth = Math.floor(pageWidth / gridSize) * gridSize;
                        }
                        pseudoMargin = centeredPage 
                                        ? (parseInt(window.getComputedStyle(document.body).getPropertyValue('width')) - pageWidth) / 2
                                        : 0;
                        pageLeft     = pseudoMargin > 0 ? pseudoMargin : 0;
                        pageRight    = pageLeft + pageWidth;
                        outOfBounds  = startX < pageLeft || (centeredPage && startX > pageRight) || startY < 0;


                        document.addEventListener('mousemove', onMouseMove, true);
                        document.addEventListener('mouseup',   onMouseUp,   true);

                        evt.preventDefault();
                    },

                    onMouseMove = function(evt){

                        if(    !dragging
                            && (    evt.pageX < startX - 10
                                ||  evt.pageX > startX + 10
                                ||  evt.pageY < startY - 10
                                ||  evt.pageY > startY + 10 )
                        ){

                            dragging = true;

                            self.set({ interactionInProgress: true });

                            var widthMarkers = SuperGlue.get('document').get('widthMarkers');
                                grid         = SuperGlue.get('document').get('grid');
                            widthMarkersVisible = widthMarkers.get('visible');
                            gridVisible         = grid.get('visible');
                            widthMarkers.set({ visible: true });
                            grid.set({ visible: true });

                            if(!outOfBounds){

                                SuperGlue.get('selection').do('clearAll')
                                
                                creationMenu.do('trigger', { 
                                    startX: startX - pageLeft,
                                    startY: startY,
                                    stopX:  evt.pageX - pageLeft,
                                    stopY:  evt.pageY
                                });

                            }
                            
                        }
                        if(dragging && !outOfBounds){

                            if(evt.pageX <= pageLeft){
                                creationMenu.set({
                                    stopX: 0
                                });
                            }else if(evt.pageX >= pageRight){
                                creationMenu.set({
                                    stopX: pageWidth
                                });
                            }else{
                                creationMenu.set({
                                    stopX: (evt.pageX - pageLeft)
                                });
                            }

                            if(evt.pageY > 0){
                                creationMenu.set({
                                    stopY: evt.pageY
                                });
                            }else{
                                creationMenu.set({
                                    stopY: 0
                                });
                            }
                            

                        }
                    },

                    onMouseUp = function(evt){
                        
                        if(dragging){

                            self.set({ interactionInProgress: false });

                            
                            SuperGlue.get('document').get('widthMarkers').set({ visible: widthMarkersVisible });
                            SuperGlue.get('document').get('grid').set({ visible: gridVisible });
                        
                            
                            if( !outOfBounds
                                &&(evt.pageX < startX - 50
                                || evt.pageX > startX + 50
                                || evt.pageY < startY - 50
                                || evt.pageY > startY + 50)
                            ){
                                creationMenu.do('showItems');
                            }else{
                                creationMenu.do('close');
                            }


                        }else{


                            if(SuperGlue.get('selection').do('isEmpty')){

                                if(creationMenu.get('active')){
                                    creationMenu.do('close');
                                }else{
                                    self.get('documentMenu').do('trigger', { x: evt.pageX, y: evt.pageY });
                                }

                            }else{

                                SuperGlue.get('selection').do('clearAll')

                            }

                        }
                        
                        document.removeEventListener('mousemove', onMouseMove, true);
                        document.removeEventListener('mouseup',   onMouseUp,   true);

                        evt.preventDefault();

                    };

                document.addEventListener('mousedown', onMouseDown, false);
                

            }
        }


    }


}});