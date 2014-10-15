SC.loadPackage({ 'IFrameElement': {

    comment: 'I define an iframe element.',

    traits: [ 'Element' ],
    

    sharedProperties: {
        protoHTML:          { initValue: '<div class="sg-element" data-superglue-type="IFrameElement" style="left: 0px; top: 0px; width: 0px; height: 0px;">'
                                        +'\t<iframe src="http://localhost/" style="width: 100%; height: 100%;"></iframe>'
                                        +'</div>' },
        applicableWidgets:  { initValue: [ 'WidgetBackgroundColor', 'WidgetBorderColor', 'WidgetBorder', 'WidgetBorderRadius', 'WidgetPadding', 'WidgetOpacity', 'WidgetIFrame' ] },
        creationMenuItem:   { initValue: '<div class="sg-editing-creation-menu-container"><button id="sg-editing-creation-menu-iframeElement" class="sg-editing-creation-menu-button" title="other web page"></button></div>' }
    },

    properties: {

    },

    methods: {

    	init: { 
    		comment: 	'I initalize a new IFrameElement for the DOM node given to me as argument.',
    		code: 		function(aNode){

                this.delegate('Element', 'init', aNode);

                // Custom initialisation here

                

    		}
    	}


    }


}});