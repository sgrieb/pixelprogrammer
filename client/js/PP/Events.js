(function() {
    PP.Events = {
    };

    PP.Events.init = function(){
        PP.onMouseDown = function(e) {
            e.preventDefault();

            if ( e.which === 3 ) {
                return;
                }

                var origData = ctx.getImageData( e.pageX, e.pageY, 1, 1).data;
                var origRGB = PP.Tools.ColorPicker.getRGBColor(origData);

                if ( mode.dropper ) {
                mode.dropper = false;
                PP.Tools.ColorPicker.setDropperColor( origRGB );
                DOM.$canvas.removeClass(classes.dropperMode);
                DOM.$dropper.removeClass(classes.currentTool).removeAttr('style');
                }
                else if ( mode.paste ) {
                var x = ( Math.ceil(e.pageX/pixel.size) * pixel.size ) - pixel.size;
                var y = ( Math.ceil(e.pageY/pixel.size) * pixel.size ) - pixel.size;

                var originalImage = DOM.$canvas[0].toDataURL('image/png');
                ctx.drawImage(clipboard, x, y);

                // reset history
                undoRedoHistory = undoRedoHistory.slice(0, historyPointer+1);
                DOM.$redo.attr('disabled','disabled');

                // add action to undo/redo
                var newImage = DOM.$canvas[0].toDataURL('image/png');
                action.index++;
                drawPathId = Date();
                PP.Tools.Edit.pushToHistory( action.index, action.paste, 0, 0, null, null, null, drawPathId, originalImage, newImage);

                // save to local storage
                PP.Storage.saveToLocalStorage();

                DOM.$paste.click();
            }
            else if ( !mode.save && !mode.copy && !mode.cut ) {
                // reset history
                undoRedoHistory = undoRedoHistory.slice(0, historyPointer+1);
                DOM.$redo.attr('disabled','disabled');

                if ( mode.paint && !PP.Tools.ColorPicker.areColorsEqual( origRGB, pixel.color ) ) {
                    action.index++;
                    PP.Canvas.paint( e.pageX, e.pageY, pixel.color, origRGB );
                }
                else {

                    drawPathId = Date.now();

                    // draw mode
                    mode.drawing = true;

                    action.index++;
                    PP.Canvas.drawPixel(e.pageX, e.pageY, pixel.color, pixel.size);

                    if ( !PP.Tools.ColorPicker.areColorsEqual( origRGB, pixel.color) ) {
                    PP.Tools.Edit.pushToHistory(action.index, action.draw, e.pageX, e.pageY, origRGB, pixel.color, pixel.size, drawPathId, null, null);
                    }

                    DOM.$canvas.on('mousemove', PP.Canvas.drawOnMove);

                    // touch
                    DOM.$canvas[0].addEventListener('touchmove', PP.Canvas.touchDraw, false);

                    // update color history palette - shows latest 20 colors used
                    if ( pixel.color !== 'rgba(0, 0, 0, 0)' ) {
                    PP.Tools.ColorPicker.updateColorHistoryPalette();
                    }
                }
            }
            else {
            // overlay stuff
            rectangleSelection = {};
            rectangleSelection.startX = PP.Tools.roundToNearestPixel(e.pageX - this.offsetLeft);
            rectangleSelection.startY = PP.Tools.roundToNearestPixel(e.pageY - this.offsetTop);
            DOM.$overlay.on('mousemove', PP.Tools.Edit.drawSelection);

            // touch
            DOM.$overlay[0].addEventListener('touchmove', PP.Tools.Edit.drawSelection, false);
            }

        };

        PP.onMouseUp = function(e) {
            if ( mode.paste ) {
            return;
            }

            if ( !mode.save && !mode.copy && !mode.cut ) {
            DOM.$canvas.off('mousemove');
            mode.drawing = false;
            drawPathId = null;

            PP.Storage.saveToLocalStorage();
            }
            else {
            DOM.$overlay.off('mousemove');
            ctxOverlay.clearRect(0, 0, DOM.$overlay.width(), DOM.$overlay.height());

            if ( mode.save ) {
                PP.Tools.Edit.generateSelection(e, 'save');
            }
            else if ( mode.copy ) {
                PP.Tools.Edit.generateSelection(e, 'copy');
            }
            else if ( mode.cut ) {
                PP.Tools.Edit.generateSelection(e, 'cut');
            }
            }
        };

        PP.onRightClick = function(e) {
            PP.Tools.resetModes();
            var origData = ctx.getImageData( e.pageX, e.pageY, 1, 1).data;
            var origRGB = PP.Tools.ColorPicker.getRGBColor(origData);

            PP.Tools.ColorPicker.setDropperColor(origRGB);

            DOM.$canvas.removeClass(classes.dropperMode);
            DOM.$dropper.removeClass(classes.currentTool).removeAttr('style');

            return false;
        };
    };

}());