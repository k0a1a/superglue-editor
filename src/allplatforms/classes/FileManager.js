SC.loadPackage({ 'FileManager': {

    comment: 'I am the FileManager.',

    properties: {
        activeFileManagerWindow: { comment: 'I hold a reference to my active window.' }
    },
    
    methods: {

        init: { 
            comment:    'I init the fileManager',
            code:       function(){

                this.set({ activeFileManagerWindow: null })

            }
        },


        open: {
            comment: 'I open myWindow for simple file browsing.',
            code: function(){


                if ( this.get('activeFileManagerWindow') ) {

                    this.get('activeFileManagerWindow').set({
                        context: 'chooseFile',
                        hasOKandCancelButton: false
                    });

                } else {

                    SuperGlue.get('windowManager').do('createWindow', {
                        class: 'FileManagerWindow',
                        top:    100,
                        left:   100,
                        width:  400,
                        height: 410,
                        hasOKandCancelButton: false,
                    });


                }			

            
            }
        },


        chooseFile: {
            comment: 'I open myWindow as a file chooser dialog.',
            code: function(options){


                if ( this.get('activeFileManagerWindow') ) {

                    this.get('activeFileManagerWindow').set({
                        context: 'chooseFile',
                        hasOKandCancelButton: true,
                        selectPath: options.oldPath,
                        callback: function() {

                            options.callback.call(this, this.path);

                        }
                    });

                } else {

                    SuperGlue.get('windowManager').do('createWindow', {
                        class: 'FileManagerWindow',
                        context: 'chooseFile',
                        top:    100,
                        left:   100,
                        width:  400,
                        height: 410,
                        hasOKandCancelButton: true,
                        selectPath: options.oldPath,
                        callback: function() {

                            options.callback.call(this, this.path);

                        }
                    });


                }

                
            
            }
        },


        saveAs: {
            comment: 'I open myWindow as a saveAs dialog.',
            code: function(callback){

                if ( this.get('activeFileManagerWindow') ) {

                    this.get('activeFileManagerWindow').set({
                        originalFileName: document.location.pathname.split('/').slice(-1).join(),
                        context: 'saveAs',
                        hasOKandCancelButton: true,
                        callback: function() {

                            callback.call(this, this.path);

                        }
                    });

                } else {

                    SuperGlue.get('windowManager').do('createWindow', {
                        class: 'FileManagerWindow',
                        originalFileName: document.location.pathname.split('/').slice(-1).join(),
                        context: 'saveAs',
                        top:    100,
                        left:   100,
                        width:  400,
                        height: 410,
                        hasOKandCancelButton: true,
                        callback: function() {

                            callback.call(this, this.path);

                        }
                    });


                }
                
            
            }
        }



    }


}});