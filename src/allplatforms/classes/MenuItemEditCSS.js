SC.loadPackage({ 'MenuItemEditCSS': {

    comment: 'I am the MenuItem for editing costum CSS in the page\'s head.',

    traits:  ['MenuItem'],

    sharedProperties: {

        menuContainer:  { initValue: '<div class="sg-editing-menu-container"><button id="sg-editing-menu-editCSS" class="sg-editing-menu-button" title="edit CSS code of the page"></button></div>' }

    },

    methods: {

    	init: { 
    		comment: 	'I init the MenuItem.',
    		code: 		function(theDocumentMenu){

                this.delegate('MenuItem', 'init', theDocumentMenu);
                this.set({ isActionButton: true });

                var self = this;
                
                this.get('menuContainer').firstChild.addEventListener('mouseup', function(evt){

                    var createState = function(){
                                            var savedUserCSS = document.querySelector('style[data-superglue-css="user"]').innerHTML;
                                            return function(){
                                                document.querySelector('style[data-superglue-css="user"]').innerHTML = savedUserCSS;
                                            }
                                        };

                        


                    var rawCSS      = document.querySelector('style[data-superglue-css="user"]').innerHTML
                                        .split('\n')
                                        .filter(function(line){ return line.trim() !== '' }),
                        whitespace  = [],
                        cutOff      = 0;

                    rawCSS.forEach(function(line){
                        whitespace.push( line.length - line.trimLeft().length );
                    });
                    cutOff = Math.min.apply(Math, whitespace);

                    for(var i = 0, l = rawCSS.length; i < l; i++){

                        rawCSS[i] = rawCSS[i].substr(cutOff);

                    }

                    rawCSS = rawCSS.join('\n');


                    
                    SuperGlue.get('windowManager').do('createWindow', {

                        class:      'HTMLEditor',
                        
                        html:       rawCSS,
                        
                        callback:   function(aString){
                                        

                                        var renderedCSS = aString.split('\n').filter(function(line){ return line.trim() !== '' }),
                                            whitespace  = [],
                                            cutOff      = 0;

                                        renderedCSS.forEach(function(line){
                                            whitespace.push( line.length - line.trimLeft().length );
                                        });
                                        cutOff = Math.min.apply(Math, whitespace);

                                        for(var i = 0, l = renderedCSS.length; i < l; i++){

                                            renderedCSS[i] = '\t\t\t' + renderedCSS[i].substr(cutOff);

                                        }

                                        renderedCSS = renderedCSS.join('\n');

                                        
                                        SuperGlue.get('history').do('actionHasStarted', createState());
                                        document.querySelector('style[data-superglue-css="user"]').innerHTML = renderedCSS;
                                        SuperGlue.get('history').do('actionHasSucceeded', createState());
                                        
                                    },

                        top:        70,
                        left:       80,
                        width:      600,
                        height:     300
                    });


                    theDocumentMenu.do('close');



                }, false);


    		}

    	}


    }


}});