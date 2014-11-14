SC.loadPackage({ 'MenuItemSaveLocal': {

    comment: 'I am the MenuItem for saving the page on the local computer.',

    traits:  ['MenuItem'],

    sharedProperties: {

        menuContainer:  { initValue: '<div class="sg-editing-menu-container"><button id="sg-editing-menu-saveLocal" class="sg-editing-menu-button" title="save page on my computer (download)"></button></div>' }

    },

    methods: {

    	init: { 
    		comment: 	'I init the MenuItem.',
    		code: 		function(theDocumentMenu){

                var self = this;

                this.delegate('MenuItem', 'init', theDocumentMenu);
                this.set({ isActionButton: true });

                this.get('menuContainer').firstChild.addEventListener('mouseup', function(evt){
                    self.do('action');
                    theDocumentMenu.do('close');
                }, false);


    		}

    	}, 

        action: {
            comment: 'I do the job.',
            code: function(){

                var thisPage = SC.init('Compiler').get('pageAsHTML5'),
                    link     = document.createElement('a')
                    filename = document.location.pathname.split('/').slice(-1)[0];

                link.setAttribute('href', 
                    'data:text/html;charset=utf-8,' + encodeURIComponent(thisPage)
                );

                link.setAttribute('download',
                    filename ? filename : 'index.html'
                );

                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                

            }
        }


    }


}});