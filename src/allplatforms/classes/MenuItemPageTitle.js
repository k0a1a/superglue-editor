SC.loadPackage({ 'MenuItemPageTitle': {

    comment: 'I am the MenuItem for the page title.',

    traits:  ['MenuItem'],

    sharedProperties: {

        menuContainer:  { initValue: '<div class="sg-editing-menu-container"><button id="sg-editing-menu-pageTitle" class="sg-editing-menu-button"></button></div>' },

        menuPanel:    { initValue:   '<div id="sg-editing-menu-pageTitle-panel">'
                                            +'<div class="sg-editing-menu-panel">'
                                                +'<div class="sg-menu-triangle-right"></div>'
                                                +'<input  id="sg-editing-menu-pageTitle-input" type="text"></input>'
                                                +'<button id="sg-editing-menu-pageTitle-clear" class="sg-editing-menu-button"></button>'
                                            +'</div>'
                                        +'</div>' }

    },

    properties: {

        menuPanel:    { comment: 'I store the DOMElement containing the panel of controls of the menu.' },

        isMenuItemActive: { comment: 'Wether the MenuItem is active.',
                          transform: function(aBoolean){

                                if(aBoolean){

                                    if(this.get('menuPanel').parentNode !== this.get('menuContainer')){
                                        this.get('menuContainer').appendChild(this.get('menuPanel'));
                                    }
                                    this.get('menuContainer').classList.add('active');

                                    this.get('menuPanel').querySelector('#sg-editing-menu-pageTitle-input').value = (
                                        document.getElementsByTagName('title')[0].innerHTML
                                    );
                                    

                                }else{

                                    if(this.get('menuPanel').parentNode === this.get('menuContainer')){
                                        this.get('menuContainer').removeChild(this.get('menuPanel'));
                                    }
                                    this.get('menuContainer').classList.remove('active');
                                
                                }
                                return aBoolean
                          }
                        }

    },

    methods: {

    	init: { 
    		comment: 	'I init the MenuItem.',
    		code: 		function(theDocumentMenu){

                this.delegate('MenuItem', 'init', theDocumentMenu);

                var self = this,
                    menuPanel = (new DOMParser()).parseFromString(this.class.get('menuPanel'), 'text/html').body.firstChild;
                


                menuPanel.querySelector('#sg-editing-menu-pageTitle-input').addEventListener('mouseup', function(evt){
                    theDocumentMenu.set({ activeMenuItem: self });
                    evt.stopPropagation();
                }, false);

                menuPanel.querySelector('#sg-editing-menu-pageTitle-input').addEventListener('input', function(evt){
                    self.do('setPageTitle', this.value)
                }, false);

                menuPanel.querySelector('#sg-editing-menu-pageTitle-clear').addEventListener('mouseup', function(evt){
                    theDocumentMenu.set({ activeMenuItem: self });
                    evt.stopPropagation();

                    menuPanel.querySelector('#sg-editing-menu-pageTitle-input').value = '';
                    self.do('setPageTitle', '');
                }, false);


                this.set({ 
                    menuPanel: menuPanel
                });


    		}

    	},

        setPageTitle: {
            comment: 'I set the page title.',
            code: function(titleString){

                document.getElementsByTagName('title')[0].innerHTML = titleString;

            }
        }


    }


}});