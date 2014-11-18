SC.loadPackage({ 'WidgetLayerTop': {

    comment: 'I am the widget that brings the current selection to the top of layering.',

    traits:  ['Widget'],

    sharedProperties: {

        widgetMenu:  { initValue: '<div class="sg-editing-widget-container"><button id="sg-editing-widget-layerTop" class="sg-editing-widget-button" title="to top layer / [shift] upwards"></button></div>' }

    },

    methods: {

    	init: { 
    		comment: 	'I init the widget.',
    		code: 		function(theSelection){

                this.delegate('Widget', 'init', theSelection);
                this.set({ isActionButton: true });


                var self = this,
                    onMouseUp = function(evt){

                        self.do('action', (evt.shiftKey || evt.ctrlKey))

                    };

                this.get('widgetButton').addEventListener('mouseup', onMouseUp, false)




    		}

    	},

        action: {
            comment: 'I do the job',
            code: function(modifierKey){

                var elements         = SuperGlue.get('selection').get('elements'),
                    pageContainer    = SuperGlue.get('document').get('pageContainer'),
                    documentChilds   = SuperGlue.get('document').get('children'),
                    selectionHasGaps = false,
                    elementsToMove   = [];


                if(documentChilds.length <= 1){ 
                    return;
                }

                SuperGlue.get('history').do('actionHasStarted', this.do('createState'));

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

                SuperGlue.get('history').do('actionHasSucceeded', this.do('createState'));


            }
        },


        createState: {
            comment: 'I create a reflection function to restore a state.',
            code: function(){

                return  (function(children){

                            var savedElements = children.slice();
                            
                            return function(){

                                SuperGlue.get('document').set({ children: savedElements });

                                var pageContainer = SuperGlue.get('document').get('pageContainer');

                                while(pageContainer.firstChild){
                                    pageContainer.removeChild(pageContainer.firstChild);
                                }

                                for(var i = 0, l = savedElements.length; i < l; i++){
                                    pageContainer.appendChild(savedElements[i].get('node'));
                                }
                                
                            }
                        }).call(this, SuperGlue.get('document').get('children'));


            }

        }


    }


}});