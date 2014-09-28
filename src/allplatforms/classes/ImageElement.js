SC.loadPackage({ 'ImageElement': {

    comment: 'I define an image element.',

    traits: [ 'Element' ],


    sharedProperties: {
        protoHTML:          { initValue: '<div class="sg-element" data-superglue-type="ImageElement" style="left: 0px; top: 0px; width: 0px; height: 0px;">'
                                        +'\t<img src="/resources/img/defaultImage.png" style="min-width: 100%; min-height: 100%;">'
                                        +'</div>' },
        applicableWidgets:  { initValue: [ 'WidgetBackgroundColor', 'WidgetBorderColor', 'WidgetBorder', 'WidgetBorderRadius', 'WidgetPadding', 'WidgetOpacity', 'WidgetImgLink', 'WidgetImgDimensions', 'WidgetImgSrc' ] },
        creationMenuItem:   { initValue: '<div class="sg-editing-creation-menu-container"><button id="sg-editing-creation-menu-imageElement" class="sg-editing-creation-menu-button" data-tooltip="Image"></button></div>' }
    },

    properties: {

        imgSource:     {
            comment: 'I hold the source of the image as string.',
            transform: function(aString){

                var contentNode   = this.get('node'),
                    hasLink       = contentNode.firstElementChild.tagName === 'A',
                    imgDomElement = hasLink
                                    ? contentNode.firstElementChild.firstElementChild
                                    : contentNode.firstElementChild,
                    elementType   = imgDomElement.tagName;

                if(elementType === 'DIV'){
                    imgDomElement.style.backgroundImage = 'url("' + aString + '")';
                }else{
                    imgDomElement.src = aString;
                }



                return aString;
            }
        },

        dimensions: {
            comment: 'An ImageElement can have 6 enumerative dimension options: tile, tileX, tileY, stretch, stretchAspectRatio, aspectRatio',
            transform: function(aSymbolicString){

                var contentNode   = this.get('node'),
                    hasLink       = contentNode.firstElementChild.tagName === 'A',
                    imgDomElement = hasLink
                                    ? contentNode.firstElementChild.firstElementChild
                                    : contentNode.firstElementChild,

                    imgSrc        = this.get('imgSource'),

                    newImgDomElement;


                switch(aSymbolicString){
                    case 'tile':
                        newImgDomElement = document.createElement('div');
                        newImgDomElement.style.width  = '100%';
                        newImgDomElement.style.height = '100%';
                        newImgDomElement.style.backgroundImage  = 'url("' + imgSrc + '")';
                        newImgDomElement.style.backgroundRepeat = 'repeat';
                        break;

                    case 'tileX':
                        newImgDomElement = document.createElement('div');
                        newImgDomElement.style.width  = '100%';
                        newImgDomElement.style.height = '100%';
                        newImgDomElement.style.backgroundImage  = 'url("' + imgSrc + '")';
                        newImgDomElement.style.backgroundRepeat = 'repeat-x';
                        break;

                    case 'tileY':
                        newImgDomElement = document.createElement('div');
                        newImgDomElement.style.width  = '100%';
                        newImgDomElement.style.height = '100%';
                        newImgDomElement.style.backgroundImage  = 'url("' + imgSrc + '")';
                        newImgDomElement.style.backgroundRepeat = 'repeat-y';
                        break;

                    case 'stretch':
                        newImgDomElement = document.createElement('img');
                        newImgDomElement.style.width  = '100%';
                        newImgDomElement.style.height = '100%';
                        newImgDomElement.src = imgSrc;
                        break;

                    case 'stretchAspectRatio':
                        newImgDomElement = document.createElement('img');
                        newImgDomElement.style.minWidth  = '100%';
                        newImgDomElement.style.minHeight = '100%';
                        newImgDomElement.src = imgSrc;
                        break;

                    case 'aspectRatio':
                        newImgDomElement = document.createElement('img');
                        newImgDomElement.src = imgSrc;
                        break;

                    default:
                        newImgDomElement = imgDomElement;
                        break;

                }

                if(hasLink){

                    contentNode.firstElementChild.removeChild(imgDomElement);
                    contentNode.firstElementChild.appendChild(newImgDomElement);

                }else{

                    contentNode.removeChild(imgDomElement);
                    contentNode.appendChild(newImgDomElement);

                }

                return aSymbolicString;
            }
        }

    },

    methods: {

    	init: { 
    		comment: 	'I initalize a new ImageElement for the DOM node given to me as argument.',
    		code: 		function(aNode){

                this.delegate('Element', 'init', aNode);

                // Custom initialisation here
                var contentNode   = this.get('node'),
                    hasLink       = contentNode.firstElementChild.tagName === 'A',
                    imgDomElement = hasLink
                                    ? contentNode.firstElementChild.firstElementChild
                                    : contentNode.firstElementChild,

                    imgSource     = imgDomElement.tagName === 'IMG'
                                    ? imgDomElement.src
                                    : imgDomElement.style.backgroundImage.split('url("').join('').split('")').join('')
                                                                         .split('url(').join('').split(')').join('');

                    if(document.location.origin !== "null"){
                        imgSource = imgSource.replace(document.location.origin, '')
                    }

                    this.set({ imgSource: imgSource });

    		}
    	},

        renderYourself: {
            comment: 'I represent myself as a string to the compiler.',
            code: function(config){

                var indent = '\n' + Array(config.indent).join('\t'),
                    thisElement,
                    contentNode;

                contentNode = (this.get('node').innerHTML
                                        .split('\n')
                                        .filter(function(line){ return line.trim() !== '' })
                                        .join('\n'));

                if(document.location.origin !== "null"){
                    contentNode = contentNode.replace(document.location.origin, '')
                }
                
                contentNode = contentNode.replace('url("', 'url(').replace('");', ');');


                thisElement = indent + '<div class="sg-element" data-superglue-type="ImageElement" style="'
                                        +this.get('node').getAttribute('style')
                                        +'"'
                                        +(this.get('group') 
                                            ? (' data-superglue-group="'+ this.get('group') +'"')
                                            : '')
                                        +'>'

                            + '\n' +    contentNode
                            
                            + indent + '</div>';


                return thisElement;

            }
        }


    }


}});