SC.loadPackage({ 'Element': {

    comment: '(abstract) I define the common traits of all SuperGlue elements. My method Element>>awakeFromDOM is used as a static method to recreate specific elements (instances of classes to whom I am a trait).',


    properties: {

        node:           { comment: 'I hold my container DOM node.',
                            transform: function(aNode){
                                this.set({ contentNode: aNode /*aNode.querySelector('.sg-element-content')*/ });
                                return aNode;
                            }
                        },

        contentNode:    { comment: 'I hold my content\'s DOM node.' },
        resizeHandles:  { comment: 'I hold an instance of ResizeHandles.' },


        top:            { transform: function(anInt){
                                var val       = anInt > 0 ? anInt : 0,
                                    cssVal,
                                    grid      = SuperGlue.get('document').get('grid').get('active'),
                                    gridSize;

                                if(grid){
                                    gridSize = SuperGlue.get('document').get('grid').get('gridSize');
                                    val = Math.round(val / gridSize) * gridSize;
                                } 

                                cssVal = val + 'px';
                                this.get('resizeHandles').set({ top: cssVal });
                                this.get('node').style.top = cssVal;
                                return val;
                            } 
                        },
        left:           { transform: function(anInt){
                                var val       = anInt > 0 ? anInt : 0,
                                    cssVal,
                                    grid      = SuperGlue.get('document').get('grid').get('active'),
                                    gridSize;

                                if(grid){
                                    gridSize = SuperGlue.get('document').get('grid').get('gridSize');
                                    val = Math.round(val / gridSize) * gridSize;
                                } 

                                cssVal = val + 'px';
                                this.get('resizeHandles').set({ left: cssVal });
                                this.get('node').style.left = cssVal;
                                return val;
                            } 
                        },
        width:          { transform: function(anInt){
                                var val       = anInt > 50 ? anInt : 50,
                                    cssVal,
                                    grid      = SuperGlue.get('document').get('grid').get('active'),
                                    gridSize;

                                if(grid){
                                    gridSize = SuperGlue.get('document').get('grid').get('gridSize');
                                    val = Math.round(val / gridSize) * gridSize;
                                    if(val < 50){
                                        val = Math.ceil(50 / gridSize) * gridSize
                                    }
                                }

                                var nodeStyle   = this.get('node').style,
                                    borderWidth = this.get('borderWidth'),
                                    padding     = this.get('padding'),

                                    paddingOverflow = val - 2 * (borderWidth + padding);

                                if(paddingOverflow < 0){
                                    padding += paddingOverflow / 2;
                                    padding = padding < 0 ? 0 : padding;
                                    this.set({ padding: padding})
                                }

                                if(borderWidth === 0){
                                    nodeStyle.borderWidth = '';
                                    nodeStyle.borderStyle = '';
                                }else{
                                    nodeStyle.borderWidth = borderWidth + 'px';
                                    nodeStyle.borderStyle = 'solid';
                                    nodeStyle.borderColor = this.get('borderColor');
                                }

                                if(padding === 0){
                                    nodeStyle.padding = '';
                                }else{
                                    nodeStyle.padding = padding + 'px';
                                }

                                this.get('resizeHandles').set({ width: val + 'px' });
                                this.get('node').style.width = val - 2 * (borderWidth + padding) + 'px';
                                return val;
                            } 
                        },
        height:         { transform: function(anInt){
                                var val       = anInt > 50 ? anInt : 50,
                                    cssVal,
                                    grid      = SuperGlue.get('document').get('grid').get('active'),
                                    gridSize;

                                if(grid){
                                    gridSize = SuperGlue.get('document').get('grid').get('gridSize');
                                    val = Math.round(val / gridSize) * gridSize;
                                    if(val < 50){
                                        val = Math.ceil(50 / gridSize) * gridSize
                                    }
                                }


                                var nodeStyle   = this.get('node').style,
                                    borderWidth = this.get('borderWidth'),
                                    padding     = this.get('padding');

                                if(val - 2 * (borderWidth + padding) < 0){
                                    padding += val / 2 - (borderWidth + padding);
                                    padding = padding < 0 ? 0 : padding;
                                    this.set({padding:padding})
                                }

                                if(borderWidth === 0){
                                    nodeStyle.borderWidth = '';
                                    nodeStyle.borderStyle = '';
                                }else{
                                    nodeStyle.borderWidth = borderWidth + 'px';
                                    nodeStyle.borderStyle = 'solid';
                                    nodeStyle.borderColor = this.get('borderColor');
                                }

                                if(padding === 0){
                                    nodeStyle.padding = '';
                                }else{
                                    nodeStyle.padding = padding + 'px';
                                }

                                

                                this.get('resizeHandles').set({ height: val + 'px' });
                                this.get('node').style.height = val - 2 * (borderWidth + padding) + 'px';
                                return val;
                            } 
                        },


        borderWidth:    { comment: 'I hold an integer representing borderWidth in px.'
                        },

        borderColor:    { comment: 'I hold a string representing the borderColor.',
                          transform: function(aString){
                                this.get('node').style.borderColor = aString;
                                return aString;
                          }
                        },

        padding:        { comment: 'I hold an integer representing padding in px.'
                        },


        contentLocked:  { comment: 'Should I prevent pointer events on the contentNode?',
                          transform: function(aBoolean){
                                if(aBoolean){
                                    this.get('contentNode').classList.add('sg-editing-block-events');
                                }else{
                                    this.get('contentNode').classList.remove('sg-editing-block-events');
                                }
                                return aBoolean;
                            }
                        },

        group:          { comment: 'Do I have a selection group (id number, not 0) or not (null).',
                          transform: function(anIntOrNull){
                                if(anIntOrNull){
                                    this.get('node').setAttribute('data-superglue-group', anIntOrNull.toString());
                                }else{
                                    this.get('node').removeAttribute('data-superglue-group')
                                }
                                return anIntOrNull;
                          }
                        }

    },

    methods: {

    	awakeFromDOM: { 
    		comment: 	'(static) I am a class method to recreate specific elements from sleeping DOM nodes. Called from SuperGlue>>init.',
    		code: 		function(aNode){

                var theRevivedOne = SC.init(aNode.getAttribute('data-superglue-type'), aNode);
                
                return theRevivedOne;

    		}
    	},


        init: {
            comment:    'Shared initialization routine for all elements. Must be called by theirClass>>init via this.delegate(\'Element\', \'init\', aNode).',
            code:       function(aNode){

                this.set({ node: aNode });

                this.set({ contentLocked: true });
                this.set({ resizeHandles: SC.init('ResizeHandles', this )});
                
                var groupAttribute = this.get('node').getAttribute('data-superglue-group'),
                    borderWidth    = parseInt(this.get('contentNode').style.borderWidth),
                    padding        = parseInt(this.get('contentNode').style.padding);

                this.set({
                    borderColor:    this.get('contentNode').style.borderColor,
                    borderWidth:    isNaN(borderWidth) ? 0 : borderWidth,
                    padding:        isNaN(padding) ? 0 : padding
                });

                this.set({
                    top:    parseInt(this.get('node').style.top),
                    left:   parseInt(this.get('node').style.left),
                    width:  (parseInt(this.get('node').style.width)  + 2 * (this.get('borderWidth') + this.get('padding'))),
                    height: (parseInt(this.get('node').style.height) + 2 * (this.get('borderWidth') + this.get('padding'))),
                    group:  groupAttribute ? parseInt(groupAttribute) : null
                });

                SuperGlue.get('selection').do('registerForSelection', this)

            }

        },

        renderYourself: {
            comment: 'I represent myself as a string to the compiler.',
            code: function(config){

                var indent = '\n' + Array(config.indent).join('\t'),
                    thisElement;

                thisElement = indent + '<div class="sg-element" data-superglue-type="'
                                        +this.get('node').getAttribute('data-superglue-type')
                                        +'" style="'
                                        +this.get('node').getAttribute('style')
                                        +'"'
                                        +(this.get('group') 
                                            ? (' data-superglue-group="'+ this.get('group') +'"')
                                            : '')
                                        +'>'

                                        + (function(innerHTML){

                                            var renderedContent = innerHTML.split('\n').filter(function(line){ return line.trim() !== '' }),
                                                whitespace      = [],
                                                cutOff          = 0;

                                            renderedContent.forEach(function(line){
                                                whitespace.push( line.length - line.trimLeft().length );
                                            });
                                            cutOff = Math.min.apply(Math, whitespace);

                                            for(var i = 0, l = renderedContent.length; i < l; i++){

                                                renderedContent[i] = indent + '\t' + renderedContent[i].substr(cutOff);

                                            }


                                            return renderedContent.join('\n')

                                        }).call(this, this.get('contentNode').innerHTML)
                                        
                            
                            + indent + '</div>';


                return thisElement;

            }
        }

    }


}});