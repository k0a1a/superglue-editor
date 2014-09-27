SC.loadPackage({ 'TextElement': {

    comment: 'I define a text element.',

    traits: [ 'Element' ],
    
    
    sharedProperties: {
        protoHTML:          { initValue: '<div class="sg-element" data-superglue-type="TextElement" style="left: 0px; top: 0px; width: 0px; height: 0px;">'
                                        +'\t<p>Text</p>'
                                        +'</div>' },
        applicableWidgets:  { initValue: [ 'WidgetBackgroundColor', 'WidgetBorderColor', 'WidgetBorder', 'WidgetBorderRadius', 'WidgetPadding', 'WidgetOpacity' ] },
        creationMenuItem:   { initValue: '<div class="sg-editing-creation-menu-container"><button id="sg-editing-creation-menu-textElement" class="sg-editing-creation-menu-button" data-tooltip="Text"></button></div>' }
    },

    properties: {

    },

    methods: {

        init: { 
            comment:    'I initalize a new TextElement for the DOM node given to me as argument.',
            code:       function(aNode){

                this.delegate('Element', 'init', aNode);

                // Custom initialisation here

                

            }
        },

        activateTextEditor: { 
            comment:    'I start the text editor on my element.',
            code:       function(){


                SC.init('TextEditor', this);
                

            }
        }

    }


}});