SC.loadPackage({ 'EmbedElement': {

    comment: 'I define an embed element, for including foreign resources with so-called "embed codes".',

    traits: [ 'Element' ],


    sharedProperties: {
        protoHTML:          { initValue: '<div class="sg-element" data-superglue-type="EmbedElement" style="left: 0px; top: 0px; width: 0px; height: 0px;">'
                                        +'\t<pre><h1>&lt;/&gt;</h1>Replace this with HTML code.</pre>'
                                        +'</div>' },
        applicableWidgets:  { initValue: [ 'WidgetBackgroundColor', 'WidgetBorderColor', 'WidgetBorder', 'WidgetBorderRadius', 'WidgetPadding', 'WidgetOpacity' ] },
        creationMenuItem:   { initValue: '<div class="sg-editing-creation-menu-container"><button id="sg-editing-creation-menu-embedElement" class="sg-editing-creation-menu-button" title="HTML source code"></button></div>' }
    },
    
    properties: {

    },

    methods: {

    	init: { 
    		comment: 	'I initalize a new EmbedElement for the DOM node given to me as argument.',
    		code: 		function(aNode){

                this.delegate('Element', 'init', aNode);

                // Custom initialisation here

                

    		}
    	}


    }


}});