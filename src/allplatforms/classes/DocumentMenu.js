SC.loadPackage({ 'DocumentMenu': {

    comment: 'I am the DocumentMenu which is shown on click on the document background.',

    sharedProperties: {
        menuContainer: { initValue: '<div id="sg-editing-document-menu"><div id="sg-editing-document-menu-top"></div><div id="sg-editing-document-menu-left"></div></div>' },
    },

    properties: {
        myNode:         { comment: 'I hold my DOM node.' },
        topContainer:   { comment: 'I hold the DOM node for the topContainer.' },
        leftContainer:  { comment: 'I hold the DOM node.for the leftContainer.' },
        menuItemsTop:   { comment: 'I hold the MenuItems for the top container.' },
        menuItemsLeft:  { comment: 'I hold the MenuItems for the left container.' },
        activeMenuItem: { comment: 'I hold the active MenuItems or null.' }
    },

    methods: {

    	init: { 
    		comment: 	'I init myself. Called from Document>>init.',
    		code: 		function(){

                var myNode        = (new DOMParser()).parseFromString(this.class.get('menuContainer'), 'text/html').body.firstChild,
                    topContainer  = myNode.firstChild,
                    leftContainer = myNode.lastChild,

                    menuItemsTop  = [],
                    menuItemsLeft = [],
                    menuItemsClassesTop  = [ 'MenuItemFileManager', 'MenuItemSave', 'MenuItemSaveAs', 'MenuItemSaveRemote', 'MenuItemOutlines', 'MenuItemPaste', 'MenuItemUndo', 'MenuItemRedo' ],
                    menuItemsClassesLeft = [ 'MenuItemCenter', 'MenuItemPageTitle', 'MenuItemBackgroundColor', 'MenuItemBackgroundImg', 'MenuItemBackgroundRepeat' ],
                    menuItem = null;


                for(var i = 0, l = menuItemsClassesTop.length; i < l; i++){
                    menuItem = SC.init(menuItemsClassesTop[i], this);
                    menuItemsTop.push(menuItem);
                    topContainer.appendChild(menuItem.get('menuContainer'));
                }

                for(var i = 0, l = menuItemsClassesLeft.length; i < l; i++){
                    menuItem = SC.init(menuItemsClassesLeft[i], this);
                    menuItemsLeft.push(menuItem);
                    leftContainer.appendChild(menuItem.get('menuContainer'));
                }
                
                
                this.set({
                    myNode:         myNode,
                    menuItemsTop:   menuItemsTop,
                    menuItemsLeft:  menuItemsLeft,
                    topContainer:   topContainer,
                    leftContainer:  leftContainer,
                    activeMenuItem: null
                });

    		}
    	},

        trigger: {
            comment: 'Show me at { x: anInt, y: anInt }',
            code: function(myCoordinates){

                var myNode        = this.get('myNode');

                if(myNode.parentNode === document.body){
                    return this.do('close');
                }


                document.body.insertBefore(myNode, SuperGlue.get('windowManager').get('windowsContainer'));

            }
        },

        close: {
            comment: 'Hide me!',
            code: function(){

                if(this.get('activeMenuItem') !== null){
                    this.get('activeMenuItem').set({ isMenuItemActive: false });
                    this.set({ activeMenuItem: null });
                }

                var myNode = this.get('myNode');
                if(myNode.parentNode === document.body){
                    document.body.removeChild(myNode);
                }

            }
        }


    }


}});