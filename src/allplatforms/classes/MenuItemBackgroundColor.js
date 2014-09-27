SC.loadPackage({ 'MenuItemBackgroundColor': {

    comment: 'I am the MenuItem for the background-color of the page.',

    traits:  ['MenuItem'],

    sharedProperties: {

        menuContainer:  { initValue: '<div class="sg-editing-menu-container"><button id="sg-editing-menu-backgroundColor" class="sg-editing-menu-button"></button></div>' }

    },

    properties: {

        menuPanel:    { comment: 'I store the DOMElement containing the panel of controls of the MenuItem.' },

        isMenuItemActive: { comment: 'Wether the MenuItem is active.',
                            transform: function(aBoolean){
                            
                                if(aBoolean){

                                    if(this.get('menuPanel').parentNode !== this.get('menuContainer')){
                                        this.get('menuContainer').appendChild(this.get('menuPanel'));
                                    }
                                    this.get('menuContainer').classList.add('active');

                                    // prepare undo
                                    this.set({ aColorWasChoosen: false });
                                    SuperGlue.get('history').do('actionHasStarted', this.do('createState'));


                                }else{

                                    if(this.get('menuPanel').parentNode === this.get('menuContainer')){
                                        this.get('menuContainer').removeChild(this.get('menuPanel'));
                                    }
                                    this.get('menuContainer').classList.remove('active');

                                    // finish undo
                                    if(this.get('aColorWasChoosen')){
                                        SuperGlue.get('history').do('actionHasSucceeded', this.do('createState'));
                                    }
                                    this.set({ aColorWasChoosen: false });
                                
                                }
                                return aBoolean
                            }
                          },

        aColorWasChoosen: { comment: 'Wether a color was choosen or not.' }

    },

    methods: {

    	init: { 
    		comment: 	'I init the MenuItem.',
    		code: 		function(theDocumentMenu){

                this.delegate('MenuItem', 'init', theDocumentMenu);

                var initialColor = document.body.style.backgroundColor,
                    pickerLoad   = true;

                this.do('initColorPickerWidget', {

                    theDocumentMenu: theDocumentMenu,

                    initialColor: initialColor,

                    setCallback: function(colorCode){

                        if(pickerLoad){
                            return pickerLoad = false;
                        }

                        document.body.style.backgroundColor = colorCode;

                        self.set({ aColorWasChoosen: true });

                    }


                });


    		}

    	},



        initColorPickerWidget: { 
            comment:    'I init the widget as a ColorPickerWidget.',
            code:       function(colorPickerConfig){

                var menuPanelCode = '<div class="sg-editing-menu-colorPicker-panel">'
                                        +'<div class="sg-editing-menu-panel">'
                                            +'<div class="sg-menu-triangle-right"></div>'
                                            +'<div class="sg-colorpicker-container"></div>'
                                        +'</div>'
                                    +'</div>'
                    self      = this,
                    menuPanel = (new DOMParser()).parseFromString(menuPanelCode, 'text/html').body.firstChild;
                
                menuPanel.querySelector('.sg-editing-menu-panel').addEventListener('mouseup', function(evt){
                    colorPickerConfig.theDocumentMenu.set({ activeMenuItem: self });
                    evt.stopPropagation();
                }, false);

                this.set({ 
                    menuPanel: menuPanel
                });



                // From flexicolorPicker



                var colorpickerContainer = menuPanel.querySelector('.sg-colorpicker-container');
                var colorpicker;

                // Inputs

                var colorpickerInputR,
                    colorpickerInputB,
                    colorpickerInputB,
                    colorpickerInputHex;



                var start = function() {
                    
                    var colorpickerElement = document.createElement('div');
                    colorpickerElement.classList.add('sg-colorpicker');
                    colorpickerContainer.appendChild(colorpickerElement);

                    var colorpickerInputContainer = document.createElement('div');
                        colorpickerInputContainer.classList.add('sg-colorpicker-input-container');

                    var colorPickerInputRContainer = document.createElement('div');
                        colorPickerInputRContainer.setAttribute('data-label', 'R:');
                    colorpickerInputR = document.createElement('input');
                        colorpickerInputR.setAttribute('type', 'number');
                        colorpickerInputR.addEventListener('change', function() {
                            updatePicker(ColorPicker.rgb2hex({ r: this.value, g: colorpickerInputG.value, b: colorpickerInputB.value }));
                        });
                    colorPickerInputRContainer.appendChild(colorpickerInputR);
                    colorpickerInputContainer.appendChild(colorPickerInputRContainer);

                    var colorPickerInputGContainer = document.createElement('div');
                        colorPickerInputGContainer.setAttribute('data-label', 'G:');
                    colorpickerInputG = document.createElement('input');
                        colorpickerInputG.setAttribute('type', 'number');
                        colorpickerInputG.addEventListener('change', function() {
                            updatePicker(ColorPicker.rgb2hex({ r: colorpickerInputR.value, g: this.value, b: colorpickerInputB.value }));
                        });
                    colorPickerInputGContainer.appendChild(colorpickerInputG);
                    colorpickerInputContainer.appendChild(colorPickerInputGContainer);

                    var colorPickerInputBContainer = document.createElement('div');
                        colorPickerInputBContainer.setAttribute('data-label', 'B:');
                    colorpickerInputB = document.createElement('input');
                        colorpickerInputB.setAttribute('type', 'number');
                        colorpickerInputB.addEventListener('change', function() {
                            updatePicker(ColorPicker.rgb2hex({ r: colorpickerInputR.value, g: colorpickerInputG.value, b: this.value }));
                        });
                    colorPickerInputBContainer.appendChild(colorpickerInputB);
                    colorpickerInputContainer.appendChild(colorPickerInputBContainer);

                    colorpickerInputHex = document.createElement('input');
                        colorpickerInputHex.setAttribute('type', 'text');
                        colorpickerInputHex.addEventListener('change', function() {
                            updatePicker(this.value);
                        });
                    colorpickerInputContainer.appendChild(colorpickerInputHex);

                    colorpickerContainer.appendChild(colorpickerInputContainer);


                    colorpicker = ColorPicker(colorpickerElement, updateColor);

                    updatePicker(initialColor);

                    var topColors = getMostUsedColors();
                    var topColorsContainer = document.createElement('div');
                        topColorsContainer.classList.add('sg-colorpicker-top-colors');

                    for (var i=0; i<topColors.length; i++) {
                        var topColorElement = document.createElement('span');
                            topColorElement.style.backgroundColor = topColors[i].color;
                            topColorElement.addEventListener('mousedown', function() {
                                updatePicker(rgbString2Hex(this.style.backgroundColor));
                            });
                        topColorsContainer.appendChild(topColorElement);
                    }

                    colorpickerContainer.appendChild(topColorsContainer);

                    var transparentElement = document.createElement('div');
                        transparentElement.classList.add('sg-colorpicker-transparent');
                        transparentElement.addEventListener('mousedown', function() {
                            colorPickerConfig.setCallback.call(this, '');
                        });
                    colorpickerContainer.appendChild(transparentElement);
                    
                }


                var updateColor = function(hex) {
                    
                    var rgb = ColorPicker.hex2rgb(hex);

                    colorpickerInputHex.value = hex;
                    
                    colorpickerInputR.value = rgb.r;
                    colorpickerInputG.value = rgb.g;
                    colorpickerInputB.value = rgb.b;
                    
                    colorPickerConfig.setCallback.call(this, 'rgb('+rgb.r+', '+rgb.g+', '+rgb.b+')');
                }

                var updatePicker = function(hex) {
                    
                    colorpicker.setHex(hex);
                }

                var rgbString2Hex = function(rgbString) {
                     if(rgbString === ''){
                        return '';
                     }
                     if (  rgbString.search("rgb") == -1 ) {
                          return rgbString;
                     } else {
                          rgbString = rgbString.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/);
                          function hex(x) {
                               return ("0" + parseInt(x).toString(16)).slice(-2);
                          }
                          return "#" + hex(rgbString[1]) + hex(rgbString[2]) + hex(rgbString[3]); 
                     }
                };

                var getMostUsedColors = function() {
                    return [];

                }

                var initialColor = rgbString2Hex(colorPickerConfig.initialColor);
                start();







                // End from flexicolorPicker

            }

        },


        createState: {
            comment: 'I create a reflection function to restore a state.',
            code: function(){

                return  (function(){
                            var savedColor = document.body.style.backgroundColor
                            return function(){
                                document.body.style.backgroundColor = savedColor
                            }
                        }).call(this);


            }
        }


    }


}});