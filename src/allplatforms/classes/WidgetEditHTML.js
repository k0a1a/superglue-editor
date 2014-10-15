SC.loadPackage({ 'WidgetEditHTML': {

    comment: 'I am the widget to start editing the html manually.',

    traits:  ['Widget'],

    sharedProperties: {

        widgetMenu:  { initValue: '<div class="sg-editing-widget-container"><button id="sg-editing-widget-editHTML" class="sg-editing-widget-button" title="HTML source code"></button></div>' }

    },

    methods: {

    	init: { 
    		comment: 	'I init the widget.',
    		code: 		function(theSelection){

                this.delegate('Widget', 'init', theSelection);
                this.set({ isActionButton: true });


                var self = this,
                    onMouseUp = function(evt){

                        var elements = SuperGlue.get('selection').get('elements');

                        for(var rawHtml, i = 0, l = elements.length; i < l; i++){

                            rawHtml = elements[i].get('contentNode').innerHTML.split('\n');
                            rawHtml.forEach(function(line, idx, array){ array[idx] = line.trim(); });
                            rawHtml = rawHtml.join('\n');
                            
                            SuperGlue.get('windowManager').do('createWindow', {

                                class:      'HTMLEditor',
                                
                                html:       rawHtml,
                                
                                callback:   (function(){
                                                var contentNode = elements[i].get('contentNode'),
                                                    oldInnerHTML = contentNode.innerHTML;
                                                return function(aHTMLString){
                                                    SuperGlue.get('history').do('actionHasStarted', function(){
                                                        contentNode.innerHTML = oldInnerHTML;
                                                    });
                                                    contentNode.innerHTML = aHTMLString;
                                                    SuperGlue.get('history').do('actionHasSucceeded', function(){
                                                        contentNode.innerHTML = aHTMLString;
                                                    })
                                                }
                                            }).call(this),

                                top:        elements[i].get('top') + 30 - document.body.scrollTop,
                                left:       (SuperGlue.get('document').get('layout').centered 
                                                ? (document.documentElement.clientWidth - SuperGlue.get('document').get('layout').width) / 2
                                                : 0) 
                                            +   elements[i].get('left') + 30 - document.body.scrollLeft,
                                width:      600,
                                height:     300
                            });

                        }


                    };

                this.get('widgetButton').addEventListener('mouseup', onMouseUp, false)


    		}

    	}


    }


}});