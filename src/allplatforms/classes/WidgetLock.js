SC.loadPackage({ 'WidgetLock': {

    comment: 'I am the Lock widget to lock a multiple selection to one group.',

    traits:  ['Widget'],

    sharedProperties: {

        widgetMenu:  { initValue: '<div class="sg-editing-widget-container"><button id="sg-editing-widget-lock" class="sg-editing-widget-button" title="group/ungroup"></button></div>' }

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

                        self.do('action');

                    };

                this.get('widgetButton').addEventListener('mouseup', onMouseUp, false)


    		}

    	}, 


        action: {
            comment: 'I do the job.',
            code: function(){

                SuperGlue.get('history').do('actionHasStarted', this.do('createState'))

                if(this.get('locked')){

                    for(var myElements = this.get('selection').get('elements'),
                            i = 0, l = myElements.length; i < l; i++){

                        myElements[i].set({ group: null });

                    }

                }else{

                    for(var groupID    = Date.now(),
                            myElements = this.get('selection').get('elements'),
                            i = 0, l = myElements.length; i < l; i++){

                        myElements[i].set({ group: groupID });

                    }

                }

                this.get('selection').do('updateLockGroup');

                SuperGlue.get('history').do('actionHasSucceeded', this.do('createState'))
                
            }
        },


        createState: {
            comment: 'I create a reflection function to restore a state.',
            code: function(){

                return  (function(elements){
                            var savedGroupState = []
                            for(var i = 0, l = elements.length; i < l; i++){
                                savedGroupState.push(elements[i].get('group'))
                            }
                            return function(){
                                for(var i = 0, l = elements.length; i < l; i++){
                                    elements[i].set({ group: savedGroupState[i] }) 
                                }
                            }
                        }).call(this, this.get('selection').get('elements'));


            }

        }


    }


}});