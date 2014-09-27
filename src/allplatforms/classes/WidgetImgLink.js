SC.loadPackage({ 'WidgetImgLink': {

    comment: 'I am the widget controlling a href link on an ImageElement.',

    traits:  ['Widget'],

    sharedProperties: {

        widgetMenu:  { initValue: '<div class="sg-editing-widget-container"><button id="sg-editing-widget-imgLink" class="sg-editing-widget-button"></button></div>' },

        widgetPanel: { initValue:   '<div id="sg-editing-widget-imgLink-panel">'
                                        +'<div class="sg-editing-widget-panel">'
                                            +'<div class="sg-widget-triangle-up"></div>'
                                            +'<input  id="sg-editing-widget-imgLink-input" type="text"></input>'
                                            +'<button id="sg-editing-widget-imgLink-chooseFile" class="sg-editing-widget-button"></button>'
                                            +'<button id="sg-editing-widget-imgLink-clear" class="sg-editing-widget-button"></button>'
                                        +'</div>'
                                    +'</div>' }

    },

    properties: {

        widgetPanel:    { comment: 'I store the DOMElement containing the panel of controls of the widget.' },

        isWidgetActive: { comment: 'Wether the widget is active.',
                          transform: function(aBoolean){

                                if(aBoolean){

                                    if(this.get('widgetPanel').parentNode !== this.get('widgetMenu')){
                                        this.get('widgetMenu').appendChild(this.get('widgetPanel'));
                                    }
                                    this.get('widgetMenu').classList.add('active');

                                    var elements = this.get('selection').get('elements')
                                    if(elements.length === 1){
                                        this.get('widgetPanel').querySelector('#sg-editing-widget-imgLink-input').value = (
                                            elements[0].get('contentNode').firstElementChild.getAttribute('href')
                                        );
                                    }

                                    // prepare undo
                                    this.set({ aValueWasChoosen: false });
                                    SuperGlue.get('history').do('actionHasStarted', this.do('createState'));

                                }else{

                                    if(this.get('widgetPanel').parentNode === this.get('widgetMenu')){
                                        this.get('widgetMenu').removeChild(this.get('widgetPanel'));
                                    }
                                    this.get('widgetMenu').classList.remove('active');

                                    // finish undo
                                    if(this.get('aValueWasChoosen')){
                                        SuperGlue.get('history').do('actionHasSucceeded', this.do('createState'));
                                    }
                                    this.set({ aValueWasChoosen: false })
                                
                                }
                                return aBoolean
                          }
                        },

        aValueWasChoosen: { comment: 'Wether a value was choosen (needed for undo).' }

    },

    methods: {

        init: { 
            comment:    'I init the widget.',
            code:       function(theSelection){

                this.delegate('Widget', 'init', theSelection);


                var self = this,
                    widgetPanel = (new DOMParser()).parseFromString(this.class.get('widgetPanel'), 'text/html').body.firstChild;
                


                widgetPanel.querySelector('#sg-editing-widget-imgLink-input').addEventListener('mouseup', function(evt){
                    theSelection.set({ activeWidget: self });
                    evt.stopPropagation();
                }, false);

                widgetPanel.querySelector('#sg-editing-widget-imgLink-input').addEventListener('input', function(evt){
                    self.do('setImgLink', this.value)
                }, false);

                widgetPanel.querySelector('#sg-editing-widget-imgLink-chooseFile').addEventListener('mouseup', function(evt){
                    theSelection.set({ activeWidget: self });
                    evt.stopPropagation();

                    var pathParser = document.createElement('a');
                    pathParser.href = widgetPanel.querySelector('#sg-editing-widget-imgLink-input').value;

                    SuperGlue.get('fileManager').do('chooseFile', {
                        oldPath:  pathParser.pathName,
                        callback: function(linkPath){
                                        widgetPanel.querySelector('#sg-editing-widget-imgLink-input').value = linkPath;
                                        self.do('setImgLink', linkPath);
                                    }
                    })
                }, false);

                widgetPanel.querySelector('#sg-editing-widget-imgLink-clear').addEventListener('mouseup', function(evt){
                    theSelection.set({ activeWidget: self });
                    evt.stopPropagation();

                    widgetPanel.querySelector('#sg-editing-widget-imgLink-input').value = '';
                    self.do('setImgLink', '');
                }, false);


                this.set({ 
                    widgetPanel: widgetPanel
                });

            }

        },

        setImgLink: {
            comment: 'I set a link on a imgElement',
            code: function(linkURL){

                var elements     = this.get('selection').get('elements'),
                    contentNode;

                for(var i = 0, l = elements.length; i < l; i++){

                    contentNode = elements[i].get('contentNode');

                    if(linkURL === ''){

                        if(contentNode.firstElementChild.tagName === 'A'){
                            var imgElem = contentNode.firstElementChild.firstElementChild,
                                aElem   = contentNode.firstElementChild;
                            contentNode.insertBefore(imgElem, aElem);
                            contentNode.removeChild(aElem);
                        }

                    }else{

                        if(contentNode.firstElementChild.tagName !== 'A'){
                            var imgElem = contentNode.firstElementChild,
                                aElem   = document.createElement('a');
                                aElem.setAttribute('href', linkURL);
                            contentNode.insertBefore(aElem, imgElem);
                            aElem.appendChild(imgElem);
                        }else{
                            contentNode.firstElementChild.setAttribute('href', linkURL);
                        }

                    }


                }

                this.set({ aValueWasChoosen: true });

            }
        },


        createState: {
            comment: 'I create a reflection function to restore a state.',
            code: function(){

                return  (function(elements){
                            var savedImgState = []
                            for(var i = 0, l = elements.length; i < l; i++){
                                savedImgState.push(elements[i].get('node').innerHTML)
                            }
                            return function(){
                                for(var i = 0, l = elements.length; i < l; i++){
                                    elements[i].get('node').innerHTML = savedImgState[i]
                                }
                            }
                        }).call(this, this.get('selection').get('elements'));


            }

        }


    }


}});