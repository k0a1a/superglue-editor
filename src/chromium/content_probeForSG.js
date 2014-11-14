/*
* I am executed by Chromium extension when called from background.js
*
*/

(function(){

    
    var scriptsToInject = [

        // Libraries
        'libs/SmallClasses.js',
        'libs/wysihtml5/wysihtml5-parser.js',
        'libs/wysihtml5/wysihtml5.js',
        'libs/flexicolorpicker/colorpicker.js',
        

        // SuperGlue classes
        'classes/SuperGlue.js',
        
        'classes/Clipboard.js',
        'classes/ColorPickerWidget.js',
        'classes/Compiler.js',
        'classes/CreationMenu.js',
        'classes/Document.js',
        'classes/DocumentMenu.js',
        'classes/Element.js',
        'classes/EmbedElement.js',
        'classes/FileManager.js',
        'classes/FileManagerWindow.js',
        'classes/Grid.js',
        'classes/HTMLEditor.js',
        'classes/History.js',
        'classes/IFrameElement.js',
        'classes/ImageElement.js',
        'classes/MenuItem.js',
        'classes/MenuItemBackgroundColor.js',
        'classes/MenuItemBackgroundImg.js',
        'classes/MenuItemBackgroundRepeat.js',
        'classes/MenuItemCenter.js',
        'classes/MenuItemFileManager.js',
        'classes/MenuItemNewPage.js',
        'classes/MenuItemOutlines.js',
        'classes/MenuItemPageTitle.js',
        'classes/MenuItemPaste.js',
        'classes/MenuItemRedo.js',
        'classes/MenuItemSave.js',
        'classes/MenuItemSaveAs.js',
        'classes/MenuItemSaveLocal.js',
        'classes/MenuItemSaveRemote.js',
        'classes/MenuItemServerSettings.js',
        'classes/MenuItemUndo.js',
        'classes/Keyboard.js',
        'classes/ResizeHandles.js',
        'classes/SCGUI.js',
        'classes/SCSystemBrowser.js',
        'classes/Selection.js',
        'classes/SliderWidget.js',
        'classes/Server.js',
        'classes/TextEditor.js',
        'classes/TextElement.js',
        'classes/Widget.js',
        'classes/WidgetBackgroundColor.js',
        'classes/WidgetBorder.js',
        'classes/WidgetBorderColor.js',
        'classes/WidgetBorderRadius.js',
        'classes/WidgetCopy.js',
        'classes/WidgetDelete.js',
        'classes/WidgetEditHTML.js',
        'classes/WidgetIFrame.js',
        'classes/WidgetImgDimensions.js',
        'classes/WidgetImgLink.js',
        'classes/WidgetImgSrc.js',
        'classes/WidgetLayerBottom.js',
        'classes/WidgetLayerTop.js',
        'classes/WidgetLock.js',
        'classes/WidgetOpacity.js',
        'classes/WidgetPadding.js',
        'classes/WidthMarkers.js',
        'classes/Window.js',
        'classes/WindowManager.js'


    ];

    var cssToInject = [

        // Libraries
        'libs/flexicolorpicker/colorpicker.css',

        // SuperGlue CSS
        'css/ColorPickerWidget.css',
        'css/CreationMenu.css',
        'css/Document.css',
        'css/DocumentMenu.css',
        'css/FileManagerWindow.css',
        'css/Grid.css',
        'css/HTMLEditor.css',
        'css/Keyboard.css',
        'css/MenuItem.css',
        'css/MenuItemBackgroundColor.css',
        'css/MenuItemBackgroundImg.css',
        'css/MenuItemBackgroundRepeat.css',
        'css/MenuItemCenter.css',
        'css/MenuItemFileManager.css',
        'css/MenuItemNewPage.css',
        'css/MenuItemOutlines.css',
        'css/MenuItemPageTitle.css',
        'css/MenuItemPaste.css',
        'css/MenuItemRedo.css',
        'css/MenuItemSave.css',
        'css/MenuItemSaveAs.css',
        'css/MenuItemSaveLocal.css',
        'css/MenuItemSaveRemote.css',
        'css/MenuItemServerSettings.css',
        'css/MenuItemUndo.css',
        'css/ResizeHandles.css',
        'css/Selection.css',
        'css/SliderWidget.css',
        'css/SuperGlue.css',
        'css/TextEditor.css',
        'css/Widget.css',
        'css/WidgetBackgroundColor.css',
        'css/WidgetBorder.css',
        'css/WidgetBorderColor.css',
        'css/WidgetBorderRadius.css',
        'css/WidgetCopy.css',
        'css/WidgetDelete.css',
        'css/WidgetEditHTML.css',
        'css/WidgetIFrame.css',
        'css/WidgetImgDimensions.css',
        'css/WidgetImgLink.css',
        'css/WidgetImgSrc.css',
        'css/WidgetLayerBottom.css',
        'css/WidgetLayerTop.css',
        'css/WidgetLock.css',
        'css/WidgetOpacity.css',
        'css/WidgetPadding.css',
        'css/WidthMarkers.css',
        'css/Window.css',
        'css/WindowManager.css'

    ];






    var activateSuperGlue = function(){


        var clipboardCss = document.createElement("link");
        clipboardCss.setAttribute("data-superglue", "editing-interface");
        clipboardCss.setAttribute("rel", "stylesheet");
        clipboardCss.setAttribute("href", chrome.extension.getURL("superglue-client//injections/clipboard.css"));
        document.head.appendChild(clipboardCss);

        var clipboardCopy = document.createElement("textarea");
        clipboardCopy.setAttribute("data-superglue", "editing-interface");
        clipboardCopy.setAttribute("id", "sg-editing-clipboard-copy");
        clipboardCopy.addEventListener('click', function(){
            chrome.runtime.sendMessage(
                { 
                    action: "copy",
                    value:  clipboardCopy.value
                }, 
                function(response){}
            );
        }, false);
        document.body.insertBefore(clipboardCopy, document.body.firstElementChild);

        var clipboardPaste = document.createElement("textarea");
        clipboardPaste.setAttribute("data-superglue", "editing-interface");
        clipboardPaste.setAttribute("id", "sg-editing-clipboard-paste");
        clipboardPaste.addEventListener('click', function(){
            chrome.runtime.sendMessage(
                { 
                    action: "paste",
                }, 
                function(response){
                    if(response.action === 'pasteResponse'){
                        clipboardPaste.value = response.value;
                        clipboardPaste.click();
                    }
                }
            );
        }, false);
        document.body.insertBefore(clipboardPaste, document.body.firstElementChild);




        for (var i = 0; i < scriptsToInject.length; i++) {
            var script = document.createElement("script");
            script.setAttribute("data-superglue", "editing-interface");
            script.setAttribute("type", "text/javascript");
            script.async = false;
            script.setAttribute("src", chrome.extension.getURL("superglue-client/" + scriptsToInject[i]) );
            document.head.appendChild(script);
        };

        for (var i = 0; i < cssToInject.length; i++) {
            var css = document.createElement("link");
            css.setAttribute("data-superglue", "editing-interface");
            css.setAttribute("rel", "stylesheet");
            css.setAttribute("href", chrome.extension.getURL("superglue-client/" + cssToInject[i]) );
            document.head.appendChild(css);
        };


        var script = document.createElement("script");
        script.setAttribute("data-superglue", "editing-interface");
        script.setAttribute("type", "text/javascript");
        script.async = false;
        script.setAttribute("src", chrome.extension.getURL("superglue-client/injections/init.js") );
        document.head.appendChild(script);

    

    };


    var notSGpage = function(){

        var script = document.createElement("script");
        script.setAttribute("data-superglue", "editing-interface");
        script.setAttribute("type", "text/javascript");
        script.async = false;
        script.setAttribute("src", chrome.extension.getURL("superglue-client/injections/notSGpage.js") );
        document.head.appendChild(script);
        document.head.removeChild(script);

    };


    // check if page is superglue page
    if(     document.querySelectorAll('meta[name=generator]').length > 0 
        &&  document.querySelector('meta[name=generator]').getAttribute('content') === 'SuperGlue'){

        // check if editing is active
        if(     document.querySelectorAll('meta[name=superglue-mode]').length === 0
            ||  document.querySelector('meta[name=superglue-mode]').getAttribute('content') !== 'editing'){

            activateSuperGlue();

        }

    } else { // page is not a superglue page

        notSGpage();

    }


    


})();