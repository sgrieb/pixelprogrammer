(function() {
    PP.Tools.Edit = {
    };

    PP.Tools.Edit.init = function() {
        // undo
        DOM.$undo.click(function() {
            undoRedo(historyPointer, true);
            historyPointer--;

            DOM.$redo.removeAttr('disabled');

            if ( historyPointer < 0 ) {
            DOM.$undo.attr('disabled', 'disabled');
            }
        });

        // redo
        DOM.$redo.click(function() {
            historyPointer++;
            undoRedo(historyPointer, false);

            DOM.$undo.removeAttr('disabled');
            if ( historyPointer === undoRedoHistory.length - 1 ) {
            DOM.$redo.attr('disabled', 'disabled');
            }
        });

        // cut
        DOM.$cut.click(function() {
            PP.Tools.resetModes();
            if ( mode.cut ) {
            mode.cut = false;
            $(this).removeClass(classes.currentTool);
            DOM.$overlay.addClass(classes.hidden);
            }
            else {
            mode.cut = true;
            ctxOverlay.fillRect(0, 0, DOM.$overlay.width(), DOM.$overlay.height());
            $(this).addClass(classes.currentTool);
            DOM.$overlay.removeClass(classes.hidden);
            }
        });

        // copy
        DOM.$copy.click(function() {
            PP.Tools.resetModes();
            if ( mode.copy ) {
            mode.copy = false;
            $(this).removeClass(classes.currentTool);
            DOM.$overlay.addClass(classes.hidden);
            }
            else {
            mode.copy = true;
            ctxOverlay.fillRect(0, 0, DOM.$overlay.width(), DOM.$overlay.height());
            $(this).addClass(classes.currentTool);
            DOM.$overlay.removeClass(classes.hidden);
            }
        });

        // paste
        DOM.$paste.click(function() {
            if ( !clipboard ) {
            return;
            }
            PP.Tools.resetModes();

            if ( !mode.paste ) {
            mode.paste = true;
            $(this).addClass(classes.currentTool);

            // show instructions
            DOM.$pasteInstructions.addClass(classes.hidden);
            }

        });

        // undo alias to ctrl+z, macs aliased to cmd+z
        key('ctrl+z, ⌘+z', PP.Tools.Edit.triggerClickForEnabled(DOM.$undo));

        // redo alias to ctrl+y and mac aliased cmd+shift+z
        key('ctrl+y, ⌘+shift+z', PP.Tools.Edit.triggerClickForEnabled(DOM.$redo));
    };

    PP.Tools.Edit.pushToHistory = function(actionIndex, actionType, x, y, rgbOriginal, rgbNew, pixelSize, drawPathId, srcOriginal, srcNew) {
        // push to undoRedoHistory, will also become pxon.pxif.pixels
        var pixelDrawn = {
        index: actionIndex,
        action: actionType,
        x: x,
        y: y,
        originalColor: rgbOriginal,
        color: rgbNew,
        size: pixelSize,
        drawPathId: drawPathId,
        originalSrc: srcOriginal,
        src: srcNew
        };
        undoRedoHistory.push(pixelDrawn);
        drawHistory.push(pixelDrawn);
        historyPointer++;
        DOM.$undo.removeAttr('disabled');
    };

    PP.Tools.Edit.undoRedo = function(pointer, undoFlag) {
        var undoRedoColor, nextPointer;
        if ( undoFlag ) {
        undoRedoColor = undoRedoHistory[pointer].originalColor;
        nextPointer = pointer - 1;
        }
        else {
        undoRedoColor = undoRedoHistory[pointer].color;
        nextPointer = pointer + 1;
        }

        if ( undoRedoHistory[pointer].action === action.cut || undoRedoHistory[pointer].action === action.paste ) {
        // for cut and paste, original color is original canvas, color is new canvas lol sorry
        if ( undoFlag ) {
            PP.Canvas.drawToCanvas(undoRedoHistory[pointer].originalSrc, 0, 0, true);
        }
        else {
            PP.Canvas.drawToCanvas(undoRedoHistory[pointer].src, 0, 0, true);
        }
        return;
        }

        if ( undoRedoHistory[pointer].action === action.fill && undoRedoHistory[nextPointer] && undoRedoHistory[pointer].index === undoRedoHistory[nextPointer].index ) {
        if ( undoFlag ) {
            historyPointer--;
        }
        else {
            historyPointer++;
        }
        PP.Tools.Edit.undoRedo(historyPointer, undoFlag);
        }

        PP.Canvas.drawPixel(undoRedoHistory[pointer].x, undoRedoHistory[pointer].y, undoRedoColor, undoRedoHistory[pointer].size);

        if (undoRedoHistory[pointer].drawPathId &&
            undoRedoHistory[nextPointer] &&
            undoRedoHistory[nextPointer].drawPathId === undoRedoHistory[pointer].drawPathId) {
        if (undoFlag) {
            PP.Tools.Edit.undoRedo(--historyPointer, undoFlag);
        }
        else {
            PP.Tools.Edit.undoRedo(++historyPointer, undoFlag);
        }
        }
    };

    PP.Tools.Edit.generateSelection = function(e, mode) {
        rectangleSelection.endX = PP.Tools.roundToNearestPixel(e.pageX);
        rectangleSelection.endY = PP.Tools.roundToNearestPixel(e.pageY);

        // temporary canvas to save image
        DOM.$body.append('<canvas id="' + classes.selectionCanvas + '"></canvas>');
        var $tempCanvas = $('#' + classes.selectionCanvas);
        var tempCtx = $tempCanvas[0].getContext('2d');

        // set dimensions and draw based on selection
        var width = Math.abs(rectangleSelection.endX - rectangleSelection.startX);
        var height = Math.abs(rectangleSelection.endY - rectangleSelection.startY);
        $tempCanvas[0].width = width;
        $tempCanvas[0].height = height;

        var startX = Math.min( rectangleSelection.startX, rectangleSelection.endX );
        var startY = Math.min( rectangleSelection.startY, rectangleSelection.endY );

        if ( width && height ) {
        tempCtx.drawImage(DOM.$canvas[0], startX, startY, width, height, 0, 0, width, height);
        var img = $tempCanvas[0].toDataURL('image/png');

        if ( mode === action.save ) {
            PP.Overlay.displayFinishedArt(img);
            DOM.$buttonSaveSelection.click();
            DOM.$saveModalContainer.removeClass(classes.hidden);
        }
        else {
            clipboard = new Image();
            clipboard.src = img;

            if ( mode === action.cut ) {
            var originalImage = DOM.$canvas[0].toDataURL('image/png');
            ctx.clearRect(startX, startY, width, height);
            DOM.$cut.click();

            // add "cut" action to undo/redo array
            var newImage = DOM.$canvas[0].toDataURL('image/png');
            action.index++;
            drawPathId = Date();
            PP.Tools.Edit.pushToHistory( action.index, action.cut, 0, 0, null, null, null, drawPathId, originalImage, newImage);

            // save to local storage
            PP.Storage.saveToLocalStorage();
            }

            if ( mode === action.copy ) {
            // trigger copy click
            DOM.$copy.click();
            }
        }
        }

        // remove tempCanvas
        $tempCanvas.remove();
    };

    PP.Tools.Edit.drawSelection = function(e) {
        rectangleSelection.w = PP.Tools.roundToNearestPixel((e.pageX - this.offsetLeft) - rectangleSelection.startX);
        rectangleSelection.h = PP.Tools.roundToNearestPixel((e.pageY - this.offsetTop) - rectangleSelection.startY);
        ctxOverlay.clearRect(0,0,DOM.$overlay.width(),DOM.$overlay.height());
        ctxOverlay.fillStyle = 'rgba(0,0,0,.5)';
        ctxOverlay.fillRect(0,0,DOM.$overlay.width(),DOM.$overlay.height());
        ctxOverlay.clearRect(rectangleSelection.startX, rectangleSelection.startY, rectangleSelection.w, rectangleSelection.h);
    };

    PP.Tools.Edit.triggerClickForEnabled = function(elem) {
        return function() {
        // no-op if there is nothing to undo
        if (elem.is(':disabled')) {
            return;
        }

        // trigger the click
        elem.trigger('click');
        };        
    };

}());