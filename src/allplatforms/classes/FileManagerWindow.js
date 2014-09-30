SC.loadPackage({ 'FileManagerWindow': {

    comment: 'I am a FileManagerWindow.',

    traits: ['Window'],

    properties: {
        
        fileManager:  { comment: 'I hold the fileManager to which I am the window.' },
        
        context: { 
        	comment: 'I hold the context from which I was called ("","saveAs","chooseFile", "newPage")',
        	transform: function(context) {

        		if ( context == 'saveAs' || context == 'newPage' ) {
        			
        			this.get('content').querySelector('.sg-filemanager-directory-container').classList.add('nameInput');

        			var self = this;

        			var modalNameInput = document.createElement('input');
        				modalNameInput.setAttribute('type', 'text');
        				modalNameInput.classList.add('sg-modal-name-input');
        				
                        if ( context == 'saveAs' ) {
                            modalNameInput.setAttribute('value', self.get('originalFileName') );
                        } else if ( context == 'newPage' ) {
                            modalNameInput.setAttribute('value', 'NewPage.html' );
                        }

        				modalNameInput.addEventListener('keyup', function(evt) {
        					if ( evt.target.value.length >= 1 ) {
                        		self.set({ confirmPath: self.get('basePath') +'/'+ evt.target.value });
                        		self.get('content').querySelector('button.confirm').classList.add('active');
                        	} else {
                        		self.get('content').querySelector('button.confirm').classList.remove('active');
                        	}
        				});
        				modalNameInput.addEventListener('paste', function(evt) {
        					if ( evt.target.value.length >= 1 ) {
                        		self.set({ confirmPath: self.get('basePath') +'/'+ evt.target.value });
                        		self.get('content').querySelector('button.confirm').classList.add('active');
                        	} else {
                        		self.get('content').querySelector('button.confirm').classList.remove('active');
                        	}
        				});

        			this.get('content').querySelector('.sg-filemanager-directory-container').appendChild(modalNameInput);

        			modalNameInput.focus();


        		} else if ( context == 'chooseFile' ) {
        			
        			this.get('content').querySelector('.sg-filemanager-directory-container').classList.remove('nameInput');
        			if ( this.get('content').querySelector('.sg-modal-name-input') ) {
        				this.get('content').querySelector('.sg-modal-name-input').remove();
        			}
        			

        		} else {
        			
        			this.get('content').querySelector('.sg-filemanager-directory-container').classList.remove('nameInput');
        			if ( this.get('content').querySelector('.sg-modal-name-input') ) {
        				this.get('content').querySelector('.sg-modal-name-input').remove();
        			}

        		}

        		return context;

        	}
        },
        
        currentPath: {
            comment: 'I hold the current file path.',
            transform: function(path){
                
                var cleanPath;
				if ( path == '/' ) {
					cleanPath = '';
				} else {
					cleanPath = path;
				}
                this.set({ basePath: cleanPath });

                this.get('directoryControlContainer').querySelector('.sg-filemanager-current-path').innerHTML = path;

                return path;

            } 
        },
        
        originalFileName: { comment: 'I hold the original file name when the context is "saveAs".' },
        
        callback: { comment: 'I hold the callback when the context is "saveAs" or "chooseFile".' },
        
        basePath: { comment: 'I hold the current base path which strips of "/" when currentPath is the root directory.' },

        selectPath: { 
            comment: 'I hold the path that was given to me to auto-select a file / directory.',
            transform: function(path) {

                if ( path && path.indexOf('/resources/img/') == -1 ) {
                    var fullPath = path;
                    var fullPathArray = fullPath.split('/');
                        fullPathArray.pop();
                    var parentDirectory = fullPathArray.join('/');
                    this.do('listDirectory', { path: parentDirectory, selectPath: path });
                } else {
                    this.do('listDirectory', { path: '/' });
                }

                return path;

            }
        },
		
		confirmPath: { comment: 'I hold the path that is given to the callback on confirmation.' },

		copiedFilePath: {
			comment: 'I hold the copied file path to use when pasteToAvailableLocation is called.',
			transform: function(path) {

				if ( path ) {
					this.get('optionContainer').querySelector('.sg-filemanager-operation.paste').classList.add('active');
					this.set({ copiedFileName: this.get('selectedName') });
					this.set({ copiedFileType: this.get('selectedType') });
				} else {
					this.get('optionContainer').querySelector('.sg-filemanager-operation.paste').classList.remove('active');
				}

				return path;
				

			}
		},

		copiedFileName: { comment: 'I hold the copied file name to use when pasteToAvailableLocation is called.' },

		copiedFileType: { comment: 'I hold the copied file type (directory/file) to use when pasteToAvailableLocation is called.' },
        
        selectedName: { comment: 'I hold the current file / directory name. Empty string if nothing is selected.' },
        
        selectedType: { comment: 'I hold the type (file or directory) of the selection.' },
        
        isFileSelected: { 
            comment: 'Wether a File or Directory is selected.',
            transform: function(aBoolean){

                this.get('previewContainer').classList.remove('active');
                this.get('previewContainer').innerHTML = '';

                if (aBoolean) {
                	
                    var selectedFile = this.get('directoryListing').querySelector('[data-path="'+ this.get('basePath') +'/'+ this.get('selectedName') +'"]');
                    this.get('optionContainer').querySelector('.delete').classList.add('active');
                    this.get('optionContainer').querySelector('.rename').classList.add('active');
                    this.get('optionContainer').querySelector('.copy').classList.add('active');

                    if ( this.get('selectedType') == 'file' ) {

                    	if ( this.get('hasOKandCancelButton') && this.get('context') == 'chooseFile' ) {
	                        this.get('content').querySelector('button.confirm').classList.add('active');
	                        this.set({ confirmPath: this.get('basePath') +'/'+ this.get('selectedName') });
	                    }

	                    if ( selectedFile && selectedFile.classList.contains('image') ) {
                            var preview = document.createElement('img');
                            	preview.setAttribute('src', selectedFile.getAttribute('data-path'));
                            this.get('previewContainer').classList.add('active');
                            this.get('previewContainer').appendChild(preview);
                        }

                    } else {
                    	
                    	if ( this.get('hasOKandCancelButton') && this.get('context') == 'chooseFile' ) {
	                        this.get('content').querySelector('button.confirm').classList.remove('active');
	                    }

                    }

                } else {
                    
                    this.get('optionContainer').querySelector('.delete').classList.remove('active');
                    this.get('optionContainer').querySelector('.rename').classList.remove('active');
                    this.get('optionContainer').querySelector('.copy').classList.remove('active');

                    var selectedFiles = this.get('directoryListing').querySelectorAll('.active');
                    for (var i = 0; i < selectedFiles.length; i++) {
                    	selectedFiles[i].classList.remove('active');
                    }

                    if ( this.get('selectedType') == 'file' ) {
                    	if ( this.get('hasOKandCancelButton') && this.get('context') == 'chooseFile' ) {
	                        this.get('content').querySelector('button.confirm').classList.remove('active');
	                    }
	                }

                }
                
                return aBoolean;
            }
        },
        
        isWorking: { 
            comment: 'Wether a request is currently done.',
            transform: function(aBoolean){

                if ( aBoolean ) {
                    // working

                    if ( !this.get('content').querySelector('.sg-filemanager-working') ) {
                    	var workingIndicator = document.createElement('div');
	                        workingIndicator.setAttribute('class', 'sg-filemanager-working');
	                    this.get('content').appendChild(workingIndicator);
                    }

                    if ( !this.get('content').querySelector('.sg-filemanager-blocked') ) {
                    	var blockingIndicator = document.createElement('div');
	                        blockingIndicator.setAttribute('class', 'sg-filemanager-blocked');
	                    this.get('content').querySelector('.sg-filemanager-directory-container').appendChild(blockingIndicator);
                    }

                    var activeButtons = this.get('content').querySelectorAll('.sg-filemanager-operation.active');
                    for (var i = 0; i<activeButtons.length; i++) {
                    	activeButtons[i].classList.remove('active');
                    }
                    
                    if ( this.get('hasOKandCancelButton') && this.get('context') != 'saveAs' && this.get('context') != 'newPage' ) {
                        this.get('content').querySelector('button.confirm').classList.remove('active');
                    }

                } else {
                    // finished
                    
                    if ( this.get('content').querySelector('.sg-filemanager-working') ) {
                    	this.get('content').querySelector('.sg-filemanager-working').remove();
                    }

                    if ( this.get('content').querySelector('.sg-filemanager-blocked') ) {
	                    this.get('content').querySelector('.sg-filemanager-blocked').remove();
                    }

                    this.get('optionContainer').querySelector('.file-upload').classList.add('active');
                    this.get('optionContainer').querySelector('.directory-new').classList.add('active');
                    

                }
                
                return aBoolean;
            }
        },
        
        hasOKandCancelButton: { 
            comment: 'Wether I have a OK and Cancel button.',
            transform: function(aBoolean){

                if (aBoolean) {
                    if ( !this.get('content').querySelector('.sg-editing-filemanager-modal-container') ) {
                        var self = this;

                        var modalButtonContainer = document.createElement('div');
                            modalButtonContainer.classList.add('sg-editing-filemanager-modal-container');

                        var modalButtonConfirm = document.createElement('button');
                            modalButtonConfirm.classList.add('confirm');
                            modalButtonConfirm.addEventListener('click', function() {
                                
                                if ( this.classList.contains('active') ) {
                                    
                                    if ( self.get('context') == 'newPage' ) {

                                        self.do('createNewPageAtAvailableLocation', { name: self.get('content').querySelector('.sg-modal-name-input').value });
                                        //SuperGlue.get('windowManager').do('closeWindow', self);

                                    } else {

                                        // Send Callback Path and Close
                                        // TODO: Close only if not opened before
                                        self.get('callback').call({ path: self.get('confirmPath') });
                                        SuperGlue.get('windowManager').do('closeWindow', self);

                                    }

                                    
                                }

                            });

                        var modalButtonCancel = document.createElement('button');
                            modalButtonCancel.classList.add('cancel', 'active');
                            modalButtonCancel.addEventListener('click', function() {
                                
                                // Close
                                // TODO: Close only if not opened before
                                SuperGlue.get('windowManager').do('closeWindow', self);

                            });

                        modalButtonContainer.appendChild(modalButtonConfirm);
                        modalButtonContainer.appendChild(modalButtonCancel);
                        this.get('content').appendChild(modalButtonContainer);

                        this.get('content').parentNode.querySelector('.sg-editing-window-closebutton').style.display = 'none';

                    }
                } else {
                    if ( this.get('content').querySelector('.sg-editing-filemanager-modal-container') ) {
                        this.get('content').querySelector('.sg-editing-filemanager-modal-container').remove();
                        this.get('content').parentNode.querySelector('.sg-editing-window-closebutton').style.display = 'block';
                    }
                }
                
                return aBoolean;
            }
       },
       
       optionContainer: { comment: 'I hold a reference to the file operations panel.' },
       
       directoryListing: { comment: 'I hold a reference to the directory container.' },
       
       directoryControlContainer: { comment: 'I hold a reference to the directory controls.' },
       
       previewContainer: { comment: 'I hold a reference to the image preview container.' }

    },

    methods: {

        init: { 
            comment:    'I start a new FileManagerWindow. My argument is '+
                        '{ top: anInt, left: anInt, width: anInt, height: anInt }.',
            code:       function(startConfig){
                
                var self = this;

                SuperGlue.get('fileManager').set({ activeFileManagerWindow: self });
                
                self.set({ onClose: function() {

                    SuperGlue.get('fileManager').set({ activeFileManagerWindow: null })

                } });
                
                self.delegate('Window', 'init', startConfig);

                // Directory Listing

                var directoryContainerElement = document.createElement('div');
                    directoryContainerElement.setAttribute('class', 'sg-filemanager-directory-container');

                var directoryListingElement = document.createElement('ul');
                    directoryListingElement.setAttribute('class', 'sg-filemanager-directory-listing');
                    directoryListingElement.addEventListener('mouseup', function(evt) {
                        self.set({ isFileSelected: false });
                        evt.stopPropagation();
                    });

                self.set({ directoryListing: directoryListingElement });

                directoryContainerElement.appendChild(directoryListingElement);
                self.get('content').appendChild(directoryContainerElement);

                // Directory Controls

                var directoryControls = document.createElement('div');
                    directoryControls.setAttribute('class', 'sg-filemanager-directory-controls');

                self.get('content').appendChild(directoryControls);
                self.set({ directoryControlContainer: directoryControls });

                // Go UP one directory button
                var optionDirectoryUp = document.createElement('div');
                    optionDirectoryUp.classList.add('sg-filemanager-operation', 'directory-up');
                    optionDirectoryUp.addEventListener('click', function() {
                        
                        if ( self.get('currentPath') == '/' ) {
                            return false;
                        }

                        var path = self.get('currentPath');
                        var pathArray = path.split('/');
                        pathArray.pop();
                        
                        var newPath;
                        if (pathArray.length > 1 ) {
                            newPath = pathArray.join('/');
                        } else if (pathArray.length == 1) {
                            newPath = '/';
                        }
                        
                        self.do('listDirectory', { path: newPath });
                    });

                directoryControls.appendChild(optionDirectoryUp);

                // Current path display
                var currentPathContainer = document.createElement('div');
                    currentPathContainer.classList.add('sg-filemanager-current-path');

                directoryControls.appendChild(currentPathContainer);

                // File Operations
                
                var optionContainerElement = document.createElement('div');
                    optionContainerElement.setAttribute('class', 'sg-filemanager-operations');

                self.set({ optionContainer: optionContainerElement });
                self.get('content').appendChild(self.get('optionContainer'));

                // Upload file button
                var optionUploadFile = document.createElement('div');
                    optionUploadFile.classList.add('sg-filemanager-operation', 'file-upload', 'active');
                    optionUploadFile.addEventListener('click', function(evt) {                                
                        
                        self.set({ isFileSelected: false });

                        var fileInput = document.createElement('input');
                            fileInput.setAttribute('type', 'file');
                            fileInput.style.visibility = 'hidden';
                        self.get('optionContainer').appendChild(fileInput);

                        fileInput.addEventListener('change', function(){

                            self.do('uploadWithAvailableFilename', { name: fileInput.files[0].name, data: fileInput.files[0] });    

                        });
                        
                        fileInput.click();
                        

                    });
                
                // Add new directory button (in current directory)
                var optionNewDirectory = document.createElement('div');
                    optionNewDirectory.classList.add('sg-filemanager-operation', 'directory-new', 'active');
                    optionNewDirectory.addEventListener('click', function() {
                        
                        self.get('directoryListing').scrollTop = 0;
                        
                        var selectedFiles = self.get('directoryListing').querySelectorAll('.active');
                        for (var i = 0; i < selectedFiles.length; i++) {
                            selectedFiles[i].classList.remove('active');
                        }

                        var directoryNameInputContainer = document.createElement('li');
                            directoryNameInputContainer.classList.add('sg-resource-directory', 'new');

                        var alreadyFired;
                        var directoryNameInput = document.createElement('input');
                            directoryNameInput.setAttribute('type', 'text');
                            directoryNameInput.setAttribute('value', 'NewFolder');
                            directoryNameInput.addEventListener('blur', function(evt) {
                                setDirectoryName(evt);
                                alreadyFired = true;
                            });
                            directoryNameInput.addEventListener('keydown', function(evt) {
                                if ( evt.keyCode == 13 ) {
                                    setDirectoryName(evt);
                                    alreadyFired = true;
                                }
                            });

                        directoryNameInputContainer.appendChild(directoryNameInput);
                        self.get('directoryListing').insertBefore(directoryNameInputContainer, self.get('directoryListing').firstChild);

                        directoryNameInput.focus();
                        directoryNameInput.select();
                        
                        var setDirectoryName = function(evt) {
                            
                            if (evt.target.value != '' && !alreadyFired) {
                                
                                self.set({ isWorking: true });
                                
                                var path;
                                if (self.get('currentPath') == '/' ) {
                                    path = '';
                                } else {
                                    path = self.get('currentPath');
                                }
                                
                                self.do('createAvailableDirectory', { name: evt.target.value });

                            }

                        }
                        
                    });
                
                // Rename button (file or folder)
                var optionRename = document.createElement('div');
                    optionRename.classList.add('sg-filemanager-operation', 'rename');
                    optionRename.addEventListener('click', function(evt) {
                        
                        if ( !this.classList.contains('active') ) {
                            return false;
                        }

                        // TODO: Scroll to resource position
                        //self.get('directoryListing').scrollTop = 0;
                        
                        var selectedFiles = self.get('directoryListing').querySelectorAll('.active');
                        for (var i = 0; i < selectedFiles.length; i++) {
                            selectedFiles[i].classList.remove('active');
                        }

                        var oldName = self.get('selectedName');

                        var selectedElement = self.get('directoryListing').querySelector( '[data-path="'+ self.get('basePath') +'/'+ oldName +'"]' );

                        selectedElement.classList.add('edit');

                        var alreadyFired;
                        var renameInput = document.createElement('input');
                            renameInput.setAttribute('type', 'text');
                            renameInput.setAttribute('value', oldName);
                            renameInput.addEventListener('blur', function(evt) {
                                setNewName(evt);
                                alreadyFired = true;
                            });
                            renameInput.addEventListener('keydown', function(evt) {
                                if ( evt.keyCode == 13 ) {
                                    setNewName(evt);
                                    alreadyFired = true;
                                }
                            });

                        selectedElement.appendChild(renameInput);

                        renameInput.focus();
                        renameInput.select();
                        
                        var setNewName = function(evt) {
                            
                            if (evt.target.value != '' && !alreadyFired) {
                                
                                self.set({ isWorking: true });
                                self.do('renameToAvailableFilename', { name: evt.target.value, origin: self.get('basePath') +'/'+ oldName, type: self.get('selectedType') });

                            }

                        }
                        
                    });

                // Copy button (file or folder)
                var optionCopy = document.createElement('div');
                    optionCopy.classList.add('sg-filemanager-operation', 'copy');
                    optionCopy.addEventListener('click', function(evt) {
                        
                        if ( !this.classList.contains('active') ) {
                            return false;
                        }

                        self.set({ copiedFilePath: self.get('basePath') +'/'+ self.get('selectedName') });
                        
                    });

                // Paste button (file or folder)
                var optionPaste = document.createElement('div');
                    optionPaste.classList.add('sg-filemanager-operation', 'paste');
                    optionPaste.addEventListener('click', function(evt) {
                        
                        if ( !this.classList.contains('active') || !self.get('copiedFilePath') ) {
                            return false;
                        }
                        
                        var selectedFiles = self.get('directoryListing').querySelectorAll('.active');
                        for (var i = 0; i < selectedFiles.length; i++) {
                            selectedFiles[i].classList.remove('active');
                        }

                        self.set({ isWorking: true });
                        self.do('pasteToAvailableLocation', { originPath: self.get('copiedFilePath') });
                        
                    });

                // Delete button (file or folder)
                var optionDelete = document.createElement('div');
                    optionDelete.classList.add('sg-filemanager-operation', 'delete');
                    optionDelete.addEventListener('click', function(evt) {
                        
                        if ( !this.classList.contains('active') ) {
                            return false;
                        }
                        
                        var fullPath = self.get('basePath') +'/'+ self.get('selectedName');

                        if ( self.get('selectedType') == 'file' ) {
                            var deleteFileConfirmation = confirm('Are you sure you want to delete the file:\n\n ' + fullPath + ' ?\n\nThis action is irreversible!');
                        
                            if ( deleteFileConfirmation == true ) {

                                self.set({ isWorking: true });

                                SuperGlue.get('server').do('removeFile', {
                                    path: fullPath,
                                    onerror: function() {
                                        alert('File could not be removed.\nSee console for error message.');
                                        console.log(arguments);
                                    },
                                    onsuccess: function() {
                                        
                                        self.set({ isWorking: false });
                                        self.do('listDirectory', { path: self.get('currentPath') });

                                    }
                                });

                            }
                        } else {
                            var deleteDirectoryConfirmation = confirm('Are you sure you want to delete the folder:\n\n ' + fullPath + ' \n\nand all of its contents?\nThis action is irreversible!');
                        
                            if ( deleteDirectoryConfirmation == true ) {

                                self.set({ isWorking: true });

                                SuperGlue.get('server').do('removeDirectory', {
                                    path: fullPath,
                                    onerror: function() {
                                        alert('Directory could not be removed.\nSee console for error message.');
                                        console.log(arguments);
                                    },
                                    onsuccess: function() {
                                        
                                        self.set({ isWorking: false });
                                        self.do('listDirectory', { path: self.get('currentPath') });

                                    }
                                });

                            }
                        }
                        
                    });

                optionContainerElement.appendChild(optionUploadFile);
                optionContainerElement.appendChild(optionNewDirectory);
                optionContainerElement.appendChild(optionRename);
                optionContainerElement.appendChild(optionCopy);
                optionContainerElement.appendChild(optionPaste);
                optionContainerElement.appendChild(optionDelete);


                var previewContainer = document.createElement('div');
                    previewContainer.classList.add('sg-filemanager-preview');

                self.get('content').appendChild(previewContainer);
                self.set({ previewContainer: previewContainer });
                
                self.set({ hasOKandCancelButton: startConfig.hasOKandCancelButton });
                
                if ( startConfig.context == 'saveAs' ) {
                    self.set({ originalFileName: startConfig.originalFileName });
                }

                if ( startConfig.callback ) {
                    self.set({ callback: startConfig.callback });
                }

                if ( startConfig.selectPath ) {
                    self.set({ selectPath: startConfig.selectPath });
                } else {
                    self.do('listDirectory', { path: '/' });
                }

                self.set({ context: startConfig.context });


            }
        },

        listDirectory: {
            comment:    'I list a directory by a given path.',
            code:       function(arg) {
                
                var self = this;

                self.set({ isWorking: true });

                SuperGlue.get('server').do('directoryListing', {
                    path: arg.path,
                    onerror: function() {
                        alert('Directory listing failed.\nSee console for error message.');
                        console.log(arguments);
                    },
                    onsuccess: function() { 

                        self.get('directoryListing').innerHTML = '';

                        var result = this;

                        /*
                        result.sort(function(a, b){
                            var keyA = a.isDirectory,
                                keyB = b.isDirectory;
                            if(keyA < keyB) return 1;
                            if(keyA > keyB) return -1;
                            return 0;
                        });

						*/
						var directories = [],
							files = [];

						for (var r=0; r < result.length; r++) {
							if ( result[r].isDirectory ) {
								directories.push(result[r]);
							} else {
								files.push(result[r]);
							}
						}
						
                        for (var d=0; d < directories.length; d++) {

                            var pathArray = directories[d].name.split('/');
                            var name = pathArray[pathArray.length-1];
                            var type = 'directory';
                            
                            var resultElem = document.createElement('li');
	                            resultElem.setAttribute('class', 'sg-resource-'+ type);
	                            resultElem.setAttribute('data-path', directories[d].name);
	                            resultElem.setAttribute('data-name', name);
	                            resultElem.setAttribute('data-type', type);
	                            resultElem.innerHTML = name;

	                            resultElem.addEventListener('click', function(evt) {
	                                
	                                var selectedFiles = self.get('directoryListing').querySelectorAll('.active');
	                                for (var i = 0; i < selectedFiles.length; i++) {
	                                	selectedFiles[i].classList.remove('active');
	                                }
	                                
	                                self.get('previewContainer').classList.remove('active');
	                                self.get('previewContainer').innerHTML = '';

	                                this.classList.add('active');

	                                self.set({ selectedName: this.getAttribute('data-name') });
	                                self.set({ selectedType: this.getAttribute('data-type') });
	                                self.set({ isFileSelected: true });

	                            });

	                            resultElem.addEventListener('dblclick', function(evt) {
	                                self.do('listDirectory', { path: evt.target.getAttribute('data-path') });

	                            });

	                        self.get('directoryListing').appendChild(resultElem);
                        }

                        function bytesToSize(bytes) {
						   if(bytes == 0) return '0 Byte';
						   var k = 1000;
						   var sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
						   var i = Math.floor(Math.log(bytes) / Math.log(k));
						   return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
						}

                        for (var f=0; f < files.length; f++) {

							var pathArray = files[f].name.split('/');
                            var name = pathArray[pathArray.length-1];
                        	var type = 'file';
                        	var size = bytesToSize(files[f].size);
                                
                            var fileType;
                            if ( (/\.(gif|jpg|jpeg|tiff|png)$/i).test(files[f].name) ) {
                                fileType = 'image';
                            } else if ( (/\.(html)$/i).test(files[f].name) ) {
                                fileType = 'html';
                            } else {
                            	fileType = undefined;
                            }

                            var resultElem = document.createElement('li');
	                            resultElem.classList.add('sg-resource-'+ type);
	                            
	                            if (fileType) {
	                            	resultElem.classList.add(fileType);
	                            }
	                            resultElem.setAttribute('data-path', files[f].name);
	                            resultElem.setAttribute('data-name', name);
	                            resultElem.setAttribute('data-type', type);

                                if ( fileType == 'html' ) {
                                    resultElem.innerHTML = name + '<a href="'+ files[f].name +'" target="_blank"></a><span class="size">'+ size +'</span>';
                                } else {
                                    resultElem.innerHTML = name + '<span class="size">'+ size +'</span>';
                                }
	                            
	                            resultElem.addEventListener('click', function(evt) {
	                                
	                                var selectedFiles = self.get('directoryListing').querySelectorAll('.active');
	                                for (var i = 0; i < selectedFiles.length; i++) {
	                                	selectedFiles[i].classList.remove('active');
	                                }

	                                this.classList.add('active');
	                                
	                                self.set({ selectedName: this.getAttribute('data-name') });
	                                self.set({ selectedType: this.getAttribute('data-type') });
	                                self.set({ isFileSelected: true });

	                            });

	                        self.get('directoryListing').appendChild(resultElem);    
                        }

                        if ( arg.path == '/' ) {
                            self.get('directoryControlContainer').querySelector('.directory-up').classList.remove('active');
                            self.get('optionContainer').querySelector('.delete').classList.remove('active');
                        } else {
                            self.get('directoryControlContainer').querySelector('.directory-up').classList.add('active');
                        }
                        
                        self.set({ currentPath: arg.path });

                        if ( self.get('context') == 'saveAs' && self.get('content').querySelector('.sg-modal-name-input') ) {
                        	self.set({ confirmPath: self.get('basePath') +'/'+ self.get('content').querySelector('.sg-modal-name-input').value });
                        }

                        if ( arg.selectPath && self.get('directoryListing').querySelector('[data-path="'+ arg.selectPath +'"]') ) {
                        	
                        	var selectedFiles = self.get('directoryListing').querySelectorAll('.active');
                            for (var i = 0; i < selectedFiles.length; i++) {
                            	selectedFiles[i].classList.remove('active');
                            }
                        	
                        	self.get('directoryListing').querySelector('[data-path="'+ arg.selectPath +'"]').classList.add('active');

                            self.get('directoryListing').querySelector('[data-path="'+ arg.selectPath +'"]').scrollIntoView(true);
                        	
                        	self.set({ selectedType: self.get('directoryListing').querySelector('[data-path="'+ arg.selectPath +'"]').getAttribute('data-type') });
                        	self.set({ selectedName: self.get('directoryListing').querySelector('[data-path="'+ arg.selectPath +'"]').getAttribute('data-name') });
                        	self.set({ isFileSelected: true });

                        } else {
                        	
                        	self.set({ isFileSelected: false });

                        }
                        

                        self.set({ isWorking: false });

                        if ( self.get('copiedFilePath') ) {
                        	self.get('optionContainer').querySelector('.paste').classList.add('active');
                        }
                        
                    }
                });

            }
        },

        checkName: {
            comment:    'I check if the name is valid and if not return a valid name. Params: name',
            code:       function(arg) {

                // Replace all illegal characters with '-'
                var cleanString = arg.name.replace(/ |\\|%|"|'|<|>|\/|\.\.|\$|&|\{|\}|\[|\]|#|\?|,/gi, '-');

                // Replace Umlauts
                cleanString.replace(/ä/gi, 'ae').replace(/ö/gi, 'oe').replace(/ü/gi, 'ue');

                return cleanString;

            }
        },

        createAvailableDirectory: {
            comment:    'I create a directrory with a valid and available name. Params: name, (increment)',
            code:       function(arg) {

                var self = this;

                var increment;
                if (!arg.increment) {
                	increment = 1;
                } else {
                	increment = parseInt(arg.increment)+1;
                }
                
                var cleanedName = self.do('checkName', { name: arg.name });
                
                var destination;
        		if (increment == 1) {
        			destination = self.get('basePath') +'/'+ cleanedName;
        		} else {
        			destination = self.get('basePath') +'/'+ cleanedName + '-' + increment;
        		}
            	SuperGlue.get('server').do('doesDirectoryExist', {
                    path: destination,
                    onerror: function() {
                        alert('Could not check if directory exists.\nSee console for error message.');
                        console.log(this);
                    },
                    onsuccess: function(aBoolean) {
                    	
                    	if (aBoolean) {
                    		var newIncrement = increment++;
	                    	self.do('createAvailableDirectory', { name: cleanedName, increment: newIncrement });
                    	} else {

                    		var destination;
                    		if (increment == 1) {
                    			destination = self.get('basePath') +'/'+ cleanedName;
                    		} else {
                    			destination = self.get('basePath') +'/'+ cleanedName + '-' + increment;
                    		}

                            SuperGlue.get('server').do('makeDirectory', {
                                path: destination,
                                onerror: function() {
                                    alert('Directory could not be created.\nSee console for error message.');
                                    console.log(arguments);
                                },
                                onsuccess: function() {
                                    
                                    self.set({ isWorking: false });
                                    self.do('listDirectory', { path: self.get('currentPath'), selectPath: destination });

                                }
                            });
							
                    	}
                    	

                    }
                });

            }
        },

        uploadWithAvailableFilename: {
            comment:    'I upload a file to an available location. Params: name, data, (increment)',
            code:       function(arg) {

                var self = this;

                self.set({ isWorking: true });

                var increment;
                if (!arg.increment) {
                	increment = 1;
                } else {
                	increment = parseInt(arg.increment)+1;
                }
                
                var cleanedName = self.do('checkName', { name: arg.name });
                
                var destination;
                if (increment == 1) {
                	destination = self.get('basePath') +'/'+ cleanedName;
                } else {
                	destination = self.get('basePath') + '/' + cleanedName.substr(0, (cleanedName.lastIndexOf('.')) || cleanedName) + '-' + increment + cleanedName.substring(cleanedName.lastIndexOf('.'))
                }

            	SuperGlue.get('server').do('doesFileExist', {
                    path: destination,
                    onerror: function() {
                        alert('Could not check if file already exists.\nSee console for error message.');
                        console.log(arguments);
                    },
                    onsuccess: function(aBoolean) {
                    	
                    	if (aBoolean) {

                    		var newIncrement = increment++;
	                    	self.do('uploadWithAvailableFilename', { name: cleanedName, data: arg.data, increment: newIncrement });
                    	
                    	} else {
                    		
                    		var destination;
                    		if (increment == 1) {
                    			destination = self.get('basePath') +'/'+ cleanedName;
                    		} else {
                    			destination = self.get('basePath') +'/'+ cleanedName.substr(0, (cleanedName.lastIndexOf('.')) || cleanedName) + '-' + increment + cleanedName.substring(cleanedName.lastIndexOf('.'));
                    		}

                            var progressBar = document.createElement('div');
                                progressBar.setAttribute('class', 'sg-filemanager-progress-bar');

                            var uploadProgress = document.createElement('div');
                                uploadProgress.setAttribute('class', 'sg-filemanager-progress');
                                uploadProgress.style.opacity = 1;

                            progressBar.appendChild(uploadProgress);
                            self.get('content').appendChild(progressBar);
                            
                            var file        = arg.data;
                            var uploadForm  = new FormData();

                            uploadForm.append('userimage', file);

                            SuperGlue.get('server').do('upload', {
                                data:   uploadForm,
                                path:   destination,
                                onerror: function() {
                                    alert('File could not be uploaded.\nSee console for error message.');
                                    console.log(arguments);
                                },
                                onprogress: function(evt){

                                    if(evt.lengthComputable){
                                        var percentComplete = evt.loaded / evt.total * 100;
                                        uploadProgress.style.width = percentComplete + '%';
                                    } else {
                                        uploadProgress.style.width = 40 + '%';
                                    }
                                },
                                onresponse:   function(){

                               		self.get('optionContainer').querySelector('input[type="file"]').remove();
                                    self.do('listDirectory', { path: self.get('currentPath'), selectPath: destination });
                                    
                                    uploadProgress.style.width = 100 + '%';

                                    setTimeout(function() {
                                    	uploadProgress.style.opacity = 0;
                                    	self.set({ isWorking: false });
                                    	setTimeout(function() {
                                    		self.get('content').querySelector('.sg-filemanager-progress-bar').remove();
                                    	}, 500);
                                    }, 1200);

                                }
                            });
							
                    	}
                    	

                    }
                });

            }
        },

        renameToAvailableFilename: {
            comment:    'I rename a file to an available and valid name. Params: name, origin, type, (increment)',
            code:       function(arg) {

                var self = this;

                self.set({ isWorking: true });

                var increment;
                if (!arg.increment) {
                	increment = 1;
                } else {
                	increment = parseInt(arg.increment)+1;
                }
                
                var cleanedName = self.do('checkName', { name: arg.name });
                
                var destination;
        		if (increment == 1) {
        			destination = self.get('basePath') +'/'+ cleanedName;
        		} else {
        			if ( arg.type == 'directory' ) {
        				destination = self.get('basePath') +'/'+ cleanedName + '-' + increment;
        			} else {
        				destination = self.get('basePath') +'/'+ cleanedName.substr(0, (cleanedName.lastIndexOf('.')) || cleanedName) + '-' + increment + cleanedName.substring(cleanedName.lastIndexOf('.'));
        			}
        		}

                var checkFunctionName;
                if (arg.type == 'directory') {
                	checkFunctionName = 'doesDirectoryExist';
                } else {
                	checkFunctionName = 'doesFileExist';
                }

            	SuperGlue.get('server').do(checkFunctionName, {
                    path: destination,
                    onerror: function() {
                        alert('Could not check if path already exists.\nSee console for error message.');
                        console.log(arguments);
                    },
                    onsuccess: function(aBoolean) {

                    	if (aBoolean /*&& checkPath +'/'+ cleanedName != arg.origin*/) {
                    		var newIncrement = increment++;
	                    	self.do('renameToAvailableFilename', { name: cleanedName, origin: arg.origin, type: arg.type, increment: newIncrement });
                    	
                    	} else {
                    		
                    		var destination;
                    		if (increment == 1) {
                    			destination = self.get('basePath') +'/'+ cleanedName;
                    		} else {
                    			if ( arg.type == 'directory' ) {
                    				destination = self.get('basePath') +'/'+ cleanedName + '-' + increment;
                    			} else {
                    				destination = self.get('basePath') +'/'+ cleanedName.substr(0, (cleanedName.lastIndexOf('.')) || cleanedName) + '-' + increment + cleanedName.substring(cleanedName.lastIndexOf('.'));
                    			}
                    		}
                            
                            SuperGlue.get('server').do('moveFile', {
                                sourcePath:   arg.origin,
                                targetPath:   destination,
                                onerror: function() {
                                    alert('File could not be copied to new location.\nSee console for error message.');
                                    console.log(arguments);
                                },
                                onprogress: function(evt){
                                    //
                                },
                                onsuccess:   function(){

                                    self.do('listDirectory', { path: self.get('currentPath'), selectPath: destination });                                    
                                    self.set({ isWorking: false });

                                }
                            });
							
                    	}
                    	

                    }
                });

            }
        },

        pasteToAvailableLocation: {
            comment:    'I paste a file to an available and valid location in the current directory. Params: originPath, (increment)',
            code:       function(arg) {

                var self = this;

                self.set({ isWorking: true });

                var increment;
                if (!arg.increment) {
                	increment = 1;
                } else {
                	increment = parseInt(arg.increment)+1;
                }
                
                var cleanedName = self.get('copiedFileName');
                
                var destination;
        		if (increment == 1) {
        			destination = self.get('basePath') +'/'+ cleanedName;
        		} else {
        			if ( arg.type == 'directory' ) {
        				destination = self.get('basePath') +'/'+ cleanedName + '-' + increment;
        			} else {
        				destination = self.get('basePath') +'/'+ cleanedName.substr(0, (cleanedName.lastIndexOf('.')) || cleanedName) + '-' + increment + cleanedName.substring(cleanedName.lastIndexOf('.'));
        			}
        		}

                var checkFunctionName;
                if (self.get('copiedFileType') == 'directory') {
                	checkFunctionName = 'doesDirectoryExist';
                } else {
                	checkFunctionName = 'doesFileExist';
                }

            	SuperGlue.get('server').do(checkFunctionName, {
                    path: destination,
                    onerror: function() {
                        alert('Could not check if path already exists.\nSee console for error message.');
                        console.log(arguments);
                    },
                    onsuccess: function(aBoolean) {

                    	if (aBoolean /*&& checkPath +'/'+ cleanedName != arg.origin*/) {
                    		var newIncrement = increment++;
	                    	self.do('pasteToAvailableLocation', { originPath: arg.originPath, increment: newIncrement });
                    	
                    	} else {
                    		
                    		var destination;
                    		if (increment == 1) {
                    			destination = self.get('basePath') +'/'+ cleanedName;
                    		} else {
                    			if ( arg.type == 'directory' ) {
                    				destination = self.get('basePath') +'/'+ cleanedName + '-' + increment;
                    			} else {
                    				destination = self.get('basePath') +'/'+ cleanedName.substr(0, (cleanedName.lastIndexOf('.')) || cleanedName) + '-' + increment + cleanedName.substring(cleanedName.lastIndexOf('.'));
                    			}
                    		}
                            
                            
                            var copyFunctionName;
			                if (self.get('copiedFileType') == 'directory') {
			                	copyFunctionName = 'copyDirectory';
			                } else {
			                	copyFunctionName = 'copyFile';
			                }

                            SuperGlue.get('server').do(copyFunctionName, {
                                sourcePath:   arg.originPath,
                                targetPath:   destination,
                                onerror: function() {
                                    alert('Could not copy file / directory.\nSee console for error message.');
                                    console.log(arguments);
                                },
                                onprogress: function(evt){
                                    //
                                },
                                onsuccess:   function(){

                                    self.do('listDirectory', { path: self.get('currentPath'), selectPath: destination });                                    
                                    self.set({ isWorking: false });
                                    self.set({ copiedFilePath: undefined });

                                }
                            });
							
                    	}
                    	

                    }
                });

            }
        },

        createNewPageAtAvailableLocation: {
            comment:    'I create a new file at an available and valid location in the current directory. Params: name, (increment)',
            code:       function(arg) {

                var self = this;

                self.set({ isWorking: true });

                var increment;
                if (!arg.increment) {
                    increment = 1;
                } else {
                    increment = parseInt(arg.increment)+1;
                }
                
                var cleanedName = self.do('checkName', { name: arg.name });
                
                var destination;
                if (increment == 1) {
                    destination = self.get('basePath') +'/'+ cleanedName;
                } else {
                    destination = self.get('basePath') +'/'+ cleanedName.substr(0, (cleanedName.lastIndexOf('.')) || cleanedName) + '-' + increment + cleanedName.substring(cleanedName.lastIndexOf('.'));
                }

                SuperGlue.get('server').do('doesFileExist', {
                    path: destination,
                    onerror: function() {
                        alert('Could not check if file already exists.\nSee console for error message.');
                        console.log(arguments);
                    },
                    onsuccess: function(aBoolean) {

                        if (aBoolean) {
                            var newIncrement = increment++;
                            self.do('createNewPageAtAvailableLocation', { name: arg.name, increment: newIncrement });
                        
                        } else {
                            
                            var destination;
                            if (increment == 1) {
                                destination = self.get('basePath') +'/'+ cleanedName;
                            } else {
                                destination = self.get('basePath') +'/'+ cleanedName.substr(0, (cleanedName.lastIndexOf('.')) || cleanedName) + '-' + increment + cleanedName.substring(cleanedName.lastIndexOf('.'));
                            }                            
                            
                            SuperGlue.get('server').do('newPage', {
                                newPath: destination,
                                onerror: function() {
                                    alert('There was a critical error while creating a new page.\nSee console for error message.');
                                    console.log(this);
                                },
                                onprogress: function(evt){
                                    //
                                },
                                onsuccess:   function(){

                                    self.do('listDirectory', { path: self.get('currentPath'), selectPath: destination });                                    
                                    self.set({ isWorking: false });

                                    self.set({ context: undefined });
                                    self.set({ hasOKandCancelButton: false });
                                    
                                }
                            });
                            
                        }
                        

                    }
                });

            }
        }



    }


}});