SC.loadPackage({ 'HTMLEditor': {

    comment: 'This is the HTML editor.',

    traits: ['Window'],


    properties: {

        html:       { comment: 'I hold the html which the user wants to edit' },
        callback:   { comment: 'I hold the callback function, which takes as its single argument the edited HTMLString.' }

    },

    methods: {

    	init: { 
    		comment: 	'I start a new HTMLEditor. My argument is '+
                        '{ html: aHTMLString, callback: function(aHTMLString){},'+
                        '  top: anInt, left: anInt, width: anInt, height: anInt }.',
    		code: 		function(startConfig){

                var self = this;
                
                self.delegate('Window', 'init', startConfig);

                // Hide Closebtn as window is always modal
                self.get('content').parentNode.querySelector('.sg-editing-window-closebutton').style.display = 'none';

                self.set({ 
                    callback: startConfig.callback,
                    html:     startConfig.html
                });
                
                var editTextarea = document.createElement('textarea');
                    editTextarea.classList.add('sg-editing-superuser-textarea');
                    editTextarea.value = self.get('html');

                    

                self.get('content').appendChild(editTextarea);
                editTextarea.focus();
                
                var modalButtonContainer = document.createElement('div');
                    modalButtonContainer.classList.add('sg-editing-superuser-modal-container');

                var modalButtonConfirm = document.createElement('button');
                    modalButtonConfirm.classList.add('confirm');
                    modalButtonConfirm.addEventListener('click', function() {
                        self.get('callback').call(self, editTextarea.value);
                        SuperGlue.get('windowManager').do('closeWindow', self);
                    });

                var modalButtonCancel = document.createElement('button');
                    modalButtonCancel.classList.add('cancel');
                    modalButtonCancel.addEventListener('click', function() {
                        SuperGlue.get('windowManager').do('closeWindow', self);
                    });

                modalButtonContainer.appendChild(modalButtonConfirm);
                modalButtonContainer.appendChild(modalButtonCancel);
                this.get('content').appendChild(modalButtonContainer);



    		}
    	}


    }


}});