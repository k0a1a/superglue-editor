SC.loadPackage({ 'SCGUI': {


    comment: 'I provide help constructing a GUI. I am made to be used as a mixin to other classes, or as storage for static methods.',

    properties: {
        mySCGUIWindow: { comment: 'I store a reference to the standard window.' }
    },

    methods: {


        createElement: {
            comment: 'I create an GUI element. I expect an object as argument like this: \n{\n'+
                '\ttype:   type of HTMLElement to create (aString)\n'+
                '\twindow: window object (optional)\n'+
                '\tparent: parent to append to (optional, aString)\n'+
                '\tid:     ID of the element (optional, aString)\n'+
                '\tattr:   attributes of the element (optional, object of key-value-pairs)\n'+
                '\tinner:  string for innerHTML (optional, aString)\n'+
                '}',
            code: function (arg){
                var elementToCreate = document.createElement(arg.type);
                
                for(var key in arg.attr){
                    elementToCreate.setAttribute(key, arg.attr[key]);
                }
                if(arg.id)      elementToCreate.setAttribute('id', arg.id);
                if(arg.inner)   elementToCreate.innerHTML = arg.inner;
                if(arg.parent)  {
                    var window = arg.window || this.get('mySCGUIWindow') || window;
                    var parent = window.document.getElementById(arg.parent);
                    return parent.appendChild(elementToCreate);
                }else{
                    return elementToCreate;
                }
                
            }
        },

        getElement: {
            comment: 'I get an element. I expect an object as argument like this: \n{\n'+
            '\tid:      element to work on\n'+
            '\twindow:  window object (optional)\n'+
            '}',
            code: function(arg){
                var window = arg.window || this.get('mySCGUIWindow') || window;
                return window.document.getElementById(arg.id);
            }
        },

        setAttribute: {
            comment: 'I set the attributes of an element. I expect an object as argument like this: \n{\n'+
            '\tid:      element to work on\n'+
            '\twindow:  window object (optional)\n'+
            '\tattr:    key-value-pairs of the attributes\n'+
            '}',
            code: function(arg){
                var window = arg.window || this.get('mySCGUIWindow') || window;
                for(key in arg.attr){
                    window.document.getElementById(arg.id).setAttribute(key, arg.attr[key]);
                }
            }
        },

        addListener: {
            comment: 'I add an eventListener to an element. I expect an object as argument like this: \n{\n'+
            '\tid:       element to work on\n'+
            '\twindow:   window object (optional)\n'+
            '\tevent:    name of the event\n'+
            '\tcallback: the callback function for the event\n'+
            '\tbubbling: true|false\n'+
            '}',
            code: function(arg){
                var window = arg.window || this.get('mySCGUIWindow') || window,
                    self   = this;
                window.document.getElementById(arg.id).addEventListener(
                    arg.event,
                    function(){
                        arg.callback.apply(self, arguments);
                    },
                    arg.bubbling
                );
            }
        },

        showElement: {
            comment: 'I make an element visible. I expect an object as argument like this: \n{\n'+
            '\tid:     element to show\n'+
            '\twindow: window object (optional)\n'+
            '}',
            code: function(arg){
                var window = arg.window || this.get('mySCGUIWindow') || window;
                window.document.getElementById(arg.id).style.visibility = 'visible';
            }
        },

        hideElement: {
            comment: 'I make an element invisible. I expect an object as argument like this: \n{\n'+
            '\tid:     element to show\n'+
            '\twindow: window object (optional)\n'+
            '}',
            code: function(arg){
                var window = arg.window || this.get('mySCGUIWindow') || window;
                window.document.getElementById(arg.id).style.visibility = 'hidden';
            }
        },

        emptyElement: {
            comment: 'I empyt the innerHTML of an element. I expect an object as argument like this: \n{\n'+
            '\tid:     element to be emptied\n'+
            '\twindow: window object (optional)\n'+
            '}',
            code: function(arg){
                var window = arg.window || this.get('mySCGUIWindow') || window;
                window.document.getElementById(arg.id).innerHTML = '';
            }
        },

        deselectOptions: {
            comment: 'I deselect all options in a select box. I expect an object as argument like this: \n{\n'+
            '\tid:     select box element\n'+
            '\twindow: window object (optional)\n'+
            '}',
            code: function(arg){
                var window = arg.window || this.get('mySCGUIWindow') || window;
                var select = window.document.getElementById(arg.id);
                for(var i = 0; i < select.options.length; i++){
                    select.options[i].selected = false;
                }
            }
        }


    }


}});