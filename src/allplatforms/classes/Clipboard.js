SC.loadPackage({ 'Clipboard': {

    comment: 'I am a proxy to the clipboard, which is managed by the add-on platform specific code.',


    properties: {

        copyField:  { comment: 'I hold a hidden textinput DOM element, which copies text to the clipboard' },

        pasteField: { comment: 'I hold a hidden textinput DOM element, which pastes text from the clipboard' }

    },


    methods: {

        init: { 
            comment:    'I init the proxy to system clipboard.',
            code:       function(){

                this.set({
                    copyField:  document.querySelector('#sg-editing-clipboard-copy'),
                    pasteField: document.querySelector('#sg-editing-clipboard-paste')
                })

            }
        },

        copy: {
            comment: 'I copy things to the system clipboard.',
            code: function(data){

                this.get('copyField').value = data;
                this.get('copyField').click();

            }
        },

        paste: {
            comment: 'I paste things from the system clipboard.',
            code: function(callback){

                this.get('pasteField').click();

                var self = this;
                window.setTimeout(function(){
                    callback.call(self, self.get('pasteField').value)
                }, 300)

            }
        }


    }


}});