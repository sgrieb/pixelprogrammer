(function() {
    PP.Tools = {
    };

    PP.Tools.init = function(colorHistory){
        var $tabs = $('.tabs button'); 

        PP.Tools.ColorPicker.init(colorHistory);

        PP.Tools.Size.init();

        PP.Tools.Edit.init();

        PP.Tools.Drag.init();

        PP.Tools.Instruments.init();

        // init tabs
        $tabs.click(function(e){
            var activeTab = $(this);
            var href = activeTab.attr('data-href');
            activeTab.siblings().removeClass(classes.activeTab);
            activeTab.addClass(classes.activeTab);

            var toHide = [];
            activeTab.siblings().each(function(){
            toHide.push($(this).attr('data-href'));
            });

            $(href).removeClass(classes.hidden);
            for ( var i = 0; i < toHide.length; i++ ) {
            $(toHide[i]).addClass(classes.hidden);
            }
        });
    };

    PP.Tools.resetModes = function(){
        if ( mode.dropper ) {
        DOM.$dropper.removeAttr('style');
        DOM.$canvas.removeClass(classes.dropperMode);
        mode.dropper = false;
        var backgroundIMG;

        if ( pixel.color !== 'rgba(0, 0, 0, 0)' ) {
            backgroundIMG = 'none';
        }

        DOM.$pixelSizeDemoDiv.css('background-image', backgroundIMG);
        DOM.$colorPickerDemo.css({
            'background-image' : backgroundIMG,
            'background-color' : pixel.color
        });
        DOM.$hex.val(PP.Tools.ColorPicker.rgbToHex(pixel.color));
        }
        else if ( mode.save ) {
        DOM.$buttonSaveSelection.click();
        }
        else if ( mode.copy || mode.cut ) {
        DOM.$overlay.addClass(classes.hidden);
        }
        else if ( mode.paste ) {
        DOM.$pasteInstructions.addClass(classes.hidden);
        }

        for (var prop in mode) {
        if ( mode.hasOwnProperty(prop) ){
            mode[prop] = false;
        }
        }

        DOM.$toolButtons.removeClass(classes.currentTool);
    };

    PP.Tools.roundToNearestPixel = function(n){
        var canRound = (0 === pixel.size || void(0) !== pixel.size);
        return canRound ? Math.round(n / pixel.size) * pixel.size : n;
    };

}());