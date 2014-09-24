SC.loadPackage({ 'Server': {


    comment: 'I provide an interface to a SuperGlue server.',

    properties: {
        origin: { comment: 'I store the origin (protocol://hostname:port) of the server' }
    },

    methods: {

        init: {
            comment: 'I init a ServerInterface to a SuperGlue server. My argument is the origin',
            code: function(origin){

                this.set({ origin: origin });

            }
        },

        upload: {
            comment: 'I can perform an upload.'
                    +'My argument is { path: aString, data: thePayload, onresponse: aFunction, onerror: aFunction, onprogress: aFunction }',
            code: function(params){

                var path = params.path.split(' ').join();
                    xhr  = new XMLHttpRequest();

                xhr.open('POST', this.get('origin') + path);

                xhr.onload  = function(){
                                    if(this.status === 200){
                                        params.onresponse.call(this);
                                    }else{
                                        params.onerror.call(this);
                                    }
                                };
                xhr.onerror = params.onerror;
                xhr.onprogress = params.onprogress;

                xhr.send(params.data);

            }
        },

        uploadHTML: {
            comment: 'I can perform an upload of an HTML page.'
                    +'My argument is { path: aString, data: thePayload, onresponse: aFunction, onerror: aFunction, onprogress: aFunction }',
            code: function(params){

                var path = params.path.split(' ').join();
                    xhr  = new XMLHttpRequest();

                xhr.open('POST', this.get('origin') + path);
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')

                xhr.onload  = function(){
                                    if(this.status === 200){
                                        params.onresponse.call(this);
                                    }else{
                                        params.onerror.call(this);
                                    }
                                };
                xhr.onerror = params.onerror;
                xhr.onprogress = params.onprogress;

                xhr.send('data=' + encodeURIComponent(params.data));

            }
        },

        cmdRequest: {
            comment: 'I can perform a /cmd request for executing a linux shell command.'
                    +'My argument is { cmd: aString, onresponse: aFunction, onerror: aFunction, onprogress: aFunction }',
            code: function(params){

                var xhr = new XMLHttpRequest();
                xhr.open('POST', this.get('origin') + '/cmd');
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')

                xhr.onload  = function(){
                                    if(this.status === 200){
                                        params.onresponse.call(this);
                                    }else{
                                        params.onerror.call(this);
                                    }
                                };
                xhr.onerror = params.onerror;
                xhr.onprogress = params.onprogress;

                xhr.send('data=' + encodeURIComponent(params.cmd));

            }
        },


        directoryListing: {
            comment: 'I fetch a directory listing, { path: aString, onsuccess: aFunction, onerror: aFunction, onprogress: aFunction }',
            code: function(params){

                var path = params.path.split(' ').join('\\ ');
                if(path === '/') path = '';

                this.do('cmdRequest', {

                    cmd: 'lss -la .' + path + '/',

                    onerror: params.onerror,

                    onprogress: params.onprogress,

                    onresponse: function(){

                        var directory = this.responseText.split('\n');
                            directory.splice(-1, 1);
                        

                        for(var dirEntry, i = 0, l = directory.length; i < l; i++){

                            dirEntry = directory[i].split('\t');

                            directory[i] = {
                                name:           dirEntry[0].slice(1),
                                type:           dirEntry[1],
                                size:           parseInt(dirEntry[2]),
                                lastModified:   (new Date(dirEntry[3])),
                                user:           dirEntry[4],
                                group:          dirEntry[5],
                                permissions:    parseInt(dirEntry[6]),
                                isFile:         ("regular file" === dirEntry[1]),
                                isDirectory:    ("directory"    === dirEntry[1])
                            }

                        }

                        params.onsuccess.apply(directory);

                    }

                });

            }
        },

        doesFileExist: {
            comment: 'I check if a regular file exists, { path: aString, onsuccess: aFunction(aBoolean), onerror: aFunction, onprogress: aFunction }',
            code: function(params){

                var path = params.path.split(' ').join('\\ ');
                
                this.do('cmdRequest', {

                    cmd: 'lss -la .' + path,

                    onerror: params.onerror,

                    onprogress: params.onprogress,

                    onresponse: function(){

                        params.onsuccess.call(params, this.responseText.split('\n')[0].length > 0);

                    }

                });

            }
        },

        doesDirectoryExist: {
            comment: 'I check if a directory exists, { path: aString, onsuccess: aFunction(aBoolean), onerror: aFunction, onprogress: aFunction }',
            code: function(params){

                var path = params.path.split(' ').join('\\ ');

                path = path.split('/').slice(0, -1).join('/');

                this.do('cmdRequest', {

                    cmd: 'lss -la .' + path,

                    onerror: params.onerror,

                    onprogress: params.onprogress,

                    onresponse: function(){

                        params.onsuccess.call(params, this.responseText.indexOf(params.path) > -1);

                    }

                });

            }
        },


        copyFile: {
            comment: 'I copy a file, params = { sourcePath: aString, targetPath: aString, onsuccess: aFunction, onerror: aFunction, onprogress: aFunction }',
            code: function(params){

                var sourcePath = '.' + params.sourcePath.split(' ').join('\\ '),
                    targetPath = '.' + params.targetPath.split(' ').join();

                this.do('cmdRequest', {

                    cmd: 'cp ' + sourcePath + ' ' + targetPath,

                    onerror:    params.onerror,
                    onprogress: params.onprogress,
                    onresponse: params.onsuccess

                });

            }
        },

        copyDirectory: {
            comment: 'I copy a directory, params = { sourcePath: aString, targetPath: aString, onsuccess: aFunction, onerror: aFunction, onprogress: aFunction }',
            code: function(params){

                var sourcePath = '.' + params.sourcePath.split(' ').join('\\ '),
                    targetPath = '.' + params.targetPath.split(' ').join();

                this.do('cmdRequest', {

                    cmd: 'cp -r ' + sourcePath + ' ' + targetPath,

                    onerror:    params.onerror,
                    onprogress: params.onprogress,
                    onresponse: params.onsuccess

                });

            }
        },


        moveFile: {
            comment: 'I move a file, params = { sourcePath: aString, targetPath: aString, onsuccess: aFunction, onerror: aFunction, onprogress: aFunction }',
            code: function(params){

                var sourcePath = '.' + params.sourcePath.split(' ').join('\\ '),
                    targetPath = '.' + params.targetPath.split(' ').join();

                this.do('cmdRequest', {

                    cmd: 'mv ' + sourcePath + ' ' + targetPath,

                    onerror:    params.onerror,
                    onprogress: params.onprogress,
                    onresponse: params.onsuccess

                });

            }
        },


        removeFile: {
            comment: 'I remove a file, params = { path: aString, onsuccess: aFunction, onerror: aFunction, onprogress: aFunction }',
            code: function(params){

                var path = '.' + params.path.split(' ').join('\\ ');

                this.do('cmdRequest', {

                    cmd: 'rm ' + path,

                    onerror:    params.onerror,
                    onprogress: params.onprogress,
                    onresponse: params.onsuccess

                });

            }
        },

        makeDirectory: {
            comment: 'I make a directory, params = { path: aString, onsuccess: aFunction, onerror: aFunction, onprogress: aFunction }',
            code: function(params){

                var path = '.' + params.path.split(' ').join();

                this.do('cmdRequest', {

                    cmd: 'mkdir ' + path,

                    onerror:    params.onerror,
                    onprogress: params.onprogress,
                    onresponse: params.onsuccess

                });

            }
        },

        removeDirectory: {
            comment: 'I remove a directory, params = { path: aString, onsuccess: aFunction, onerror: aFunction, onprogress: aFunction }',
            code: function(params){

                var path = '.' + params.path.split(' ').join('\\ ');

                this.do('cmdRequest', {

                    cmd: 'rm -r ' + path,

                    onerror:    params.onerror,
                    onprogress: params.onprogress,
                    onresponse: params.onsuccess

                });

            }
        }






    }

}});