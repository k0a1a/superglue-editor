SC.loadPackage({ 'TextEditor': {

    comment: 'I am the TextEditor for TextElements.',

    sharedProperties: {

        editGroupFontFamily:    { initValue: '<a class="btn dropdown-toggle" title="Font"><i class="icon-font"></i><b class="caret"></b></a><ul class="dropdown-menu"></ul>' },
        editGroupFontSize:      { initValue: '<a class="btn dropdown-toggle" title="Font Size"><i class="icon-text-height"></i>&nbsp;<b class="caret"></b></a><ul class="dropdown-menu small"></ul>' },
        editGroupFontStyle:     { initValue: '<a class="btn" data-wysihtml5-command="bold" title="Bold"><i class="icon-bold"></i></a><a class="btn" data-wysihtml5-command="italic" title="Italic"><i class="icon-italic"></i></a><a class="btn" data-wysihtml5-command="underline" title="Underline"><i class="icon-underline"></i></a>' },
        editGroupFontColor:     { initValue: '<a class="btn dropdown-toggle right" title="Font Color"><i class="icon-color">&nbsp;<b class="caretRight"></i></a><div class="colorpicker2"></div>' },
        editGroupLists:         { initValue: '<a class="btn" data-wysihtml5-command="insertUnorderedList" title="Bullet list"><i class="icon-list-ul"></i></a><a class="btn" data-wysihtml5-command="insertOrderedList" title="Number list"><i class="icon-list-ol"></i></a>' },
        editGroupIndention:     { initValue: '<a class="btn" data-wysihtml5-command="outdent" title="Reduce indent"><i class="icon-indent-right"></i></a><a class="btn" data-wysihtml5-command="indent" title="Indent"><i class="icon-indent-left"></i></a>' },
        editGroupAlignment:     { initValue: '<a class="btn" data-wysihtml5-command="alignLeftStyle" title="Align Left"><i class="icon-align-left"></i></a><a class="btn" data-wysihtml5-command="alignCenterStyle" title="Center"><i class="icon-align-center"></i></a><a class="btn" data-wysihtml5-command="alignRightStyle" title="Align Right"><i class="icon-align-right"></i></a><a class="btn" data-wysihtml5-command="alignJustifyStyle" title="Justify"><i class="icon-align-justify"></i></a>' },
        editGroupHyperlink:     { initValue: '<a class="btn dropdown-toggle hyperlink" title="Hyperlink" data-wysihtml5-command="createLink"><i class="icon-link"></i>&nbsp;<b class="caret"></b></a><div class="dropdown-menu input-append" data-wysihtml5-dialog="createLink" style="display: none;"><label>Link:<input data-wysihtml5-dialog-field="href" value="http://" class="text"></label><a data-wysihtml5-dialog-action="save">OK</a> <a data-wysihtml5-dialog-action="cancel">Cancel</a> <a data-wysihtml5-command="removeLink">Remove</a></div>' },
        activeEditGroups:       { initValue: ['editGroupIndention', 'editGroupAlignment', 'editGroupFontSize', 'editGroupFontFamily', 'editGroupFontColor', 'editGroupHyperlink', 'editGroupFontStyle', 'editGroupLists'] },
        activeFonts:            { initValue: ['Serif', 'Sans', 'Arial', 'Arial Black', 'Courier', 'Courier New', 'Comic Sans MS','Dosis', 'Helvetica', 'Impact', 'Lucida Grande', 'Lucida Sans', 'Montserrat', 'Tahoma', 'Times', 'Times New Roman', 'TitilliumWeb', 'Verdana'] },
        activeFontSizes:        { initValue: ['8px', '9px', '10px', '11px', '12px', '13px', '14px', '15px', '16px', '17px', '18px', '20px', '22px', '26px', '28px', '30px', '32px', '34px', '36px', '38px', '40px', '46px', '50px', '60px', '70px'] }


    },

    properties: {

        originalElementNode:    { comment: 'I store the original TextElement\'s DOM node.' },
        originalSelection:      { comment: 'I store the selection to restore it on unloading of the editor.' },
        textEditor:             { comment: 'I store the TextEditor\'s DOM node.' },
        textEditorContainer:    { comment: 'I store the textEditorContainer\'s DOM node.' }

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
                    evt.stopPropagation();
                }, false);

                textEditorContainer.addEventListener('mousedown', function(evt){

                    self.do('closeTextEditor');

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

                this.get('textEditorContainer').appendChild(textShapeToolbar);

                this.do('initToolbarBindings');

                textEditor.style.display = 'none';

                // Initialize Editor

                window.editor = new wysihtml5.Editor("currentEditor", { // id of textarea element
                  toolbar:      "textShapeToolbar", // id of toolbar element
                  style:        false, 
                  useLineBreaks: false,
                  parserRules:  wysihtml5ParserRules, // defined in parser rules set
                  cleanUp:      true, 
                  stylesheets:  ["../resources/default/css/normalize.css", "../resources/default/css/style.css"]
                }).on('load', function() {
                    
                    document.querySelector('.wysihtml5-sandbox').classList.add('shapeContent');
                    editor.focus();
                    
                }).on('blur', function() {
                    
                    document.querySelector('.wysihtml5-sandbox').style.display = 'block';
                    self.get('originalElementNode').innerHTML = self.get('textEditor').value;
                    self.get('textEditor').style.display = 'none';

                }).on('focus', function() {
                    
                    self.get('textEditor').style.display = 'none';
                    var sandbox = document.querySelector('.wysihtml5-sandbox');
                        sandbox.style.borderWidth = self.get('textEditor').style.borderWidth;
                        sandbox.style.borderColor = self.get('textEditor').style.borderColor;
                        sandbox.style.borderRadius = self.get('textEditor').style.borderRadius;
                        sandbox.style.backgroundColor = self.get('textEditor').style.backgroundColor;
                        sandbox.style.backgroundRepeat = self.get('textEditor').style.backgroundRepeat;
                        sandbox.style.backgroundImage = self.get('textEditor').style.backgroundImage;
                        sandbox.style.padding = self.get('textEditor').style.padding;
                        sandbox.style.boxSizing = self.get('textEditor').style.boxSizing;
                        sandbox.style.outline = self.get('textEditor').style.outline;

                        sandbox.style.position = 'absolute';
                        //this.do('updateEditorDimensions', sandbox);
                        sandbox.style.top = self.get('textEditor').style.top;
                        sandbox.style.left = self.get('textEditor').style.left;
                        sandbox.style.width = self.get('textEditor').style.width;
                        sandbox.style.height = self.get('textEditor').style.height;
                        
                        sandbox.style.display = 'block';
                    
                });
                /*                        
                self.get('textEditor').addEventListener('click', function(evt){

                    if (editor) {
                        window.editor.focus(); 
                    }
                    
                    evt.stopPropagation();
                    return;
                });
                */

                var self = this;
                var tmpTextColor;
                
                
                document.querySelector('.wysihtml5-sandbox').contentWindow.document.body.addEventListener('selectstart', function () {
                    
                    var fired = false;

                    document.querySelector('.wysihtml5-sandbox').contentWindow.addEventListener('mouseup', function(evt) {
                        if (!fired) {
                            if (this.getSelection().type != 'Range') {
                                                                
                                //$('#textShapeToolbar .colorpicker2').removeClass('active');
                                tmpTextColor = "rgb(0,0,0)";

                            } else {
                                
                                var currentFontColor = undefined;

                                var sel = editor.composer.selection.getSelection();
                                if (sel.rangeCount > 0) {
                                    var range = sel.getRangeAt(0);
                                    var parentElement = range.commonAncestorContainer;
                                    if (parentElement.nodeType == 3) {
                                        parentElement = parentElement.parentNode;
                                    }
                                    if (parentElement.style.color.length > 0) {
                                        currentFontColor = parentElement.style.color;
                                    }
                                }

                                // TODO: INIT COLORPICKER
                                //self.do('initPicker', { initColor: currentFontColor });
                                
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

                
                document.querySelector('.dropdown-menu input').addEventListener('click', function() {return false;});
                /*
                document.querySelector('.dropdown-menu input').addEventListener('change', function() {
                    this.parentNode.parentNode.querySelector('.dropdown-toggle').dropdown('toggle');
                });
                */
                   
                document.querySelector('.dropdown-menu input').addEventListener('keydown', function (evt) {
                    if (evt.keyCode == 27) {
                        this.value='';
                    }
                });
                

                var dropdownMenus = document.querySelectorAll('.dropdown-toggle');
                
                for (var d=0; d<dropdownMenus.length; d++) {
                    dropdownMenus[d].addEventListener('click', function() {

                        /*
                        var dropdownClass;
                        if ( this.nextElementSibling && this.nextElementSibling.classList.contains('colorpicker2') ) {
                            dropdownClass = 'colorpicker2';
                        } else {
                            dropdownClass = 'dropdown-menu';
                        }
                        */
                        
                        var dropdownClass = 'dropdown-menu'

                        if ( this.classList.contains('open') ) {
                            this.nextElementSibling.classList.remove('active');
                            this.classList.remove('open');
                        } else {
                            var dropdownMenuContainers = document.querySelectorAll('.dropdown-menu');

                            for (var i=0; i<dropdownMenuContainers.length; i++) {
                                dropdownMenuContainers[i].classList.remove('active')
                            }
                            
                            this.nextElementSibling.classList.add('active');
                            
                            for (var d=0; d<dropdownMenus.length; d++) {
                                dropdownMenus[d].classList.remove('open');
                            }

                            this.classList.add('open');
                        }

                    });
                }

                var buttons = document.querySelectorAll('.dropdown-menu li, .dropdown-menu button, .dropdown-menu a[data-wysihtml5-dialog-action]');

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

        initPicker: {
            comment: 'I init my colorpicker. Params: initColor',
            code: function(){

                // TODO: INIT COLORPICKER HERE
                // with arg.initColor


            }
        },



    }


}});