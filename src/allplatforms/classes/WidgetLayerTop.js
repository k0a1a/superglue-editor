SC.loadPackage({ 'WidgetLayerTop': {

    comment: 'I am the widget that brings the current selection to the top of layering.',

    traits:  ['Widget'],

    sharedProperties: {

        widgetMenu:  { initValue: '<div class="sg-editing-widget-container"><button id="sg-editing-widget-layerTop" class="sg-editing-widget-button"></button></div>' }

    },

    methods: {

    	init: { 
    		comment: 	'I init the widget.',
    		code: 		function(theSelection){

                this.delegate('Widget', 'init', theSelection);
                this.set({ isActionButton: true });


                var self = this,
                    onMouseUp = function(evt){

                        var modifierKey      = evt.shiftKey || evt.ctrlKey,
                            elements         = SuperGlue.get('selection').get('elements'),
                            pageContainer    = SuperGlue.get('document').get('pageContainer'),
                            documentChilds   = SuperGlue.get('document').get('children'),
                            selectionHasGaps = false,
                            elementsToMove   = [];


                        if(documentChilds.length <= 1){ 
                            return;
                        }


                        if(elements.length === 1){

                            if(modifierKey){

                                SuperGlue.get('document').do('layerUp', elements[0]);

                            }else{

                                for(var i = documentChilds.indexOf(elements[0]), l = documentChilds.length;
                                    i < l; i++){
                                    SuperGlue.get('document').do('layerUp', elements[0]);
                                }

                            }
                            
                            

                        }else{


                            for(var i = 0, l = elements.length; i < l; i++){
                                elementsToMove.push({
                                    index: documentChilds.indexOf(elements[i]), 
                                    child: elements[i],
                                    gapAbove: null
                                });
                            }

                            elementsToMove.sort(function(a,b){ return a.index < b.index; });

                            for(var i = 1, l = elementsToMove.length; i < l; i++){
                                if(elementsToMove[i].index !== elementsToMove[i - 1].index - 1){
                                    selectionHasGaps = true;
                                    break;
                                }
                            }



                            if(selectionHasGaps){

                                for(var i = 1, l = elementsToMove.length; i < l; i++){
                                    elementsToMove[i].gapAbove = elementsToMove[0].index - i - elementsToMove[i].index;
                                }

                                for(var i = 1, l = elementsToMove.length; i < l; i++){
                                    for(var k = elementsToMove[i].gapAbove; k > 0; k--){
                                        SuperGlue.get('document').do('layerUp', elementsToMove[i].child);
                                    }
                                }


                            }else{


                                if(elementsToMove[0].index >= documentChilds.length - 1){
                                    return;
                                }

                                if(modifierKey){

                                    for(var i = 0, l = elementsToMove.length; i < l; i++){
                                        SuperGlue.get('document').do('layerUp', elementsToMove[i].child);
                                    }

                                }else{

                                    for(var n = elementsToMove[0].index + 1, k = documentChilds.length;
                                        n < k; n++){

                                        for(var i = 0, l = elementsToMove.length; i < l; i++){
                                            SuperGlue.get('document').do('layerUp', elementsToMove[i].child);
                                        }

                                    }

                                }


                            }



                        }

                        

                    };

                this.get('widgetButton').addEventListener('mouseup', onMouseUp, false)




    		}

    	}


    }


}});