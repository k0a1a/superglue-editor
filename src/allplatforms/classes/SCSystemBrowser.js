SC.loadPackage({ 'SCSystemBrowser': {


    comment: 'I am the SmallClasses.js System Browser, and part of the SmallClasses.js project',

    traits: [ 'SCGUI' ],

    sharedProperties: {

        windowFile:   { comment:   'This file contains the html for the SCSystemBrowser\'s GUI. It needs to be available under the same domain, with a path relative to the embbeding html file.',
                        initValue: '/devTools/SCSystemBrowser.html' },
        windowConfig: { comment:   'This is the configuration for the window.open() function.',
                        initValue: 'height=750, width=1024, titlebar=no, location=no, menubar=no, resizable=yes, status=no, toolbar=no' }

    },

    properties: {
        
        browserWindow: {
            comment:   'I store the reference to the SystemBrowser\'s window',
            transform: function(aBrowserWindow){
                this.set({ 
                    mySCGUIWindow:  aBrowserWindow,
                    rootWindow:     aBrowserWindow.opener
                });
                return aBrowserWindow
            }
        },
        rootWindow: {
            comment:    'I store the reference to the root window which opened the SystemBrowser'
        },

        currentClass: {},
        currentClassMember: {},
        currentEditorMode: {}

    },

    methods: {


        open: {
            comment: 'I open a window for a new SCSystemBrowser. Static Method!',
            code:    function(){

                window.open(
                    SC.getSharedProperty('SCSystemBrowser', 'windowFile'),
                    '_blank',
                    SC.getSharedProperty('SCSystemBrowser', 'windowConfig')
                )
                
            }
        },

        init: {
            comment: 'I init myself. I am called from the newly created window!\narguments: { browserWindow: <the window containing me.> }',
            code:    function (arg){

                this.set({ 
                    browserWindow:      arg.browserWindow,
                    currentClass:       '',
                    currentClassMember: {
                        type:  '',
                        value: ''
                    },
                    currentEditorMode:  ''
                });

                this.do('initClassListView');
                this.do('updateClassListView');

                
                this.do('initSharedPropertiesView');
                this.do('initPropertiesView');
                this.do('initMethodsView');

                //if(this.get('rootWindow')['$$TEMP_SCSystemBrowser']){ ... currentClass ; updateClassView }
                
                
            }

        },

        updateClassView: {
            comment: 'I update the view on the right side, after a class selection',
            code:    function(arg){

                this.do('updateTraitsView');
                this.do('updateMixinsView');
                this.do('updateSharedPropertiesView');
                this.do('updatePropertiesView');
                this.do('updateMethodsView');

                this.do('updateClassCommentEditor')

            }
        },

        
        initClassListView: {
            comment: 'I init the the class list view',
            code:    function(arg){

                var classHasBeenChoosen = function(evt){
                    this.set({ currentClass: evt.target.value })
                    this.do('updateClassView');

                    this.do('showElement', { id: 'classEditor' });
                    this.do('hideElement', { id: 'sharedPropertyEditor' });
                    this.do('hideElement', { id: 'propertyEditor' });
                    this.do('hideElement', { id: 'methodEditor' });
                };

                this.do('addListener', { 
                    id:       'packageListSelect',
                    event:    'click',
                    bubbling: false,
                    callback: classHasBeenChoosen
                });

                this.do('addListener', { 
                    id:       'packageListSelect',
                    event:    'change',
                    bubbling: false,
                    callback: classHasBeenChoosen
                });
                
            }

        },

        updateClassListView: {
            comment: 'I update the the class list view',
            code:    function(arg){

                var classList = SC.getClasses();
                classList.sort(function (a, b) {
                    if (a > b) return 1;
                    if (a < b) return -1;
                    return 0;
                });

                this.do('emptyElement', { id: 'packageListSelect' });
                this.do('setAttribute', { id: 'packageListSelect', 
                                          attr: { size: classList.length } });
                for(var i = 0; i < classList.length; i++){
                    this.do('createElement', {
                        type:   'option',
                        parent: 'packageListSelect',
                        inner:  classList[i],
                        attr:   { name: classList[i] }
                    });
                }
                
            }

        },


        updateTraitsView: {
            comment: 'I update the the traits view',
            code:    function(arg){

                var traits = SC.getTraits( this.get('currentClass') );
                traits = (traits.length == 0) ? '' : JSON.stringify(traits);

                
                this.do('setAttribute', { id: 'classTraitsInput',
                                          attr: { value: traits }
                                        });
                
            }

        },


        updateMixinsView: {
            comment: 'I update the the mixins view',
            code:    function(arg){

                var mixins = SC.getMixins( this.get('currentClass') );
                mixins = (mixins.length == 0) ? '' : JSON.stringify(mixins);

                
                this.do('setAttribute', { id: 'classMixinsInput',
                                          attr: { value: mixins } });
                
            }

        },

        updateSharedPropertiesView: {
            comment: 'I update the the shared properties view',
            code:    function(arg){

                var sharedProperties = SC.getSharedProperties( this.get('currentClass') );
                sharedProperties.sort(function (a, b) {
                    if (a > b) return 1;
                    if (a < b) return -1;
                    return 0;
                });

                this.do('emptyElement', { id: 'classSharedPropertiesSelect' });
                this.do('setAttribute', { id: 'classSharedPropertiesSelect', 
                                          attr: { size: (sharedProperties.length > 1 ? sharedProperties.length : 2) } });
                for(var i = 0; i < sharedProperties.length; i++){
                    this.do('createElement', {
                        type:   'option',
                        parent: 'classSharedPropertiesSelect',
                        inner:  sharedProperties[i],
                        attr:   { name: sharedProperties[i] }
                    });
                }
                
            }

        },

        updatePropertiesView: {
            comment: 'I update the the  properties view',
            code:    function(arg){

                var properties = SC.getProperties( this.get('currentClass') );
                properties.sort(function (a, b) {
                    if (a > b) return 1;
                    if (a < b) return -1;
                    return 0;
                });

                this.do('emptyElement', { id: 'classPropertiesSelect' });
                this.do('setAttribute', { id: 'classPropertiesSelect', 
                                          attr: { size: (properties.length > 1 ? properties.length : 2) } });
                for(var i = 0; i < properties.length; i++){
                    this.do('createElement', {
                        type:   'option',
                        parent: 'classPropertiesSelect',
                        inner:  properties[i],
                        attr:   { name: properties[i] }
                    });
                }
                
            }

        },

        updateMethodsView: {
            comment: 'I update the the method view',
            code:    function(arg){

                var methods = SC.getMethods( this.get('currentClass') );
                methods.sort(function (a, b) {
                    if (a > b) return 1;
                    if (a < b) return -1;
                    return 0;
                });

                this.do('emptyElement', { id: 'classMethodsSelect' });
                this.do('setAttribute', { id: 'classMethodsSelect', 
                                          attr: { size: (methods.length > 1 ? methods.length : 2) } });
                for(var i = 0; i < methods.length; i++){
                    this.do('createElement', {
                        type:   'option',
                        parent: 'classMethodsSelect',
                        inner:  methods[i],
                        attr:   { name: methods[i] }
                    });
                }
                
            }

        },

        initSharedPropertiesView: {
            comment: 'I init the the shared properties view',
            code:    function(arg){

                this.do('addListener', { 
                    id:       'classSharedPropertiesSelect',
                    event:    'change',
                    bubbling: false,
                    callback: function(evt){
                        this.set({ currentClassMember: {
                            type:  'sharedProperty',
                            value: evt.target.value
                        } });
                        this.do('deselectOptions', { id: 'classPropertiesSelect' });
                        this.do('deselectOptions', { id: 'classMethodsSelect' });

                        this.do('updateSharedPropertyEditor');
                        
                        this.do('hideElement', { id: 'classEditor' });
                        this.do('hideElement', { id: 'propertyEditor' });
                        this.do('hideElement', { id: 'methodEditor' });
                        this.do('showElement', { id: 'sharedPropertyEditor' });
                    }
                });
                
            }

        },

        initPropertiesView: {
            comment: 'I init the the properties view',
            code:    function(arg){

                this.do('addListener', { 
                    id:       'classPropertiesSelect',
                    event:    'change',
                    bubbling: false,
                    callback: function(evt){
                        this.set({ currentClassMember: {
                            type:  'property',
                            value: evt.target.value
                        } });
                        this.do('deselectOptions', { id: 'classSharedPropertiesSelect' });
                        this.do('deselectOptions', { id: 'classMethodsSelect' });

                        this.do('updatePropertyEditor');

                        this.do('hideElement', { id: 'classEditor' });
                        this.do('hideElement', { id: 'sharedPropertyEditor' });
                        this.do('hideElement', { id: 'methodEditor' });
                        this.do('showElement', { id: 'propertyEditor' });
                    }
                });
                
            }

        },

        initMethodsView: {
            comment: 'I init the the method view',
            code:    function(arg){

                this.do('addListener', { 
                    id:       'classMethodsSelect',
                    event:    'change',
                    bubbling: false,
                    callback: function(evt){
                        this.set({ currentClassMember: {
                            type:  'method',
                            value: evt.target.value
                        } });
                        this.do('deselectOptions', { id: 'classSharedPropertiesSelect' });
                        this.do('deselectOptions', { id: 'classPropertiesSelect' });

                        this.do('updateMethodEditor');

                        this.do('hideElement', { id: 'classEditor' });
                        this.do('hideElement', { id: 'sharedPropertyEditor' });
                        this.do('hideElement', { id: 'propertyEditor' });
                        this.do('showElement', { id: 'methodEditor' });
                    }
                });
                
            }

        },

        updateClassCommentEditor: {
            comment: 'I update the the class comment editor',
            code:    function(arg){

                this.do('getElement', { id: 'classCommentEditor'}).innerHTML = this.do('prettyPrint',
                    SC.getClassComment( this.get('currentClass') )
                );

            }
        },

        updateSharedPropertyEditor: {
            comment: 'I update the the shared property editor',
            code:    function(arg){

                if( this.get('currentClassMember').type == 'sharedProperty' ){

                    this.do('getElement', { id: 'sharedPropertyCommentEditor'}).innerHTML = this.do('prettyPrint',
                        SC.getSharedPropertyComment( 
                            this.get('currentClass'),
                            this.get('currentClassMember').value
                        )
                    );

                    var currentValue = SC.getSharedProperty( 
                            this.get('currentClass'),
                            this.get('currentClassMember').value
                        );
                    try{
                        currentValue = JSON.stringify( currentValue );
                    }catch(e){
                        currentValue = currentValue.toString();
                    }
                    this.do('getElement', { id: 'sharedPropertyInitValueEditor'}).innerHTML = this.do('prettyPrint',
                        currentValue
                    );


                    this.get('browserWindow').editorSharedPropertyValidator.setValue(
                        SC.getSharedPropertyValidator( 
                            this.get('currentClass'),
                            this.get('currentClassMember').value
                        ).toString()
                        , -1
                    );
                    this.get('browserWindow').editorSharedPropertyValidator.resize(true);
                    
                    this.get('browserWindow').editorSharedPropertyTransformer.setValue(
                        SC.getSharedPropertyTransformer( 
                            this.get('currentClass'),
                            this.get('currentClassMember').value
                        ).toString()
                        , -1
                    );
                    this.get('browserWindow').editorPropertyTransformer.resize(true);


                }

            }
        },

        updatePropertyEditor: {
            comment: 'I update the the property editor',
            code:    function(arg){

                if( this.get('currentClassMember').type == 'property' ){

                    this.do('getElement', { id: 'propertyCommentEditor'}).innerHTML = this.do('prettyPrint',
                        SC.getPropertyComment( 
                            this.get('currentClass'),
                            this.get('currentClassMember').value
                        )
                    );
                    
                    this.get('browserWindow').editorPropertyValidator.setValue(
                        SC.getPropertyValidator( 
                            this.get('currentClass'),
                            this.get('currentClassMember').value
                        ).toString()
                        , -1
                    );
                    this.get('browserWindow').editorPropertyValidator.resize(true);

                    this.get('browserWindow').editorPropertyTransformer.setValue(
                        SC.getPropertyTransformer( 
                            this.get('currentClass'),
                            this.get('currentClassMember').value
                        ).toString()
                        , -1
                    );
                    this.get('browserWindow').editorPropertyTransformer.resize(true);

                }

            }
        },

        updateMethodEditor: {
            comment: 'I update the the method editor',
            code:    function(arg){

                if( this.get('currentClassMember').type == 'method' ){

                    this.do('getElement', { id: 'methodCommentEditor'}).innerHTML = this.do('prettyPrint',
                        SC.getMethodComment( 
                            this.get('currentClass'),
                            this.get('currentClassMember').value
                        )
                    );
                    
                    this.get('browserWindow').editorMethodCode.setValue(
                        SC.getMethodCode( 
                            this.get('currentClass'),
                            this.get('currentClassMember').value
                        ).toString()
                        , -1
                    );
                    this.get('browserWindow').editorMethodCode.resize(true);


                }

            }
        },


        prettyPrint: {
            comment: 'I parse a string for special chars. (TEMPORARY)',
            code: function (arg){
                var str = arg;
                return   str.replace(/</g, '&lt;')
                            .replace(/>/g, '&gt;')
                            .replace(/\n/g, '<br>')
                            .replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;');

            }
        }



    }

}});