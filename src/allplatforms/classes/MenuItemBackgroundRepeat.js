SC.loadPackage({ 'MenuItemBackgroundRepeat': {

    comment: 'I am the MenuItem for the background-repeat of the page.',

    traits:  ['MenuItem'],

    sharedProperties: {

        menuContainer:  { initValue: '<div class="sg-editing-menu-container"><button id="sg-editing-menu-backgroundRepeat" class="sg-editing-menu-button" title="repeat background image"></button></div>' },

        menuPanel: { initValue: '<div id="sg-editing-menu-backgroundRepeat-panel">'
                                        +'<div class="sg-editing-menu-panel">'
                                            +'<div class="sg-menu-triangle-right"></div>'
                                            +'<button id="sg-editing-menu-backgroundRepeat-tile"  title="repeat"              data-superglue-backgroundRepeat="tile" class="sg-editing-menu-button"></button>'
                                            +'<button id="sg-editing-menu-backgroundRepeat-tileX" title="repeat horizontally" data-superglue-backgroundRepeat="tileX" class="sg-editing-menu-button"></button>'
                                            +'<button id="sg-editing-menu-backgroundRepeat-tileY" title="repeat vertically"   data-superglue-backgroundRepeat="tileY" class="sg-editing-menu-button"></button>'
                                        +'</div>'
                                    +'</div>' 
                     }


    },

    properties: {

        menuPanel:    { comment: 'I store the DOMElement containing the panel of controls of the menu.' },

        isMenuItemActive: { comment: 'Wether the menu is active.',
                          transform: function(aBoolean){

                                if(aBoolean){

                                    if(this.get('menuPanel').parentNode !== this.get('menuContainer')){
                                        this.get('menuContainer').appendChild(this.get('menuPanel'));
                                    }
                                    this.get('menuContainer').classList.add('active');

                                    // prepare undo
                                    this.set({ aValueWasChoosen: false });
                                    SuperGlue.get('history').do('actionHasStarted', this.do('createState'));


                                }else{

                                    if(this.get('menuPanel').parentNode === this.get('menuContainer')){
                                        this.get('menuContainer').removeChild(this.get('menuPanel'));
                                    }
                                    this.get('menuContainer').classList.remove('active');

                                    // finish undo
                                    if(this.get('aValueWasChoosen')){
                                        SuperGlue.get('history').do('actionHasSucceeded', this.do('createState'));
                                    }
                                    this.set({ aValueWasChoosen: false })
                                
                                }
                                return aBoolean
                          }
                        },

        aValueWasChoosen: { comment: 'Wether a value was choosen or not.' }

    },

    methods: {

    	init: { 
    		comment: 	'I init the MenuItem.',
    		code: 		function(theDocumentMenu){

                this.delegate('MenuItem', 'init', theDocumentMenu);

                var self = this,
                    menuPanel = (new DOMParser()).parseFromString(this.class.get('menuPanel'), 'text/html').body.firstChild,

                    onMouseUp = function(evt){

                        var newDim = this.getAttribute('data-superglue-backgroundRepeat');
                        
                        switch(newDim){
                            case 'tileX':
                                document.body.style.backgroundRepeat = 'repeat-x';
                                break;

                            case 'tileY':
                                document.body.style.backgroundRepeat = 'repeat-y';
                                break;

                            default:
                                document.body.style.backgroundRepeat = 'repeat';
                                break;
                        }

                        self.set({ aValueWasChoosen: true });

                        evt.stopPropagation();

                    },

                    buttons = menuPanel.querySelectorAll('.sg-editing-menu-button');


                for(var i = buttons.length - 1; i >= 0; i--){
                    buttons[i].addEventListener('mouseup', onMouseUp, false)
                }
                

                this.set({ 
                    menuPanel: menuPanel
                });


    		}

    	},


        createState: {
            comment: 'I create a reflection function to restore a state.',
            code: function(){

                return  (function(){
                            var savedValue = document.body.style.backgroundRepeat
                            return function(){
                                document.body.style.backgroundRepeat = savedValue
                            }
                        }).call(this);


            }
        }


    }


}});