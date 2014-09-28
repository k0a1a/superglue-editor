SC.loadPackage({ 'Selection': {

    comment: 'I represent the selection of the editing tool, holding one or more Elements. I selection can move its Elements, it shows the Widgets, that apply to all of the Elements in the current selection, and it can start the content editing mode of one of its Elements.',

    sharedProperties: {
        selectionTools: { initValue: '<div class="sg-editing-selection"><div class="sg-editing-selection-widget-menu-right"></div><div class="sg-editing-selection-widget-menu-bottom"></div></div>' },
    },

    properties: {

        node:       { comment: 'My DOM node.' },
        elements:   { comment: 'I hold an array of the currently selected elements.' },
        active:     { comment: 'Wether a selection is active or not.' },

        widgetsRight:    { comment: 'I hold an array of the standard widgets, which are applicable to all elements, and which are shown on the right side of the selection.'},
        widgetsBottom:   { comment: 'I hold an array of the widgets, which are applicable to the elements in the current selection, and which are shown on the bottom of the selection.'},
        menuNodeRight:   { comment: 'I hold the DOM node containing the right menu node.'},
        menuNodeBottom:  { comment: 'I hold the DOM node containing the bottom menu node.'},

        activeWidget:    { comment: 'I store either null or the active (selected) widget.'},

        lockWidget:      { comment: 'My lockWidget plays a special role, since it appears only on multiple selections and must update its state.'}

    },

    methods: {

        init: { 
            comment:    'I init myself.',
            code:       function(){

                var node = (new DOMParser()).parseFromString(this.class.get('selectionTools'), 'text/html').body.firstChild;

                this.set({ 
                    node:            node,
                    menuNodeRight:   node.firstChild,
                    menuNodeBottom:  node.lastChild,
                    widgetsRight:    [],
                    widgetsBottom:   [],
                    active:          false,
                    elements:        [],
                    activeWidget:    null
                });

                var generalWidgets          = ['WidgetLayerTop', 'WidgetLayerBottom', 'WidgetEditHTML', 'WidgetCopy', 'WidgetDelete'],
                    generalWidgetsContainer = this.get('menuNodeRight'),
                    widget = null;

                for(var i = 0, l = generalWidgets.length; i < l; i++){
                    widget = SC.init(generalWidgets[i], this);
                    this.get('widgetsRight').push(widget);
                    generalWidgetsContainer.appendChild(widget.get('widgetMenu'));
                }


                this.set({ lockWidget: SC.init('WidgetLock', this) });
                    


            }
        },

        updateWidgetMenu: { 
            comment:    'I update the menu of widgets according to the current selection.',
            code:       function(){

                // Update widget menu to the bottom

                var elements                = this.get('elements'),
                    elementsWidgetSets      = [],
                    currentWidgets          = [],
                    currentWidgetsClasses   = null,
                    currentWidgetsContainer = this.get('menuNodeBottom'),
                    widget = null;


                
                for(var widgetsBottom = this.get('widgetsBottom'), i = 0, l = widgetsBottom.length;
                    i < l; i++){

                    widgetsBottom[i].set({ isWidgetActive: false });
                    currentWidgetsContainer.removeChild(widgetsBottom[i].get('widgetMenu'));
                }

                if(elements.length > 0){
                    
                    // find intersection of applicable widgets
                    for(var i = 0, l = elements.length; i < l; i++){
                        elementsWidgetSets.push( elements[i].class.get('applicableWidgets') );
                    }
                    
                    if(elementsWidgetSets.length > 1){
                        currentWidgetsClasses = elementsWidgetSets.shift().filter(function(v) {
                            return elementsWidgetSets.every(function(a) {
                                return a.indexOf(v) !== -1;
                            });
                        });
                    }else{
                        currentWidgetsClasses = elementsWidgetSets[0];
                    }

                    for(var i = 0, l = currentWidgetsClasses.length; i < l; i++){
                        widget = SC.init(currentWidgetsClasses[i], this);
                        currentWidgets.push(widget);
                        currentWidgetsContainer.appendChild(widget.get('widgetMenu'));
                    }

                }

                this.set({ 
                    widgetsBottom: currentWidgets,
                    activeWidget:  null
                });



                // Update widget to the right

                this.do('updateLockGroup');



                // Finally draw red outline when multiple elements are selected
                if(elements.length === 1){
                    this.get('node').classList.remove('sg-editing-selection-outline');
                }else{
                    this.get('node').classList.add('sg-editing-selection-outline');
                }

            }
        },


        updateLockGroup: {

            comment:    'After adding and removing elements, I check wether I have multiple elements, and if so, if they form a locked group or not.',
            code:       function(){

                var myElements    = this.get('elements'),
                    lockWidget    = this.get('lockWidget'),
                    menuNodeRight = this.get('menuNodeRight'),
                    isGroup       = true;

                if(myElements.length > 1){

                    // check and add lockWidget
                    if(lockWidget.get('widgetMenu').parentNode !== menuNodeRight){
                        menuNodeRight.insertBefore(lockWidget.get('widgetMenu'), menuNodeRight.childNodes[0]);
                    }

                    // check group status of myElements
                    for(var i = 0, l = myElements.length; i < l; i++){
                        isGroup = isGroup && (myElements[i].get('group') !== null);
                    }
                    if(isGroup){
                        for(var i = 1, l = myElements.length; i < l; i++){
                            isGroup = isGroup && (myElements[i].get('group') === myElements[i-1].get('group'))
                        }
                    }
                    lockWidget.set({ locked: isGroup })


                }else if(myElements.length > 0){

                    // remove lockWidget
                    if(lockWidget.get('widgetMenu').parentNode === menuNodeRight){
                        menuNodeRight.removeChild(lockWidget.get('widgetMenu'));
                    }

                }


            }

        },


        callWidgetAction: {
            comment: 'I call a widget object\'s action',
            code: function(config){

                if(this.do('isEmpty')){
                    return;
                }

                var widget = (function(){

                                    var widgetsRight  = this.get('widgetsRight'),
                                        widgetsBottom = this.get('widgetsBottom');

                                    for(var i = 0, l = widgetsRight.length; i < l; i++){
                                        if(widgetsRight[i].class() === config.widget){
                                            return widgetsRight[i];
                                        }
                                    }

                                    for(var i = 0, l = widgetsBottom.length; i < l; i++){
                                        if(widgetsBottom[i].class() === config.widget){
                                            return widgetsBottom[i];
                                        }
                                    }

                                    if('WidgetLock' === config.widget){
                                        return this.get('lockWidget');
                                    }

                                }).call(this);

                if(!widget){
                    return;
                }

                widget.do('action', config.modifier)
                
            }
        },


        addElement: { 
            comment:    'I add anElement to myself.',
            code:       function(anElement){

                var elementsToAdd = [ anElement ],
                    myElements    = this.get('elements'),
                    group         = anElement.get('group');

                if(group !== null){

                    for(var elements = SuperGlue.get('document').get('children'),
                            i = 0, l = elements.length; i < l; i++){

                        if(elements[i].get('group') === group){
                            elementsToAdd.push(elements[i]);
                        }

                    }

                }

                for(var i = 0, l = elementsToAdd.length; i < l; i++){
                    if(myElements.indexOf(elementsToAdd[i]) < 0){
                        myElements.push(elementsToAdd[i]);

                    }
                }

                
                if(myElements.length === 1){
                    myElements[0].get('resizeHandles').set({ selected: true });
                    myElements[0].get('resizeHandles').do('showResizeHandles');
                }else{
                    for(var i = 0, l = myElements.length; i < l; i++){
                        myElements[i].get('resizeHandles').set({ selected: false });
                    }
                }

                if(!this.get('active')){
                    SuperGlue.get('document').get('editingContainer').appendChild(this.get('node'));
                }
                this.do('updateDimensions');
                this.do('updateWidgetMenu');

                

            }
        },

        removeElement: { 
            comment:    'I remove anElement from myself.',
            code:       function(anElement){

                var myElements       = this.get('elements'),
                    elementsToRemove = [ anElement ],
                    group            = anElement.get('group');

                if(group !== null){

                    for(var i = 0, l = myElements.length; i < l; i++){

                        if(myElements[i].get('group') === group){
                            elementsToRemove.push(myElements[i]);
                        }

                    }

                }

                for(var i = 0, l = elementsToRemove.length; i < l; i++){
                    var elementIndex = myElements.indexOf(elementsToRemove[i]);
                    if(elementIndex >= 0){
                        myElements.splice(elementIndex, 1);
                        elementsToRemove[i].get('resizeHandles').set({ selected: false, mouseOnElement: false });
                        elementsToRemove[i].get('resizeHandles').do('hideResizeHandles', true);
                    }
                }

                
                
                if(myElements.length === 0){
                    SuperGlue.get('document').get('editingContainer').removeChild(this.get('node'));
                    this.set({ active: false });
                }else{

                    if(myElements.length === 1){
                        myElements[0].get('resizeHandles').set({ selected: true });
                        myElements[0].get('resizeHandles').do('showResizeHandles');
                    }else{
                        for(var i = 0, l = myElements.length; i < l; i++){
                            myElements[i].get('resizeHandles').set({ selected: false });
                        }
                    }

                    this.do('updateDimensions');
                    this.do('updateWidgetMenu');
                }



            }
        },

        toggleSelectionFor: { 
            comment:    'I check wether anElement belongs to me already, and then add or remove it.',
            code:       function(anElement){

                if(this.get('elements').indexOf(anElement) > -1){
                    this.do('removeElement', anElement);
                }else{
                    this.do('addElement', anElement);
                }

            }
        },

        clearAll: { 
            comment:    'I remove all my Elements.',
            code:       function(){

                var elements = this.get('elements');
                for(var i = 0, l = elements.length; i < l; i++){
                    elements[i].get('resizeHandles').set({ selected: false, mouseOnElement: false });
                    elements[i].get('resizeHandles').do('hideResizeHandles', true)
                }

                var widgetsBottom = this.get('widgetsBottom');
                for(var i = 0, l = widgetsBottom.length; i < l; i++){
                    widgetsBottom[i].set({ isWidgetActive: false });
                }

                var editingContainer = SuperGlue.get('document').get('editingContainer');
                if(this.get('node').parentNode === editingContainer){
                    editingContainer.removeChild(this.get('node'));
                }

                this.set({
                    elements: [],
                    active: false
                });
                

            }
        },

        isEmpty: { 
            comment:    'Am I empty?',
            code:       function(){
                return this.get('elements').length === 0
            }
        },

        calculateDimensions: { 
            comment:    'I return the overall dimension to fit in all my Elements in the form [top, left, width, height].',
            code:       function(){

                if(this.do('isEmpty')){ return []; }
                
                var myElements = this.get('elements'),
                    top        = myElements[0].get('top'),
                    left       = myElements[0].get('left'),
                    width      = 0,
                    height     = 0,
                    l          = myElements.length;
                for(var i = 0; i < l; i++){
                    top        = myElements[i].get('top') < top ? myElements[i].get('top') : top;
                    left       = myElements[i].get('left') < left ? myElements[i].get('left') : left;
                    width      = (myElements[i].get('width') + myElements[i].get('left')) < width 
                                  ? width
                                  : (myElements[i].get('width') + myElements[i].get('left'));
                    height     = (myElements[i].get('height') + myElements[i].get('top')) < height 
                                  ? height 
                                  : (myElements[i].get('height') + myElements[i].get('top'));
                }
                width -= left;
                height -= top;
                
                return [top, left, width, height];

            }
        },

        updateDimensions: { 
            comment:    'I update the overall dimension of my DOM node to fit in all my Elements.',
            code:       function(){

                if(this.do('isEmpty')){ return; }
                
                var nodeStyle  = this.get('node').style,
                    dimensions = this.do('calculateDimensions'),
                    top        = dimensions[0],
                    left       = dimensions[1],
                    width      = dimensions[2],
                    height     = dimensions[3];
                
                nodeStyle.top = top + 'px';
                nodeStyle.left = left + 'px';
                nodeStyle.width = width + 'px';
                nodeStyle.height = height + 'px';

            }
        },





        registerForSelection: { 
            comment:    'I prepare an Element to be selectable. Used by Element>>init.',
            code:       function(anElement){



                var self           = this,
                    myNode         = this.get('node'),
                    thisElement             = anElement,
                    elementNode             = anElement.get('node'),
                    elements                = [],
                    
                    infiniteSpace  = true,
                    pageWidth      = 0,
                    virtualTop     = 0,
                    virtualLeft    = 0,
                    virtualWidth   = 0,
                    virtualHeight  = 0,

                    elementsOffsetsX = null,
                    elementsOffsetsY = null,

                    targetNotInSelection,

                    isGroup,
                    group,

                    startX         = 0,
                    startY         = 0,

                    clickPrecisionXleft   = 0,
                    clickPrecisionXright  = 0,
                    clickPrecisionYtop    = 0,
                    clickPrecisionYbottom = 0,
                    withinClickPrecision  = true,

                    widthMarkersVisible,
                    gridVisible,

                    onMouseDown = function(evt){

                        if(evt.button !== 0) return;

                        if(evt.shiftKey || evt.ctrlKey){

                            document.addEventListener('mouseup', onMouseUpWithModifier, true);
                            SuperGlue.get('document').set({ interactionInProgress: true });
                            // UNDO

                        }else{

                            startX   = evt.pageX;
                            startY   = evt.pageY;
                            
                            clickPrecisionXleft   = startX - 6;
                            clickPrecisionXright  = startX + 6;
                            clickPrecisionYtop    = startY - 6;
                            clickPrecisionYbottom = startY + 6;
                            withinClickPrecision  = true;

                            isGroup = false;

                            infiniteSpace = ! SuperGlue.get('document').get('layout').centered;
                            pageWidth     = SuperGlue.get('document').get('layout').width;
                            if(SuperGlue.get('document').get('grid').get('active')){
                                var gridSize = SuperGlue.get('document').get('grid').get('gridSize');
                                pageWidth = Math.floor(pageWidth / gridSize) * gridSize;
                            }


                            elements = self.get('elements');
                            
                            if(elements.length !== 0){

                                targetNotInSelection = true;
                                for(var i = 0, l = elements.length; i < l; i++){
                                    if(elements[i].get('node') === thisElement.get('node')){
                                        targetNotInSelection = false;
                                        break;
                                    }
                                }
                                if(targetNotInSelection){
                                    self.do('clearAll');
                                    elements = self.get('elements');
                                }

                            }else{
                                targetNotInSelection = elements.indexOf(thisElement) < 0;
                            }

                            if(elements.length === 0){

                                group = thisElement.get('group');

                                if(group !== null){

                                    isGroup = true;

                                    for(var allElements = SuperGlue.get('document').get('children'),
                                            i = 0, l = allElements.length; i < l; i++){

                                        if(allElements[i].get('group') === group){
                                            elements.push(allElements[i]);
                                        }

                                    }

                                    

                                }

                            }

                            if(elements.length === 0){

                                virtualTop    = anElement.get('top');
                                virtualLeft   = anElement.get('left');
                                virtualWidth  = anElement.get('width');
                                virtualHeight = anElement.get('height');

                            }else{

                                var dimensions = self.do('calculateDimensions');
                                virtualTop     = dimensions[0];
                                virtualLeft    = dimensions[1];
                                virtualWidth   = dimensions[2];
                                virtualHeight  = dimensions[3];

                                elementsOffsetsX = [];
                                elementsOffsetsY = [];
                                for(var i = 0, l = elements.length; i < l; i++){
                                    elementsOffsetsX.push( elements[i].get('left') - virtualLeft );
                                    elementsOffsetsY.push( elements[i].get('top')  - virtualTop  );
                                }

                            }

                            
                            document.addEventListener('mousemove', onMouseMove, true);
                            document.addEventListener('mouseup',   onMouseUp,   true);
                            SuperGlue.get('document').set({ interactionInProgress: true });
                            // UNDO

                        }

                        evt.stopPropagation();
                        evt.preventDefault();


                    },

                    onMouseUpWithModifier = function(evt){

                        self.do('toggleSelectionFor', thisElement);
                        document.removeEventListener('mouseup', onMouseUpWithModifier, true);
                        SuperGlue.get('document').set({ interactionInProgress: false });
                        
                        // UNDO
                        
                        evt.stopPropagation();
                        evt.preventDefault();
                    },

                    onMouseUp = function(evt){

                        document.removeEventListener('mousemove', onMouseMove, true);
                        document.removeEventListener('mouseup',   onMouseUp,   true);
                        
                        var myDocument = SuperGlue.get('document');
                        myDocument.set({ interactionInProgress: false });
                        myDocument.do('afterLayoutHasChanged');


                        if(withinClickPrecision){
                            
                            if(     !targetNotInSelection
                                &&  thisElement.class() === 'TextElement'
                            ){

                                thisElement.do('activateTextEditor');

                            }else{
                                
                                self.do('clearAll');
                                self.do('addElement', thisElement);

                            }
                            

                        }else{

                            (function(elements, thisElement){

                                var savedDimensions = []

                                if(elements.length === 0){
                                    savedDimensions.push({
                                        top:    thisElement.get('top'),
                                        left:   thisElement.get('left'),
                                        width:  thisElement.get('width'),
                                        height: thisElement.get('height')
                                    })
                                }else{
                                    for(var i = 0, l = elements.length; i < l; i++){
                                        savedDimensions.push({
                                            top:    elements[i].get('top'),
                                            left:   elements[i].get('left'),
                                            width:  elements[i].get('width'),
                                            height: elements[i].get('height')
                                        })
                                    }
                                }

                                SuperGlue.get('history').do('actionHasSucceeded', function(){
                                    if(elements.length === 0){
                                        thisElement.set({
                                            top:    savedDimensions[0].top,
                                            left:   savedDimensions[0].left,
                                            width:  savedDimensions[0].width,
                                            height: savedDimensions[0].height
                                        })
                                    }else{
                                        for(var i = 0, l = elements.length; i < l; i++){
                                            elements[i].set({
                                                top:    savedDimensions[i].top,
                                                left:   savedDimensions[i].left,
                                                width:  savedDimensions[i].width,
                                                height: savedDimensions[i].height
                                            })
                                        }
                                    }
                                })

                            }).call(this, elements, thisElement)

                            SuperGlue.get('document').get('widthMarkers').set({ visible: widthMarkersVisible });
                            SuperGlue.get('document').get('grid').set({ visible: gridVisible });

                            if(isGroup){
                                self.do('clearAll');
                            }
                        }


                        // UNDO
                        
                        evt.stopPropagation();
                        evt.preventDefault();

                    },

                    onMouseMove = function(evt){

                        var diffX = evt.pageX - startX,
                            diffY = evt.pageY - startY;

                        

                        if( withinClickPrecision &&
                            (    evt.pageX < clickPrecisionXleft
                              || evt.pageX > clickPrecisionXright
                              || evt.pageY < clickPrecisionYtop
                              || evt.pageY > clickPrecisionYbottom )
                        ){
                            var widthMarkers = SuperGlue.get('document').get('widthMarkers'),
                                grid         = SuperGlue.get('document').get('grid');
                            widthMarkersVisible = widthMarkers.get('visible');
                            gridVisible         = grid.get('visible');
                            widthMarkers.set({ visible: true });
                            grid.set({ visible: true });

                            (function(elements, thisElement){

                                var savedDimensions = []

                                if(elements.length === 0){
                                    savedDimensions.push({
                                        top:    thisElement.get('top'),
                                        left:   thisElement.get('left'),
                                        width:  thisElement.get('width'),
                                        height: thisElement.get('height')
                                    })
                                }else{
                                    for(var i = 0, l = elements.length; i < l; i++){
                                        savedDimensions.push({
                                            top:    elements[i].get('top'),
                                            left:   elements[i].get('left'),
                                            width:  elements[i].get('width'),
                                            height: elements[i].get('height')
                                        })
                                    }
                                }

                                SuperGlue.get('history').do('actionHasStarted', function(){
                                    if(elements.length === 0){
                                        thisElement.set({
                                            top:    savedDimensions[0].top,
                                            left:   savedDimensions[0].left,
                                            width:  savedDimensions[0].width,
                                            height: savedDimensions[0].height
                                        })
                                    }else{
                                        for(var i = 0, l = elements.length; i < l; i++){
                                            elements[i].set({
                                                top:    savedDimensions[i].top,
                                                left:   savedDimensions[i].left,
                                                width:  savedDimensions[i].width,
                                                height: savedDimensions[i].height
                                            })
                                        }
                                    }
                                })

                            }).call(this, elements, thisElement)


                            withinClickPrecision = false;
                        }


                        if(!withinClickPrecision){


                            virtualTop  += diffY;
                            virtualLeft += diffX;


                            if(elements.length === 0){

                                if(virtualTop > 0){
                                    thisElement.set({ top: virtualTop });
                                }else{
                                    thisElement.set({ top: 0 });
                                }

                                if(virtualLeft > 0){
                                    if(infiniteSpace || (virtualLeft + virtualWidth < pageWidth) ){
                                        thisElement.set({ left: virtualLeft });
                                    }else{
                                        thisElement.set({ left: (pageWidth - virtualWidth) });
                                    }
                                }else{
                                    thisElement.set({ left: 0 });
                                }
                                

                            }else{



                                if(virtualTop > 0){
                                    for(var i = 0, l = elements.length; i < l; i++){
                                        elements[i].set({
                                            top:  elementsOffsetsY[i] + virtualTop
                                        });
                                    }
                                    self.do('updateDimensions');
                                }else{
                                    myNode.style.top  = '0px';
                                    for(var i = 0, l = elements.length; i < l; i++){
                                        elements[i].set({
                                            top:  elementsOffsetsY[i]
                                        });
                                    }
                                }

                                if(virtualLeft > 0){
                                    if(infiniteSpace || (virtualLeft + virtualWidth < pageWidth) ){
                                        for(var i = 0, l = elements.length; i < l; i++){
                                            elements[i].set({
                                                left:  elementsOffsetsX[i] + virtualLeft
                                            });
                                        }
                                        self.do('updateDimensions');
                                    }else{
                                        myNode.style.left  = (pageWidth - virtualWidth) + 'px';
                                        for(var i = 0, l = elements.length; i < l; i++){
                                            elements[i].set({
                                                left:  elementsOffsetsX[i] + (pageWidth - virtualWidth)
                                            });
                                        }
                                    }
                                }else{
                                    myNode.style.left  = '0px';
                                    for(var i = 0, l = elements.length; i < l; i++){
                                        elements[i].set({
                                            left:  elementsOffsetsX[i]
                                        });
                                    }
                                }


                                

                            }

                            startX = evt.pageX;
                            startY = evt.pageY;
                            

                        }

                       
                        evt.stopPropagation();
                        evt.preventDefault();

                    };

                elementNode.addEventListener('mousedown', onMouseDown, false);


            }
        }

    }


}});