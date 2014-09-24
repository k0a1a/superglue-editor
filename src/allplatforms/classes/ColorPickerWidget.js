SC.loadPackage({ 'ColorPickerWidget': {

    comment: 'I am a trait class for Widget classes and provide the functionality for a ColorPicker.',

    traits: ['Widget'],

    
    properties: {

        widgetPanel:    { comment: 'I store the DOMElement containing the panel of controls of the widget.' },

        isWidgetActive: { comment: 'Wether the widget is active.',
                          transform: function(aBoolean){
                            
                                if(aBoolean){

                                    if(this.get('widgetPanel').parentNode !== this.get('widgetMenu')){
                                        this.get('widgetMenu').appendChild(this.get('widgetPanel'));
                                    }
                                    this.get('widgetMenu').classList.add('active');

                                    // prepare undo
                                    this.set({ aColorWasChoosen:   false });
                                    SuperGlue.get('history').do('actionHasStarted', this.do('createState'));
                                    

                                }else{

                                    if(this.get('widgetPanel').parentNode === this.get('widgetMenu')){
                                        this.get('widgetMenu').removeChild(this.get('widgetPanel'));
                                    }
                                    this.get('widgetMenu').classList.remove('active');

                                    // finish undo
                                    if(this.get('aColorWasChoosen')){
                                        SuperGlue.get('history').do('actionHasSucceeded', this.do('createState'));
                                    }
                                    this.set({ aColorWasChoosen: false })
                                
                                }
                                return aBoolean
                          }
                        },

        aColorWasChoosen:       { comment: 'Wether a color was choosen or not.' }

    },

    methods: {

        initColorPickerWidget: { 
            comment:    'I init the widget as a ColorPickerWidget.',
            code:       function(colorPickerConfig){

                var widgetPanelCode = '<div class="sg-editing-widget-colorPicker-panel">'
                                        +'<div class="sg-editing-widget-panel">'
                                            +'<div class="sg-widget-triangle-up"></div>'
                                            +'<div class="sg-colorpicker-container"></div>'
                                        +'</div>'
                                    +'</div>',


                    self        = this,
                    widgetPanel = (new DOMParser()).parseFromString(widgetPanelCode, 'text/html').body.firstChild;
                
                widgetPanel.querySelector('.sg-editing-widget-panel').addEventListener('mouseup', function(evt){
                    colorPickerConfig.theSelection.set({ activeWidget: self });
                    evt.stopPropagation();
                }, false);

                this.set({ 
                    widgetPanel:      widgetPanel,
                    aColorWasChoosen: false
                });



                // From flexicolorPicker



                var colorpickerContainer = widgetPanel.querySelector('.sg-colorpicker-container');
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
                    
                    var elements = SuperGlue.get('document').get('children');
                    var colorArray = [];

                    for (var i=0; i<elements.length; i++) {
                        if ( elements[i].get('node').style.backgroundColor.length ) {
                            colorArray.push(elements[i].get('node').style.backgroundColor);
                        }
                        if ( elements[i].get('node').style.borderColor.length ) {
                            colorArray.push(elements[i].get('node').style.borderColor);
                        }
                    }

                    var frequencyObject = {};
                    for( var v in colorArray ) {
                        frequencyObject[colorArray[v]]=(frequencyObject[colorArray[v]] || 0)+1;
                    }

                    var frequencyArray = [];
                    for ( var f in frequencyObject ) {
                        var newObj = {};
                        newObj["color"] = f;
                        newObj["count"] = frequencyObject[f]
                        frequencyArray.push(newObj);
                    }

                    function compare(a,b) {
                        if (a.count < b.count)
                            return 1;
                        if (a.count > b.count)
                            return -1;
                        return 0;
                    }

                    frequencyArray.sort(compare);

                    if ( frequencyArray.length > 5 ) {
                        frequencyArray.slice(0, 5);
                    }

                    return frequencyArray;

                }

                var initialColor = rgbString2Hex(colorPickerConfig.initialColor);
                start();







                // End from flexicolorPicker

            }

        }


    }


}});