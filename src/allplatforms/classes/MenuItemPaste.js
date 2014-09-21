SC.loadPackage({ 'MenuItemPaste': {

    comment: 'I am the MenuItem for pasting from the clipboard.',

    traits:  ['MenuItem'],

    sharedProperties: {

        menuContainer:  { initValue: '<div class="sg-editing-menu-container"><button id="sg-editing-menu-paste" class="sg-editing-menu-button"></button></div>' }

    },

    methods: {

    	init: { 
    		comment: 	'I init the MenuItem.',
    		code: 		function(theDocumentMenu){

                this.delegate('MenuItem', 'init', theDocumentMenu);
                this.set({ isActionButton: true });

                this.get('menuButton').addEventListener('mouseup', function(){

                    SuperGlue.get('clipboard').do('paste', function(pasteData){

                        var domNodes, newNode, newChild, offset;

                        try{
                            domNodes = (new DOMParser()).parseFromString(pasteData, 'text/html').body.children;
                            domNodes = Array.prototype.slice.call(domNodes);
                        }catch(e){
                            return;
                        }


                        offset = SuperGlue.get('document').get('grid').get('active') 
                                    ? SuperGlue.get('document').get('grid').get('gridSize')
                                    : 10;

                        SC.setHandlerForMessageNotUnderstood(function(message, reason, params){
                            throw new Error('SC: Message not understood: ' + message + '; ' + reason);
                        });

                        for(var i = 0, l = domNodes.length; i < l; i++){

                            newNode = domNodes[i];

                            newNode.removeAttribute('data-superglue-group')

                            try{

                                SuperGlue.get('document').get('pageContainer').appendChild(newNode);

                                newChild = SC.do('Element', 'awakeFromDOM', newNode)
                                newChild.set({
                                    top:    newChild.get('top')  + offset,
                                    left:   newChild.get('left') + offset
                                })

                            }catch(e){
                                SuperGlue.get('document').get('pageContainer').removeChild(newNode);
                                continue;
                            }

                            SuperGlue.get('document').get('children').push(newChild);
                            SuperGlue.get('document').do('afterLayoutHasChanged');

                        }

                        SC.setHandlerForMessageNotUnderstood();

                        theDocumentMenu.do('close');


                    });

                }, false)

    		}

    	}


    }


}});