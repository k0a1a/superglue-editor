SC.loadPackage({ 'MenuItemSaveRemote': {

    comment: 'I am the MenuItem for saving the page to a remote URL.',

    traits:  ['MenuItem'],

    sharedProperties: {

        menuContainer:  { initValue: '<div class="sg-editing-menu-container"><button id="sg-editing-menu-saveRemote" class="sg-editing-menu-button" title="save page to other server"></button></div>' },

        menuPanel:    { initValue:   '<div id="sg-editing-menu-saveRemote-panel">'
                                            +'<div class="sg-editing-menu-panel">'
                                                +'<div class="sg-menu-triangle-top"></div>'
                                                +'<input  id="sg-editing-menu-saveRemote-input" type="text" placeholder="http://mydomain/mypage.html"></input>'
                                                +'<button id="sg-editing-menu-saveRemote-confirm" class="sg-editing-menu-button"></button>'
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
                


                menuPanel.querySelector('#sg-editing-menu-saveRemote-input').addEventListener('mouseup', function(evt){
                    theDocumentMenu.set({ activeMenuItem: self });
                    evt.stopPropagation();
                }, false);

                menuPanel.querySelector('#sg-editing-menu-saveRemote-confirm').addEventListener('mouseup', function(evt){
                    theDocumentMenu.set({ activeMenuItem: self });
                    evt.stopPropagation();

                    self.do('saveRemote', menuPanel.querySelector('#sg-editing-menu-saveRemote-input').value);
                }, false);


                this.set({ 
                    menuPanel: menuPanel
                });


    		}

    	},

        saveRemote: {
            comment: 'I set the page title.',
            code: function(titleString){

                var url    = this.get('menuPanel').querySelector('#sg-editing-menu-saveRemote-input').value,
                    parser = document.createElement('a');
                    
                parser.href = url;
                
                SuperGlue.do('savePage', {
                    remote: parser.protocol + '//' + parser.host,
                    path:   parser.pathname
                })

            }
        }


    }


}});