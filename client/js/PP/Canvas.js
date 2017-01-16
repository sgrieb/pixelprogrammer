(function() {
    PP.Canvas = {
    };

    PP.Canvas.init = function(){
        // drawing
        DOM.$canvas = $('<canvas id="canvas" width="' + windowCanvas.width + '" height="' + windowCanvas.height + '">Your browser doesn\'t support canvas. Boo-hiss.</canvas>');
        DOM.$body.prepend( DOM.$canvas );
        ctx = DOM.$canvas[0].getContext('2d');

        // selection save overlay
        DOM.$overlay = $('<canvas id="overlay" width="' + windowCanvas.width + '" height="' + windowCanvas.height + '"></canvas>');
        DOM.$overlay.css({
        background : 'none',
        position : 'absolute',
        top : 0,
        left : 0,
        })
        .addClass(classes.hidden);

        DOM.$body.prepend( DOM.$overlay );
        ctxOverlay = DOM.$overlay[0].getContext('2d');
        ctxOverlay.fillStyle = 'rgba(0,0,0,.5)';

        // restore webstorage data
        if ( PP.Storage.canStorage() ) {
        PP.Canvas.drawFromLocalStorage();
        }

        // turns palette into canvas
        pickerPaletteCtx = DOM.$8bitPicker[0].getContext('2d');
        var img = new Image();
        img.onload = function() {
            pickerPaletteCtx.drawImage(img,0,0);
        };
        // NOTE: original png is assets/customcolors.png. using data uri so it works in different directories
        img.src = 'data:image/png;base64,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';

        // event listeners
        DOM.$canvas.mousedown(PP.onMouseDown).mouseup(PP.onMouseUp);
        DOM.$canvas.on('contextmenu', PP.onRightClick);

        //touch
        DOM.$canvas[0].addEventListener('touchstart', PP.onMouseDown, false);
        DOM.$canvas[0].addEventListener('touchend', PP.onMouseUp, false);

        // reset canvas
        DOM.$buttonNewCanvas.click(function() {
            PP.Canvas.reset( pixel.color );
            PP.Storage.saveToLocalStorage();
        });

        // canvas window size changes
        DOM.$window.resize(function() {
            if ( DOM.$window.width() - (DOM.$window.width() % pixel.size) <= windowCanvas.width && DOM.$window.height() - (DOM.$window.height() % pixel.size) <= windowCanvas.height ) {
            return;
            }
            else {
            // if local storage
            if ( !PP.Storage.canStorage() || mode.save ) {
                return;
            }
            else {
                var newWidth = DOM.$window.width() - (DOM.$window.width() % pixel.size);
                var newHeight = DOM.$window.height() - (DOM.$window.height() % pixel.size);
                windowCanvas.width = newWidth;
                windowCanvas.height = newHeight;

                // save image
                PP.Storage.saveToLocalStorage();

                DOM.$canvas
                .attr('width',newWidth)
                .attr('height',newHeight);
                DOM.$overlay
                .attr('width',newWidth)
                .attr('height',newHeight);
                ctxOverlay = DOM.$overlay[0].getContext('2d');
                ctxOverlay.fillStyle = 'rgba(0,0,0,.5)';

                // draw image
                PP.Canvas.drawFromLocalStorage();
            }

            }
        });

        // draw the template
        $.getJSON("data/template.json", function(pixels) {

            pixels.forEach(function(e, i, a){
                PP.Canvas.drawPixel(e.x, e.y, e.color, e.size, true );
            });
        });

    };

    PP.Canvas.reset = function(){
        if ( window.confirm('You cannot undo canvas resets. Are you sure you want to erase this entire drawing?') ) {
        
            ctx.clearRect(0, 0, DOM.$canvas.width(), DOM.$canvas.height());

            // make the canvas transparent
            ctx.fillStyle = 'rgba(0, 0, 0, 0)';
            ctx.fillRect(0,0,DOM.$canvas.width(),DOM.$canvas.height());

            //reset storage
            localStorage.make8bitartPxon = JSON.stringify([]);

            // reset history
            undoRedoHistory = [];
            historyPointer = -1;
            DOM.$redo.attr('disabled', 'disabled');
            DOM.$undo.attr('disabled', 'disabled');

            // redraw the template
            // draw the template
            $.getJSON("data/template.json", function(pixels) {

                pixels.forEach(function(e, i, a){
                    PP.Canvas.drawPixel(e.x, e.y, e.color, e.size, true );
                });
            });
        }
    }

    PP.Canvas.drawPixel = function(x, y, color, size, force){

        x = ( Math.ceil(x/size) * size ) - size;
        y = ( Math.ceil(y/size) * size ) - size;

        // dont draw on the template
        if ((x != 720 && x != 225 && y != 135 && y != 630) || force) {
            ctx.beginPath();

            ctx.moveTo (x, y);
            ctx.fillStyle = color;
            ctx.lineHeight = 0;

            if ( color === 'rgba(0, 0, 0, 0)' ) {
            ctx.clearRect(x,y,size,size);
            }
            else {
            ctx.fillRect(x,y,size,size);
            }

            PP.Storage.pushPixelToStorage(x, y, color, size);

        }

        return {
        x: x,
        y: y
        };
    };

    PP.Canvas.drawOnMove = function(e){
        var hoverData = ctx.getImageData( e.pageX, e.pageY, 1, 1).data;
        var hoverRGB = PP.Tools.ColorPicker.getRGBColor(hoverData);

        if ( !PP.Tools.ColorPicker.areColorsEqual( hoverRGB, pixel.color, pixel.size) ) {
        PP.Canvas.drawPixel(e.pageX, e.pageY, pixel.color, pixel.size);
        PP.Tools.Edit.pushToHistory(action.index, action.draw, e.pageX, e.pageY, hoverRGB, pixel.color, pixel.size, drawPathId, null, null);
        }
    };

    PP.Canvas.touchDraw = function(e){
        // for each finger in your fingers
        for ( var i = 0; i < e.touches.length; i++ ) {
        PP.Canvas.drawOnMove(e.touches[i]);
        }
    };

    PP.Canvas.paint = function(x, y, paintColor, initColor){
        // thanks to Will Thimbleby http://will.thimbleby.net/scanline-flood-fill/

        x = ( Math.ceil(x/pixel.size) * pixel.size ) - pixel.size;
        y = ( Math.ceil(y/pixel.size) * pixel.size ) - pixel.size;

        // xMin, xMax, y, down[true] / up[false], extendLeft, extendRight
        var ranges = [[x, x, y, null, true, true]],
        w = windowCanvas.width;

        // get data array from ImageData object
        var img = ctx.getImageData(0, 0, windowCanvas.width, windowCanvas.height),
        imgData = img.data;
        if (paintColor[0] === '#') {
        paintColor = PP.Tools.ColorPicker.hexToRgba(paintColor);
        }
        var paintColorArray = paintColor.substring(5, paintColor.length -1).split(',');

        // lookup pixel colour from x & y coords
        function getColorForCoords (x, y) {
        var index = 4 * (x + y * windowCanvas.width);
        var indices = [index, index + 1, index + 2, index + 3];
        var values = indices.map(function(i){
            return imgData[i];
        });
        return PP.Tools.ColorPicker.getRGBColor(values);
        }

        // set pixel colour in imgData array
        function markPixel(x, y) {
        var index = 4 * (x + y * w);

        var alpha = parseInt(paintColorArray[3]) === 0 ? 0 : 255;

        for (var j = index; j < index + pixel.size * 4; j+=4) {
            imgData[j] = paintColorArray[0];
            imgData[j + 1] = paintColorArray[1];
            imgData[j + 2] = paintColorArray[2];
            imgData[j + 3] = alpha;

            for (var k = j; k < j + pixel.size * (w * 4); k+= w * 4) {
            imgData[k] = paintColorArray[0];
            imgData[k + 1] = paintColorArray[1];
            imgData[k + 2] = paintColorArray[2];
            imgData[k + 3] = alpha;
            }
        }
        PP.Tools.Edit.pushToHistory(action.index, action.fill, x + pixel.size - 1, y + pixel.size - 1, initColor, paintColor, pixel.size, null, null);
        }

        function addNextLine(newY, isNext, downwards) {
        var rMinX = minX;
        var inRange = false;

        for(var x = minX; x <= maxX; x+= pixel.size) {
            // skip testing, if testing previous line within previous range
            var empty = (isNext || (x < current[0] || x > current[1])) && PP.Tools.ColorPicker.areColorsEqual(getColorForCoords(x, newY), initColor);
            if(!inRange && empty) {
            rMinX = x;
            inRange = true;
            }
            else if(inRange && !empty) {
            ranges.push([rMinX, x-pixel.size, newY, downwards, rMinX === minX, false]);
            inRange = false;
            }
            if(inRange) {
            markPixel(x, newY, paintColor, 1);
            }
            // skip
            if(!isNext && x === current[0]) {
            x = current[1];
            }
        }
        if(inRange) {
            ranges.push([rMinX, x-pixel.size, newY, downwards, rMinX === minX, true]);
        }
        }

        initColor = getColorForCoords(x, y);

        markPixel(x, y, paintColor, 1);

        while(ranges.length) {
        var current = ranges.pop();
        var down = current[3] === true;
        var up =   current[3] === false;

        var minX = current[0];
        y = current[2];

        if(current[4]) {
            while(minX > 0 && PP.Tools.ColorPicker.areColorsEqual(getColorForCoords(minX - pixel.size, y), initColor)) {
            minX-=pixel.size;
            markPixel(minX, y, paintColor, 1);
            }
        }

        var maxX = current[1];
        if(current[5]) {
            while(maxX < windowCanvas.width - pixel.size && PP.Tools.ColorPicker.areColorsEqual(getColorForCoords(maxX + pixel.size, y), initColor)) {
            maxX+=pixel.size;
            markPixel(maxX, y, paintColor, 1);
            }
        }

        current[0]-=pixel.size;
        current[1]+=pixel.size;

        if(y < windowCanvas.height) {
            addNextLine(y + pixel.size, !up, true);
        }
        if(y > 0) {
            addNextLine(y - pixel.size, !down, false);
        }
        }

        // replace entire canvas
        ctx.putImageData(img, 0, 0);
    };

    PP.Canvas.drawToCanvas = function(src, x, y, clear){
        if ( clear ) {
            ctx.clearRect(0, 0, DOM.$canvas.width(), DOM.$canvas.height());
        }

        var img = new Image();
        img.onload = function() {
            ctx.drawImage(img, x, y);
        };
        img.src = src;
    };

    PP.Canvas.drawFromLocalStorage = function(){
        var savedCanvas = localStorage.make8bitartSavedCanvas;
        if ( savedCanvas ) {
            PP.Canvas.drawToCanvas(savedCanvas, 0, 0, true);
        }
    };

    PP.Canvas.generateBackgroundGrid = function(pixelSize){
        var bgCanvas = document.createElement('canvas'),
        bgCtx = bgCanvas.getContext('2d'),
        width = pixelSize * 2,
        height = pixelSize * 2;

        bgCanvas.width = width;
        bgCanvas.height = height;

        bgCtx.fillStyle = '#fff';
        bgCtx.fillRect(0, 0, width, height);

        bgCtx.fillStyle = '#ccc';
        bgCtx.fillRect(0, 0, pixelSize, pixelSize);
        bgCtx.fillRect(pixelSize, pixelSize, pixelSize, pixelSize);

        return bgCanvas.toDataURL();
    };

}());