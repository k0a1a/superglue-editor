SC.loadPackage({ 'SuperGlue': {


    comment: 'Hello friend, I am SuperGlue!\nMy single instance is the central object of the system. It provides the start routine with method SuperGlue>>init, and stores itsself in the global variable window.SuperGlue',

    sharedProperties: {

        version: {  comment:   'SuperGlue\'s current version is...', 
                    initValue: '1.0' 
                 }

    },

    properties: {

        document:         { comment: 'This is the current document.' },
        
        selection:        { comment: 'The selection is the focus of the editor, holding on or more elements to edit.' },
        clipboard:        { comment: 'This is a proxy to the operating system\'s clipboard.' },
        history:          { comment: 'The editing history is a stack object with undo/redo-methods.' },
        
        windowManager:    { comment: 'I have a windowManager which holds the 2nd-level editing interface.' },
        keyboard:         { comment: 'This is a controller object processing keyboard commands.' },
        server:           { comment: 'I keep an interface to the server under the current domain (if available).' },
        fileManager:      { comment: 'I provide a FileManager for the user\'s file system on the server (if available).' },
        

        askBeforeUnload:  { comment: 'Shall I ask the user before reloading the page?',
                            transform: function(val){
                                return val
                                    ? (window.onbeforeunload = function(){ 
                                        return 'Do you want to cancel your work and don\'t save it?' 
                                      })
                                    : (window.onbeforeunload = void 0);
                                }
                            }


    },

    methods: {

        init: {
            comment:  'I am SuperGlue\'s start routine, yay!',
            code:     function(){

                // Initialization of the whole system is "mission critical", 
                // so any failure should be catched and reported to the user.
                try {
                    
                    // Set SmallClasses's error handling during init
                    SC.setHandlerForMessageNotUnderstood(function(selector, errorMsg, context){
                        console.log('Error with selector: ', selector, ' in context: ', context);
                        throw new Error(errorMsg);
                    });

                    // Explicit failures
                    var metaData = document.querySelector('meta[name=generator]');
                    if( metaData.getAttribute('content') !== 'SuperGlue' ){
                        throw new Error('This is not a SuperGlue page, you can\'t change it.')
                    }
                    if( this.do('compareVersions', {
                            pageVersion:   metaData.getAttribute('data-superglue-version'), 
                            pluginVersion: this.class.get('version')
                        })
                    ){
                        throw new Error(
                              'This page needs version '
                            + metaData.getAttribute('data-superglue-version')
                            + '. Please update your SuperGlue browser add-on.'
                        )
                    }


                    // Make myself a global object (the only one, thou shall not have others beside me)
                    window.SuperGlue = this;


                    // Initialize all main components of the system                    

                    this.set({ document: SC.init('Document') });
                    this.set({ 
                        selection:        SC.init('Selection'),
                        clipboard:        SC.init('Clipboard'),
                        history:          SC.init('History'),
                        windowManager:    SC.init('WindowManager'),
                        keyboard:         SC.init('Keyboard'),
                        server:           SC.init('Server', window.document.location.origin),
                        fileManager:      SC.init('FileManager')
                    });

                    this.get('document').do('setUpWorkspace');
                    

                    // Finish initialization

                    this.set({'askBeforeUnload' : true});
                    
                    var editingMarker = document.createElement('meta');
                    editingMarker.setAttribute('name', 'superglue-mode');
                    editingMarker.setAttribute('content', 'editing');
                    editingMarker.setAttribute('data-superglue', 'editing-interface');
                    document.getElementsByTagName('head')[0].appendChild(editingMarker);


                    // Reset SmallClasses's error handling to normal
                    SC.setHandlerForMessageNotUnderstood();


                    // Print console.log
                    console.log([
                        '************************************************',
                        '   SuperGlue editor has successfully started!',
                        '',
                        '   To access the running system\'s code',
                        '   open the bystem browser, just enter',
                        '   > SC.do(\'SCSystemBrowser\', \'open\')',
                        '************************************************'
                    ].join('\n'));


                    // Flash the outlines
                    SuperGlue.get('document').set({ showOutlines: true });
                    window.setTimeout(function(){
                        SuperGlue.get('document').set({ showOutlines: false });
                    }, 700);

                    
                } catch(error) {
                    // Catch any initialization error
                    alert('Something went wrong starting SuperGlue\'s editing tool.\n\n' + error.message);
                    console.log('Failed to initialize SuperGlue:\n', error);
                    return;
                }


            }
        },


        savePage: {

            comment: 'I save the current page to a SuperGlue server. My parameters are { path: aString, <optional>remoteOrigin: aString }.',
            code:    function(saveOptions){

                var thisPage = SC.init('Compiler').get('pageAsHTML5'),
                    server   = saveOptions.remoteOrigin
                                ? SC.init('Server', saveOptions.remoteOrigin)
                                : this.get('server');

                this.get('windowManager').set({ activityIndicator: true });

                server.do('uploadHTML', {
                    path:   saveOptions.path,
                    data:   thisPage,
                    onerror:    function(){
                                    SuperGlue.get('windowManager').set({ activityIndicator: false });
                                    console.log(this);
                                    alert('Critical error: The page could not be saved.\nSee console for more details.');
                                },
                    onprogress: function(){

                                },
                    onresponse: function(){
                                    SuperGlue.get('windowManager').set({ activityIndicator: false });
                                }
                })


            }
        },



        compareVersions: {
            comment:  'I check for version compatability of page and plugin. Return is true for out-of-date!',
            code:     function (arg) {
                
                var v1 = arg.pageVersion,
                    v2 = arg.pluginVersion,
                    v1parts = v1.split('.'),
                    v2parts = v2.split('.');
                for (var i = 0; i < v1parts.length; ++i) {
                    if (v2parts.length == i) {
                        return true;
                    }
                    if (v1parts[i] == v2parts[i]) {
                        continue;
                    }
                    else if (v1parts[i] > v2parts[i]) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                if (v1parts.length != v2parts.length) {
                    return false;
                }
                return false;
            }
        }



    }

}});