SC.loadPackage({ 'Window': {

    comment: 'I am a window which is managed by the WindowManager and lives on the 2nd level interface.',


    sharedProperties: {

        windowMarkup: 	{  	comment:   'This is the basic html markup for all windows.', 
                        	initValue: '<div class="sg-editing-window">'
                                            +'<div class="sg-editing-window-titlebar"></div>'
                                            +'<div class="sg-editing-window-resizehandle"></div>'
                                            +'<div class="sg-editing-window-closebutton"></div>'
                                            +'<div class="sg-editing-window-content"></div>'
                                        +'</div>' 
                        }

    },

    properties: {

        node:         { comment: 'I hold the DOM node which contains this window.' },
        titlebar:     { comment: 'I hold the DOM node for the titlebar.' },
        resizeHandle: { comment: 'I hold the DOM node for the resizeHandle.' },
        content:      { comment: 'I hold the DOM node for the window\'s content.' },

        top:    { transform: function(anInt){
                        var val = (
                            anInt > 0
                                ? ( anInt + this.get('height') > document.documentElement.clientHeight
                                        ? document.documentElement.clientHeight - this.get('height')
                                        : anInt
                                  )
                                : 0
                        );
                        this.get('node').style.top = val + 'px';
                        return val;
                    }
                },
        left:   { transform: function(anInt){
                        var val = (
                            anInt > 0
                                ? ( anInt + this.get('width') > document.documentElement.clientWidth
                                        ? document.documentElement.clientWidth - this.get('width')
                                        : anInt
                                  )
                                : 0
                        );
                        this.get('node').style.left = val + 'px';
                        return val;
                    }
                },
        width:  { transform: function(anInt){
                        var val = (
                            anInt >= 250
                                ? (anInt + this.get('left') > document.documentElement.clientWidth)
                                    ? document.documentElement.clientWidth - this.get('left')
                                    : anInt
                                : 250
                        );
                        this.get('node').style.width = val + 'px';
                        return val;
                    }
                },
        height: { transform: function(anInt){
                        var val = (
                            anInt >= 250
                                ? (anInt + this.get('top') > document.documentElement.clientHeight)
                                    ? document.documentElement.clientHeight - this.get('top')
                                    : anInt
                                : 250
                        );
                        this.get('node').style.height = val + 'px';
                        return val;
                    }
                }

    },

    methods: {

    	init: { 
    		comment: 	'I create a Window according to the windowConfig object: '+
                        '{ top: anInt, left: anInt, width: anInt, height: anInt }',
            code: function(windowConfig){

                var self = this,
                    newWindow = (new DOMParser()).parseFromString(this.class.get('windowMarkup'), 'text/html').body.firstChild;

                this.set({
                    node:           newWindow,
                    titlebar:       newWindow.querySelector('.sg-editing-window-titlebar'),
                    resizeHandle:   newWindow.querySelector('.sg-editing-window-resizehandle'),
                    content:        newWindow.querySelector('.sg-editing-window-content')
                })

                var cancelEvent = function(evt){
                    evt.stopPropagation();
                }
                newWindow.addEventListener('mousedown', cancelEvent, false);

                newWindow.querySelector('.sg-editing-window-closebutton').addEventListener('mouseup', function(){
                    SuperGlue.get('windowManager').do('closeWindow', self);
                }, false)

                this.do('beDraggable');
                this.do('beResizable');

                this.set({
                    top:    windowConfig.top,
                    left:   windowConfig.left,
                    width:  windowConfig.width,
                    height: windowConfig.height
                });

            }
        },

        beDraggable: {
            comment:   'I register the eventListeners on newly created windows to make them draggable.',
            code:       function(){

                var self = this,
                    startX,
                    startY,

                    onMouseDown = function(evt){

                        startX = evt.clientX;
                        startY = evt.clientY;

                        document.addEventListener('mousemove', onMouseMove, true);
                        document.addEventListener('mouseup',   onMouseUp,   true);

                        evt.stopPropagation();
                        evt.preventDefault();

                    },

                    onMouseMove = function(evt){

                        var newX  = self.get('left') - (startX - evt.clientX),
                            newY  = self.get('top')  - (startY - evt.clientY);
                        
                        if(newX > 0){
                            if(newX + self.get('width') > document.documentElement.clientWidth){
                                newX = document.documentElement.clientWidth - self.get('width')
                            }else{
                                startX = evt.clientX
                            }
                        }else{
                            newX = 0;
                        }

                        if(newY > 0){
                            if(newY + self.get('height') > document.documentElement.clientHeight){
                                newY = document.documentElement.clientHeight - self.get('height')
                            }else{
                                startY = evt.clientY
                            }
                        }else{
                            newY = 0;
                        }
                        

                        self.set({
                            top:  newY,
                            left: newX
                        })

                        evt.stopPropagation();
                        evt.preventDefault();
                        
                    },

                    onMouseUp = function(evt){
                        
                        document.removeEventListener('mousemove', onMouseMove, true);
                        document.removeEventListener('mouseup',   onMouseUp,   true);

                        evt.stopPropagation();
                        evt.preventDefault();

                    };

                this.get('titlebar').addEventListener('mousedown', onMouseDown, false);


            }
        },

        beResizable: {
            comment:   'I register the eventListeners on newly created windows to make them resizable.',
            code:       function(){

                var self = this,
                    startX,
                    startY,

                    onMouseDown = function(evt){

                        startX = evt.clientX;
                        startY = evt.clientY;

                        document.addEventListener('mousemove', onMouseMove, true);
                        document.addEventListener('mouseup',   onMouseUp,   true);

                        evt.stopPropagation();
                        evt.preventDefault();

                    },

                    onMouseMove = function(evt){

                        var newX  = self.get('width')  - (startX - evt.clientX),
                            newY  = self.get('height') - (startY - evt.clientY);
                        
                        if(newX > 250){
                            if(newX + self.get('left') > document.documentElement.clientWidth){
                                newX = document.documentElement.clientWidth - self.get('left')
                            }else{
                                startX = evt.clientX
                            }
                        }else{
                            newX = 250;
                        }

                        if(newY > 250){
                            if(newY + self.get('top') > document.documentElement.clientHeight){
                                newY = document.documentElement.clientHeight - self.get('top')
                            }else{
                                startY = evt.clientY
                            }
                        }else{
                            newY = 250;
                        }
                        

                        self.set({
                            height: newY,
                            width:  newX
                        })

                        evt.stopPropagation();
                        evt.preventDefault();
                        
                    },

                    onMouseUp = function(evt){
                        
                        document.removeEventListener('mousemove', onMouseMove, true);
                        document.removeEventListener('mouseup',   onMouseUp,   true);

                        evt.stopPropagation();
                        evt.preventDefault();

                    };

                this.get('resizeHandle').addEventListener('mousedown', onMouseDown, false);


            }
        }



    }


}});