SC.loadPackage({ 'WidgetDelete': {

    comment: 'I am the delete widget.',

    traits:  ['Widget'],

    sharedProperties: {

        widgetMenu:  { initValue: '<div class="sg-editing-widget-container"><button id="sg-editing-widget-delete" class="sg-editing-widget-button"></button></div>' }

    },

    methods: {

    	init: { 
    		comment: 	'I init the widget.',
    		code: 		function(theSelection){

                this.delegate('Widget', 'init', theSelection);
                this.set({ isActionButton: true });

                var self = this;

                this.get('widgetButton').addEventListener('mouseup', function(evt){

                    self.do('action');

                }, false);


    		}

    	}, 

        action: {
            comment: 'I do the job.',
            code: function(){

                var elements = this.get('selection').get('elements').slice();
                this.get('selection').do('clearAll');

                SuperGlue.get('history').do('actionHasStarted', (function(elements){

                    var indicesAndElements = [];
                    for(var i = 0, l = elements.length; i < l; i++){
                        indicesAndElements.push({
                            index:   SuperGlue.get('document').get('children').indexOf(elements[i]),
                            element: elements[i]
                        })
                    }
                    indicesAndElements.sort(function(a, b){
                        if(a.index > b.index){
                            return 1;
                        }else{
                            return -1;
                        }
                    });

                    return function(){

                        for(var i = 0, l = indicesAndElements.length; i < l; i++){
                            SuperGlue.get('document').do('insertElement', indicesAndElements[i]);
                        }
                        
                    }


                }).call(this, elements));

                var deleteElements = function(){
                    for(var i = 0, l = elements.length; i < l; i++){
                        SuperGlue.get('document').do('removeElement', elements[i]);
                    }
                };

                deleteElements();

                SuperGlue.get('history').do('actionHasSucceeded', deleteElements);

            }
        }


    }


}});