SC.loadPackage({ 'TextEditor': {

    comment: 'I am the TextEditor for TextElements.',

    sharedProperties: {

        editGroupFontFamily:    { initValue: '<a class="btn dropdown-toggle" title="Font"><i class="icon-font"></i><b class="caret"></b></a><ul class="dropdown-menu"></ul>' },
        editGroupFontSize:      { initValue: '<a class="btn dropdown-toggle" title="Font Size"><i class="icon-text-height"></i>&nbsp;<b class="caret"></b></a><ul class="dropdown-menu small"></ul>' },
        editGroupFontStyle:     { initValue: '<a class="btn" data-wysihtml5-command="bold" title="Bold"><i class="icon-bold"></i></a><a class="btn" data-wysihtml5-command="italic" title="Italic"><i class="icon-italic"></i></a><a class="btn" data-wysihtml5-command="underline" title="Underline"><i class="icon-underline"></i></a>' },
        editGroupFontColor:     { initValue: '<a class="btn dropdown-toggle right" title="Font Color"><i class="icon-color">&nbsp;<b class="caret"></i></a><div class="sg-colorpicker-container-text"><div class="sg-colorpicker-container"></div></div>' },
        editGroupLists:         { initValue: '<a class="btn" data-wysihtml5-command="insertUnorderedList" title="Bullet list"><i class="icon-list-ul"></i></a><a class="btn" data-wysihtml5-command="insertOrderedList" title="Number list"><i class="icon-list-ol"></i></a>' },
        editGroupIndention:     { initValue: '<a class="btn" data-wysihtml5-command="outdent" title="Reduce indent"><i class="icon-indent-right"></i></a><a class="btn" data-wysihtml5-command="indent" title="Indent"><i class="icon-indent-left"></i></a>' },
        editGroupAlignment:     { initValue: '<a class="btn" data-wysihtml5-command="alignLeftStyle" title="Align Left"><i class="icon-align-left"></i></a><a class="btn" data-wysihtml5-command="alignCenterStyle" title="Center"><i class="icon-align-center"></i></a><a class="btn" data-wysihtml5-command="alignRightStyle" title="Align Right"><i class="icon-align-right"></i></a><a class="btn" data-wysihtml5-command="alignJustifyStyle" title="Justify"><i class="icon-align-justify"></i></a>' },
        editGroupHyperlink:     { initValue: '<a class="btn hyperlink" title="Hyperlink" data-wysihtml5-command="createLink"><i class="icon-link"></i></a><div class="hyperlink-dropdown input-append" data-wysihtml5-dialog="createLink" style="display: none;"><input data-wysihtml5-dialog-field="href" value="http://" class="text"><a data-wysihtml5-dialog-action="save"></a><a data-wysihtml5-command="removeLink"></a><a data-wysihtml5-dialog-action="cancel"></a></div>' },
        //editGroupHyperlink:     { initValue: '<a class="btn dropdown-toggle hyperlink" title="Hyperlink"><i class="icon-link"></i>&nbsp;<b class="caret"></b></a><div class="dropdown-menu input-append" style="display: none;"><input value="http://" class="text"><a data-wysihtml5-command="createLink" data-wysihtml5-command-value=""></a><a data-wysihtml5-command="removeLink"></a><a data-wysihtml5-dialog-action="cancel"></a></div>' },
        activeEditGroups:       { initValue: ['editGroupIndention', 'editGroupAlignment', 'editGroupFontSize', 'editGroupFontFamily', 'editGroupFontColor', 'editGroupHyperlink', 'editGroupFontStyle', 'editGroupLists'] },
        activeFonts:            { initValue: ['Serif', 'Sans', 'Arial', 'Arial Black', 'Courier', 'Courier New', 'Comic Sans MS','Dosis', 'Helvetica', 'Impact', 'Lucida Grande', 'Lucida Sans', 'Montserrat', 'Tahoma', 'Times', 'Times New Roman', 'TitilliumWeb', 'Verdana'] },
        activeFontSizes:        { initValue: ['8px', '9px', '10px', '11px', '12px', '13px', '14px', '15px', '16px', '17px', '18px', '20px', '22px', '26px', '28px', '30px', '32px', '34px', '36px', '38px', '40px', '46px', '50px', '60px', '70px'] }


    },

    properties: {

        originalElementNode:    { comment: 'I store the original TextElement\'s DOM node.' },
        originalSelection:      { comment: 'I store the selection to restore it on unloading of the editor.' },
        textEditor:             { comment: 'I store the TextEditor\'s DOM node.' },
        textEditorContainer:    { comment: 'I store the textEditorContainer\'s DOM node.' },
        textEditorToolbar:      { comment: 'I store the textEditorToolbar\'s DOM node.' },
        colorpicker:            { comment: 'I store a reference to my colorpicker' }

    },

    methods: {

    	init: { 
    		comment: 	'method comment',
    		code: 		function(aTextElement){

                var self = this,
                    originalElementNode = aTextElement.get('node'),
                    textEditor          = document.createElement('textarea'),
                    textEditorContainer = document.createElement('div');

                this.set({
                    originalElementNode:    originalElementNode,
                    originalSelection:      SuperGlue.get('selection').get('elements'),
                    textEditor:             textEditor,
                    textEditorContainer:    textEditorContainer
                });

                SuperGlue.get('selection').do('clearAll');

                (function(elementNode){
                    var textContent = elementNode.innerHTML;
                    SuperGlue.get('history').do('actionHasStarted', function(){
                        elementNode.innerHTML = textContent;
                    })
                }).call(this, this.get('originalElementNode'));

                // Prepare textEditor's div
                /*
                textEditor.setAttribute('id', 'sg-editing-textEditor');
                textEditor.style.width   = originalElementNode.style.width;
                textEditor.style.height  = originalElementNode.style.height;
                textEditor.style.padding = originalElementNode.style.padding;
                textEditor.style.border  = originalElementNode.style.border;
                textEditor.style.borderRadius  = originalElementNode.style.borderRadius;
                */

                // Add textarea

                textEditor.setAttribute('id', 'currentEditor');
                textEditor.style.borderWidth        = originalElementNode.style.borderWidth;
                textEditor.style.borderColor        = originalElementNode.style.borderColor;
                textEditor.style.borderRadius       = originalElementNode.style.borderRadius;
                textEditor.style.backgroundColor    = originalElementNode.style.backgroundColor;
                textEditor.style.backgroundRepeat   = originalElementNode.style.backgroundRepeat;
                textEditor.style.backgroundImage    = originalElementNode.style.backgroundImage;
                textEditor.style.padding            = originalElementNode.style.padding;
                textEditor.style.boxSizing          = 'border-box';
                textEditor.style.borderStyle        = 'solid';

                textEditor.style.position   = 'absolute';
                textEditor.style.width      = this.get('originalElementNode').offsetWidth + 'px';
                textEditor.style.height     = this.get('originalElementNode').offsetHeight + 'px';

                textEditor.style.outline   = '1px dashed rgb(255, 41, 61)';

                this.do('updateEditorDimensions');
                
                /*
                textEditor.style.top = this.get('originalElementNode').clientTop - this.get('originalElementNode').scrollTop + 'px';
                textEditor.style.left = this.get('originalElementNode').clientLeft - this.get('originalElementNode').scrollLeft + 'px';
                textEditor.style.width = this.get('originalElementNode').offsetWidth + 'px';
                textEditor.style.height = this.get('originalElementNode').offsetHeight + 'px';
                */

                this.get('textEditorContainer').appendChild(textEditor);

                window.addEventListener('resize', function(){ 
                    self.do('updateEditorDimensions', textEditor) 
                }, false);

                // Prepare container
                
                textEditorContainer.setAttribute('id', 'sg-editing-textEditor-container');
                this.do('updateContainerDimensions', textEditorContainer);
                window.addEventListener('resize', function(){ 
                    self.do('updateContainerDimensions', textEditorContainer) 
                }, false);



                textEditor.innerHTML = originalElementNode.innerHTML;
                originalElementNode.style.display = 'none';

                textEditorContainer.appendChild(textEditor);


                // Add eventListener on the container

                textEditorContainer.addEventListener('mouseover', function(evt){
                    evt.stopPropagation();
                }, false);

                textEditorContainer.addEventListener('mouseout', function(evt){
                    evt.stopPropagation();
                }, false);


                textEditorContainer.addEventListener('mouseup', function(evt){
                    
                    self.do('closeTextEditor');

                    evt.stopPropagation();
                }, false);

                textEditorContainer.addEventListener('mousedown', function(evt){
                    evt.stopPropagation();

                }, false);


                document.body.insertBefore(
                    textEditorContainer, 
                    SuperGlue.get('document').get('editingContainer').nextElementSibling
                );

                // Append text editing toolbar

                var textShapeToolbar = document.createElement('div');
                    textShapeToolbar.setAttribute('id', 'textShapeToolbar');
                    textShapeToolbar.setAttribute('data-role', 'editor-toolbar');
                    textShapeToolbar.setAttribute('data-target', '#currentEditor');
                    textShapeToolbar.style.display = 'block';

                    textShapeToolbar.style.top = this.get('textEditor').offsetTop - 85 + 'px';
                    textShapeToolbar.style.left = this.get('textEditor').offsetLeft + this.get('textEditor').offsetWidth - 300 + 'px';

                var editGroups = this.class.get('activeEditGroups');

                for ( i=0; i < editGroups.length; i++ ) {
                    var htmlString = this.class.get(editGroups[i]);
                    var currentGroup = document.createElement('div');
                        currentGroup.setAttribute('class', 'btn-group');
                        currentGroup.innerHTML = htmlString;
                        textShapeToolbar.appendChild(currentGroup);
                }

                textShapeToolbar.addEventListener('mousedown', function(evt) {
                    evt.stopPropagation();
                });
                textShapeToolbar.addEventListener('mouseup', function(evt) {
                    evt.stopPropagation();
                });

                this.get('textEditorContainer').appendChild(textShapeToolbar);

                this.set({ textEditorToolbar: textShapeToolbar });

                this.do('initToolbarBindings');

                textEditor.style.display = 'none';

                // Initialize Editor

                window.editor = new wysihtml5.Editor("currentEditor", { // id of textarea element
                  toolbar:      "textShapeToolbar", // id of toolbar element
                  style:        false, 
                  useLineBreaks: false,
                  parserRules:  wysihtml5ParserRules, // defined in parser rules set
                  cleanUp:      true, 
                  stylesheets:  ["../resources/css/SuperGlue.css"]
                }).on('load', function() {
                    
                    document.querySelector('.wysihtml5-sandbox').addEventListener('mouseenter', function() {
                        // Hide open dropdown menus
                        var dropdownMenuContainers = document.querySelectorAll('.dropdown-menu');
                        var dropdownMenus = document.querySelectorAll('.dropdown-toggle');
                        
                        for (var i=0; i<dropdownMenuContainers.length; i++) {
                            dropdownMenuContainers[i].classList.remove('active')
                        }

                        document.querySelector('.sg-colorpicker-container-text').classList.remove('active');
                        
                        for (var d=0; d<dropdownMenus.length; d++) {
                            dropdownMenus[d].classList.remove('open');
                        }
                    });

                    editor.focus();

                    self.do('initColorpicker', {

                        initialColor: undefined,
                        setCallback: function(colorCode){
                            
                            if ( editor.composer.commands.stateValue("fontColorStyle") !== colorCode ) {
                                editor.composer.commands.exec('fontColorStyle', colorCode );
                            }

                        }

                    });

                    
                }).on('blur', function() {
                    
                    document.querySelector('.wysihtml5-sandbox').style.display = 'block';
                    self.get('originalElementNode').innerHTML = self.get('textEditor').value;
                    self.get('textEditor').style.display = 'none';

                }).on('focus', function() {
                    
                    self.get('textEditor').style.display = 'none';
                    var sandbox = document.querySelector('.wysihtml5-sandbox');
                        sandbox.contentWindow.document.body.style.overflow = 'hidden';
                        sandbox.style.borderWidth = self.get('textEditor').style.borderWidth;
                        sandbox.style.borderColor = self.get('textEditor').style.borderColor;
                        sandbox.style.borderRadius = self.get('textEditor').style.borderRadius;
                        sandbox.style.backgroundColor = self.get('textEditor').style.backgroundColor;
                        sandbox.style.backgroundRepeat = self.get('textEditor').style.backgroundRepeat;
                        sandbox.style.backgroundImage = self.get('textEditor').style.backgroundImage;
                        sandbox.style.padding = self.get('textEditor').style.padding;
                        sandbox.style.boxSizing = self.get('textEditor').style.boxSizing;
                        sandbox.style.outline = self.get('textEditor').style.outline;
                        sandbox.style.borderStyle = self.get('textEditor').style.borderStyle;

                        sandbox.style.position = 'absolute';
                        //this.do('updateEditorDimensions', sandbox);
                        sandbox.style.top = self.get('textEditor').style.top;
                        sandbox.style.left = self.get('textEditor').style.left;
                        sandbox.style.width = self.get('textEditor').style.width;
                        sandbox.style.height = self.get('textEditor').style.height;
                        
                        sandbox.style.display = 'block';
                    
                });
                              
                self.get('textEditor').addEventListener('click', function(evt){

                    if (editor) {
                        window.editor.focus(); 
                    }
                    
                    evt.stopPropagation();
                    return;
                });
                

                var self = this;
                var tmpTextColor;
                
                
                document.querySelector('.wysihtml5-sandbox').contentWindow.document.body.addEventListener('selectstart', function () {
                    
                    var fired = false;

                    document.querySelector('.wysihtml5-sandbox').contentWindow.addEventListener('mouseup', function(evt) {
                        if (!fired) {
                            if (this.getSelection().type == 'Range') {
                                                                
                                var currentFontColor = undefined;

                                if ( editor.composer.commands.stateValue("fontColorStyle") ) {
                                    currentFontColor = editor.composer.commands.stateValue("fontColorStyle");
                                }

                                self.do('initColorpicker', {

                                    initialColor: currentFontColor,
                                    setCallback: function(colorCode){
                                        
                                        if ( editor.composer.commands.stateValue("fontColorStyle") !== colorCode ) {
                                            editor.composer.commands.exec('fontColorStyle', colorCode );
                                        }

                                    }

                                });
                                
                            }

                            fired = true;
                        }
                        
                    });
                    

                });

                

    		}
    	},

        closeTextEditor: {
            comment: '',
            code: function(){

                // close routine

                this.get('originalElementNode').innerHTML = this.get('textEditor').value;
                this.get('originalElementNode').style.display = '';

                document.body.removeChild(this.get('textEditorContainer'));

                this.get('originalSelection').forEach(function(element){
                    SuperGlue.get('selection').do('addElement', element)
                });


                (function(elementNode){
                    var textContent = elementNode.innerHTML;
                    SuperGlue.get('history').do('actionHasSucceeded', function(){
                        elementNode.innerHTML = textContent;
                    })
                }).call(this, this.get('originalElementNode'));


            }
        },

        updateEditorDimensions: {
            comment: '',
            code: function(){

                var currentElement = this.get('originalElementNode'),
                    top, left;
                      
                left = (- parseInt(currentElement.style.borderWidth));
                left = top = isNaN(left) ? 0 : left

                while(currentElement){
                    top  += (currentElement.offsetTop  + currentElement.clientTop );
                    left += (currentElement.offsetLeft + currentElement.clientLeft);
                    currentElement = currentElement.offsetParent;
                }

                this.get('textEditor').style.top  = top  + 'px';
                this.get('textEditor').style.left = left + 'px';

            }
        },

        updateContainerDimensions: {
            comment: '',
            code: function(textEditorContainer){

                var maxWidth  = SuperGlue.get('document').do('getMinWidth'),
                    maxHeight = SuperGlue.get('document').do('getMinHeight');

                maxWidth  = maxWidth  > (window.innerWidth  - 20) ? maxWidth  : (window.innerWidth  - 20);
                maxHeight = maxHeight > (window.innerHeight - 20) ? maxHeight : (window.innerHeight - 20);

                textEditorContainer.style.width  = maxWidth  + 'px';
                textEditorContainer.style.height = maxHeight + 'px';

            }
        },

        initToolbarBindings: {
            comment:  'I initialize event bindings for the textShapeToolbar before wysihtml5 is executed.',
            params:   {},
            code:     function() {

                var self = this;

                var fonts = this.class.get('activeFonts');
                var fontTarget = document.querySelector('[title="Font"]').parentNode.querySelector('.dropdown-menu');
                
                for (var i=0; i<fonts.length; i++) {
                    var fontName = fonts[i];
                    var fontBtn = document.createElement('li');
                        fontBtn.innerHTML = '<a data-wysihtml5-command="fontFamilyStyle" data-wysihtml5-command-value="' + fontName +'">'+ fontName + '</a>';
                    fontTarget.appendChild(fontBtn);
                }

                var fontSizes = this.class.get('activeFontSizes'),
                    fontSizeTarget = document.querySelector('[title="Font Size"]').parentNode.querySelector('.dropdown-menu');

                for (var s=0; s<fontSizes.length; s++) {
                    var fontSize = fontSizes[s];
                    var fontSizeBtn = document.createElement('li');
                        fontSizeBtn.innerHTML = '<a data-wysihtml5-command="fontSizeStyle" data-wysihtml5-command-value="' + fontSize +'">'+ fontSize + '</a>';
                    fontSizeTarget.appendChild(fontSizeBtn);
                }
                   
                document.querySelector('.hyperlink-dropdown input.text').addEventListener('keyup', function (evt) {
                    evt.stopPropagation();
                    evt.preventDefault();
                });
                

                self.get('textEditorToolbar').querySelector('.hyperlink').addEventListener('click', function() {

                    var dropdownToggleBtns = self.get('textEditorToolbar').querySelectorAll('.dropdown-toggle');

                    for (var i=0; i<dropdownToggleBtns.length; i++) {
                        dropdownToggleBtns[i].classList.remove('active')
                    }

                    var dropdownMenuContainers = self.get('textEditorToolbar').querySelectorAll('.dropdown-menu');

                    for (var i=0; i<dropdownMenuContainers.length; i++) {
                        dropdownMenuContainers[i].classList.remove('active')
                    }

                    document.querySelector('.sg-colorpicker-container-text').classList.remove('active');
                    
                    for (var d=0; d<dropdownMenus.length; d++) {
                        dropdownMenus[d].classList.remove('open');
                    }

                    if ( this.classList.contains('wysihtml5-command-dialog-opened') ) {
                        this.nextElementSibling.querySelector('[data-wysihtml5-dialog-action="cancel"]').click();
                    }

                });

                var dropdownMenus = self.get('textEditorToolbar').querySelectorAll('.btn');
                
                for (var d=0; d<dropdownMenus.length; d++) {
                    
                    if ( dropdownMenus[d].classList.contains('dropdown-menu') ) {
                        dropdownMenus[d].addEventListener('click', function() {
                        
                            var dropdownClass = 'dropdown-menu';

                            if ( this.classList.contains('open') ) {
                                this.nextElementSibling.classList.remove('active');
                                this.classList.remove('open');
                            } else {
                                var dropdownMenuContainers = document.querySelectorAll('.dropdown-menu');

                                for (var i=0; i<dropdownMenuContainers.length; i++) {
                                    dropdownMenuContainers[i].classList.remove('active')
                                }

                                document.querySelector('.sg-colorpicker-container-text').classList.remove('active');
                                
                                this.nextElementSibling.classList.add('active');
                                
                                for (var d=0; d<dropdownMenus.length; d++) {
                                    dropdownMenus[d].classList.remove('open');
                                }

                                this.classList.add('open');
                            }

                        });
                    }


                    dropdownMenus[d].addEventListener('mouseenter', function() {
                        
                        var dropdownMenuContainers = self.get('textEditorToolbar').querySelectorAll('.dropdown-menu');

                        for (var i=0; i<dropdownMenuContainers.length; i++) {
                            dropdownMenuContainers[i].classList.remove('active')
                        }

                        document.querySelector('.sg-colorpicker-container-text').classList.remove('active');
                        
                        for (var d=0; d<dropdownMenus.length; d++) {
                            dropdownMenus[d].classList.remove('open');
                            
                            if ( dropdownMenus[d].classList.contains('wysihtml5-command-dialog-opened') ) {
                                dropdownMenus[d].nextElementSibling.querySelector('[data-wysihtml5-dialog-action="cancel"]').click();
                            }

                        }

                        if ( this.classList.contains('dropdown-toggle') ) {
                            this.nextElementSibling.classList.add('active');
                            this.classList.add('open');
                        }

                        /*
                        if ( this.classList.contains('hyperlink') ) {
                            if ( !this.classList.contains('open') ) {
                                this.click();
                            } else {
                                //
                            }
                            
                        } else {
                            this.nextElementSibling.querySelector('a[data-wysihtml5-dialog-action="cancel"]').click();
                        }
                        */

                        
                    });
                }

                var buttons = document.querySelectorAll('.dropdown-menu li, .dropdown-menu button, .dropdown-menu.input-append a');

                for (var b=0; b<buttons.length; b++) {
                    buttons[b].addEventListener('click', function() {
                        this.parentNode.classList.remove('active');
                        for (var d=0; d<dropdownMenus.length; d++) {
                            dropdownMenus[d].classList.remove('open');
                        }
                    });
                }
                
            }
        },

        initColorpicker: { 
            comment:    'I init my colorpicker. Params: initialColor, setCallback()',
            code:       function(colorPickerConfig){

                var self = this;
                
                // From flexicolorPicker

                var colorpickerContainer = this.get('textEditorToolbar').querySelector('.sg-colorpicker-container');
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
                    self.set({ colorpicker: colorpicker });

                    //updatePicker(initialColor);

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
                    
                    if ( hex ) {
                        var rgb = ColorPicker.hex2rgb(hex);

                        colorpickerInputHex.value = hex;
                        
                        colorpickerInputR.value = rgb.r;
                        colorpickerInputG.value = rgb.g;
                        colorpickerInputB.value = rgb.b;
                        
                        
                        colorPickerConfig.setCallback.call(this, 'rgb('+rgb.r+','+rgb.g+','+rgb.b+')');
                    }

                }
                

                var updatePicker = function(hex) {
                    
                    self.get('colorpicker').setHex(hex);
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
                
                if ( !colorpickerContainer.querySelector('.sg-colorpicker') ) {
                    var initialColor = undefined;
                    start();
                } else if ( colorPickerConfig.initialColor ) {
                    var initialColor = rgbString2Hex(colorPickerConfig.initialColor);
                    updatePicker(initialColor);
                }

                // End from flexicolorPicker

            }

        }



    }


}});