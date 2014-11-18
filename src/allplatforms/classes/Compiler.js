SC.loadPackage({ 'Compiler': {


    comment: 'I compile W3C HTML5 conpliant self-contained documents from this editor\'s current document.',

    properties: {

        pageAsHTML5: {

            comment: 'I compile to HTML5.',
            transform: function(theDocument){

                var thePage = '';

                thePage += '<!DOCTYPE html>\n<html>';

                thePage +=   '\n\t<head>'
                            +'\n\t\t<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">'
                            +'\n\t\t<meta name="generator" content="SuperGlue" data-superglue-version="'
                                    +SuperGlue.class.get('version')
                                    +'" data-superglue-settings="">'
                            +'\n\t\t<title>'
                                    +document.getElementsByTagName('title')[0].innerHTML
                                    +'</title>'
                            +'\n\t\t<style type="text/css" data-superglue="default-css">'
                            +'\n\t\t\tbody { margin: 0px; padding: 0px; }'
                            +'\n\t\t\t#sg-page { position: relative; top: 0px; }'
                            +'\n\t\t\t#sg-page.sg-page-centered { margin: 0px auto; }'
                            +'\n\t\t\t.sg-element { position: absolute; overflow: hidden; }'
                            +'\n\t\t</style>'
                            +'\n\t\t<link rel="stylesheet" href="/resources/css/SuperGlue.css" data-superglue="text-css">'
                            +'\n\t</head>';
                
                thePage += '\n\t<body style="'+ (document.body.getAttribute('style')
                                                    ? document.body.getAttribute('style').replace(document.location.origin, '')
                                                                                         .replace('url("', 'url(')
                                                                                         .replace('");', ');')
                                                    : '')

                            +'">';
        
                thePage += '\n\t\t<div id="sg-page" '
                            + (theDocument.get('layout').centered 
                                ? ('class="sg-page-centered" style="width: ' + theDocument.get('layout').width + 'px;" ')
                                : '')
                            + 'data-superglue-grid="'
                                + (theDocument.get('grid').get('active') ? 'on' : 'off')
                                + '/'
                                + theDocument.get('grid').get('gridSize')
                                + 'px">';
                

                for(var children = theDocument.get('children'),
                        i = 0, l = children.length; i < l; i++){

                    thePage += children[i].do('renderYourself', { indent: 4 })

                }
                
                
                thePage += '\n\t\t</div>\n\t</body>\n</html>';

                
                return thePage;

            }

        }

    },

    methods: {

        init: {
            comment:  'I init the compiler (currently no options, only html5).',
            code:     function(){


                this.set({ pageAsHTML5: SuperGlue.get('document') });


            }

        }

    }

}});