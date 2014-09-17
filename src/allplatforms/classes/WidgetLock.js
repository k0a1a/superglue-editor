SC.loadPackage({ 'WidgetLock': {

    comment: 'I am the Lock widget to lock a multiple selection to one group.',

    traits:  ['Widget'],

    sharedProperties: {

        widgetMenu:  { initValue: '<div class="sg-editing-widget-container"><button id="sg-editing-widget-lock" class="sg-editing-widget-button"></button></div>' }

    },

    properties: {
        locked:     { comment:    'Am I currently locked?',
                      transform:  function(aBoolean){
                            if(aBoolean){
                                this.get('widgetButton').classList.add('unlocked');
                            }else{
                                this.get('widgetButton').classList.remove('unlocked');
                            }
                            return aBoolean;
                      }
                    }
    },

    methods: {

    	init: { 
    		comment: 	'I init the widget.',
    		code: 		function(theSelection){

                this.delegate('Widget', 'init', theSelection);
                this.set({ isActionButton: true });

                var self = this,
                    onMouseUp = function(evt){

                        if(self.get('locked')){

                            for(var myElements = self.get('selection').get('elements'),
                                    i = 0, l = myElements.length; i < l; i++){

                                myElements[i].set({ group: null });

                            }

                        }else{

                            for(var groupID    = Date.now(),
                                    myElements = self.get('selection').get('elements'),
                                    i = 0, l = myElements.length; i < l; i++){

                                myElements[i].set({ group: groupID });

                            }

                        }

                        self.get('selection').do('updateLockGroup');

                    };

                this.get('widgetButton').addEventListener('mouseup', onMouseUp, false)


    		}

    	}


    }


}});