SC.loadPackage({ 'FileManager': {

    comment: 'I am the FileManager.',

    
    methods: {

        init: { 
            comment:    'I init the fileManager',
            code:       function(){

            }
        },


        open: {
            comment: 'I open myWindow for simple file browsing.',
            code: function(){

                
                SuperGlue.get('windowManager').do('createWindow', {
                    class: 'FileManagerWindow',
                    top:    100,
                    left:   100,
                    width:  400,
                    height: 410,
                    hasOKandCancelButton: false,
                });				

            
            }
        },


        chooseFile: {
            comment: 'I open myWindow as a file chooser dialog.',
            code: function(options){


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
        },


        saveAs: {
            comment: 'I open myWindow as a saveAs dialog.',
            code: function(callback){


                SuperGlue.get('windowManager').do('createWindow', {
                    class: 'FileManagerWindow',
                    context: 'saveAs',
                    top:    100,
                    left:   100,
                    width:  400,
                    height: 410,
                    hasOKandCancelButton: true,
                    originalFileName: document.location.pathname.split('/').slice(-1).join(),
                    callback: function() {

                        callback.call(this, this.path);

                    }
                });
                
            
            }
        }



    }


}});