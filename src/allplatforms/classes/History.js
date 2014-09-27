SC.loadPackage({ 'History': {

    comment: 'I manage the history of the editing session.',


    properties: {

        stack:              { comment: 'I hold the action stack.' },
        stackPointer:       { comment: 'I hold the action stack.' },
        actionInProgress:   { comment: 'Wether an action hast started and not succeeded nor failed yet.' },
        temporaryRestoreFunc: { comment: 'During actionInProgress a store temporarily the restoreFunction.' }

    },

    methods: {

        init: { 
            comment: 'I initialise the history object.',
            code: function(){

                this.set({
                    stack:              [],
                    stackPointer:       0,
                    actionInProgress:   false
                });

            }
        },

        undo: { 
            comment: 'I undo.',
            code: function(){

                if(this.get('stackPointer') === 0){
                    return;
                }
                this.set({ stackPointer: (this.get('stackPointer') - 1) });
                this.get('stack')[this.get('stackPointer')].restoreFunction.call();
console.log('undo', this.get('stackPointer'));
            }
        },


        redo: { 
            comment: 'I redo.',
            code: function(){

                if(this.get('stackPointer') >= this.get('stack').length){
                    return;
                }
                this.get('stack')[this.get('stackPointer')].repeatFunction.call();
                this.set({ stackPointer: (this.get('stackPointer') + 1) });
console.log('redo', this.get('stackPointer'));
            }
        },


        actionHasStarted: { 
            comment: 'I undo.',
            code: function(restoreFunction){

                this.set({ 
                    actionInProgress: true,
                    temporaryRestoreFunc: restoreFunction
                });

console.log('start', this.get('stack'))

            }
        },

        actionHasSucceeded: { 
            comment: 'I undo.',
            code: function(repeatFunction){

                if(this.get('actionInProgress') === false){
                    console.log('cleared corrupted history')
                    this.do('init');
                    return;
                }

                this.set({ actionInProgress: false });

                this.get('stack')[this.get('stackPointer')] = {
                    restoreFunction: this.get('temporaryRestoreFunc'),
                    repeatFunction:  repeatFunction
                };

                this.set({ stackPointer: (1 + this.get('stackPointer')) });

                if(this.get('stack').length > this.get('stackPointer')){
                    this.get('stack').splice(this.get('stackPointer'));
                }

                if(this.get('stack').length > 40){
                    this.get('stack').splice(0, 1);
                    this.set({ stackPointer: (this.get('stackPointer') - 1) });
                }

console.log('success', this.get('stack').length)

            }
        }


    }


}});