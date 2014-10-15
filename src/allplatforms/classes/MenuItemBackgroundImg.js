SC.loadPackage({ 'MenuItemBackgroundImg': {

    comment: 'I am the MenuItem for the background-image of the page.',

    traits:  ['MenuItem'],

    sharedProperties: {

        menuContainer:  { initValue: '<div class="sg-editing-menu-container"><button id="sg-editing-menu-backgroundImg" class="sg-editing-menu-button" title="background image"></button></div>' },

        menuPanel:    { initValue:   '<div id="sg-editing-menu-backgroundImg-panel">'
                                            +'<div class="sg-editing-menu-panel">'
                                                +'<div class="sg-menu-triangle-right"></div>'
                                                +'<input  id="sg-editing-menu-backgroundImg-input" type="text"></input>'
                                                +'<button id="sg-editing-menu-backgroundImg-chooseFile" class="sg-editing-menu-button"></button>'
                                                +'<button id="sg-editing-menu-backgroundImg-clear" class="sg-editing-menu-button"></button>'
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

                                    var srcURL = document.body.style.backgroundImage
                                                    .split('url("').join('').split('")').join('')
                                                    .split('url(').join('').split(')').join('')
                                                    .replace(document.location.origin, '');
                                    
                                    this.get('menuPanel').querySelector('#sg-editing-menu-backgroundImg-input').value = srcURL;

                                    // prepare undo
                                    this.set({ aImgWasChoosen: false });
                                    SuperGlue.get('history').do('actionHasStarted', this.do('createState'));
                                    

                                }else{

                                    if(this.get('menuPanel').parentNode === this.get('menuContainer')){
                                        this.get('menuContainer').removeChild(this.get('menuPanel'));
                                    }
                                    this.get('menuContainer').classList.remove('active');

                                    // finish undo
                                    if(this.get('aImgWasChoosen')){
                                        SuperGlue.get('history').do('actionHasSucceeded', this.do('createState'));
                                    }
                                    this.set({ aImgWasChoosen: false })
                                
                                }
                                return aBoolean
                          }
                        },

        aImgWasChoosen: { comment: 'Wether a color was choosen or not.' }

    },


    methods: {

    	init: { 
    		comment: 	'I init the MenuItem.',
    		code: 		function(theDocumentMenu){

                this.delegate('MenuItem', 'init', theDocumentMenu);

                var self = this,
                    menuPanel = (new DOMParser()).parseFromString(this.class.get('menuPanel'), 'text/html').body.firstChild;
                


                menuPanel.querySelector('#sg-editing-menu-backgroundImg-input').addEventListener('mouseup', function(evt){
                    theDocumentMenu.set({ activeMenuItem: self });
                    evt.stopPropagation();
                }, false);

                menuPanel.querySelector('#sg-editing-menu-backgroundImg-input').addEventListener('input', function(evt){
                    self.do('setBackgroundImg', this.value)
                }, false);

                menuPanel.querySelector('#sg-editing-menu-backgroundImg-chooseFile').addEventListener('mouseup', function(evt){
                    theDocumentMenu.set({ activeMenuItem: self });
                    evt.stopPropagation();

                    var pathParser = document.createElement('a');
                    pathParser.href = menuPanel.querySelector('#sg-editing-menu-backgroundImg-input').value;

                    SuperGlue.get('fileManager').do('chooseFile', {
                        oldPath: pathParser.pathname,
                        callback: function(srcPath){
                                        menuPanel.querySelector('#sg-editing-menu-backgroundImg-input').value = srcPath;
                                        self.do('setBackgroundImg', srcPath);
                                    }
                    });
                }, false);

                menuPanel.querySelector('#sg-editing-menu-backgroundImg-clear').addEventListener('mouseup', function(evt){
                    theDocumentMenu.set({ activeMenuItem: self });
                    evt.stopPropagation();

                    menuPanel.querySelector('#sg-editing-menu-backgroundImg-input').value = '';
                    self.do('setBackgroundImg', '');
                }, false);


                this.set({ 
                    menuPanel: menuPanel
                });


    		}

    	},

        setBackgroundImg: {
            comment: 'I set the source of the body background-image',
            code: function(srcURL){

                document.body.style.backgroundImage = srcURL === '' ? '' : 'url("' + srcURL + '")';

                this.set({ aImgWasChoosen: true });

            }
        },


        createState: {
            comment: 'I create a reflection function to restore a state.',
            code: function(){

                return  (function(){
                            var savedImg = document.body.style.backgroundImage
                            return function(){
                                document.body.style.backgroundImage = savedImg
                            }
                        }).call(this);


            }
        }


    }


}});