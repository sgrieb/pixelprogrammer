(function() {
    PP.Tools.ColorPicker = {
    };

    PP.Tools.ColorPicker.init = function(colorHistory){

        initHistory(colorHistory);

        function initHistory(colorHistory) {
            if (colorHistory.length === 0 ) {
                return;
            }
            else {
                // make all color history values consistently hex without hash
                var sanitizedColors = PP.Tools.ColorPicker.sanitizeColorArray(colorHistory);

                sanitizedColors.forEach(setLatestColorBtn);

                // bind click to color buttons
                DOM.$color = $('.'+classes.color);
                DOM.$color.click(PP.Tools.ColorPicker.bindColorClick);
            }

        };

        function updateColorHistoryPalette() {
            var hexColor = PP.Tools.ColorPicker.rgbToHex(pixel.color);
            var colorHistoryPos = colorHistory.indexOf(hexColor);
            if ( colorHistoryPos === -1 ) {
                if ( colorHistory.length === 20 ) {
                    colorHistory.pop();
                PP.Tools.ColorPicker.$colorHistoryPalette.find('li').eq(19).remove();
                }
            }
            else {
                colorHistory.splice(colorHistoryPos, 1);
                PP.Tools.ColorPicker.$colorHistoryPalette.find('li').eq(colorHistoryPos).remove();
            }

            colorHistory.unshift(hexColor);

            var latestColorButton = $('<li><button role="button" class="button color" style="background-color:#' + hexColor + '" title="history:#' + hexColor + '" data-color="#' + hexColor + '" /> </button></li>');
            PP.Tools.ColorPicker.$colorHistoryPalette.prepend(latestColorButton);
            latestColorButton.find('a').addClass(classes.current);

            // bind click to new colors
            DOM.$color = $('.'+classes.color);
            DOM.$color.click(PP.Tools.ColorPicker.bindColorClick);
            DOM.$colorHistoryModule.removeClass(classes.hidden);

            // save to local storage
            if ( PP.Storage.canStorage() ) {
                localStorage.colorHistory = colorHistory;
            }
        };

        PP.Tools.ColorPicker.updateColorHistoryPalette = updateColorHistoryPalette;

        PP.Tools.ColorPicker.$colorHistoryPalette = $('.color-history-list');

        // choose color
        DOM.$color.click(PP.Tools.ColorPicker.bindColorClick);

        // custom color hover
        DOM.$8bitPicker.mouseover( function(e) {
            $(this).mousemove( PP.Tools.ColorPicker.mousemovePickerPalette );
        });

        DOM.$8bitPicker.mouseout( function(e) {
            $(this).unbind('mouseover');
            DOM.$colorPickerDemo.css('background-color', pixel.color);
            DOM.$hex.val(PP.Tools.ColorPicker.rgbToHex(DOM.$colorPickerDemo.css('background-color')));
        });

        // custom color chosen
        DOM.$8bitPicker.click(function(e) {
            var boundingRect = DOM.$8bitPicker.offset();
            var clickData = pickerPaletteCtx.getImageData( e.pageX - boundingRect.left, e.pageY - boundingRect.top, 1, 1).data;
            var newColor = PP.Tools.ColorPicker.getRGBColor(clickData);
            $('.'+classes.current).removeClass(classes.current);

            pixel.color = newColor;
            DOM.$colorPickerDemo.css('background-color', newColor);
            DOM.$draggydivs.css('box-shadow','5px 5px 0 ' + newColor);
        });

        // hex color input change
        DOM.$hex.keyup(PP.Tools.ColorPicker.hexColorChosen);
        DOM.$hex.focus(PP.Tools.ColorPicker.hexColorChosen);

        // color dropper clicked
        DOM.$dropper.click(function(e) {
            e.preventDefault();

            if ( DOM.$dropper.hasClass(classes.currentTool) ) {
            PP.Tools.resetModes();
            }
            else {
            PP.Tools.resetModes();
            mode.dropper = true;
            DOM.$dropper.addClass(classes.currentTool);
            DOM.$canvas.addClass(classes.dropperMode);

            DOM.$canvas.mousemove(function(e) {
                var hoverData = ctx.getImageData( e.pageX, e.pageY, 1, 1).data;
                var hoverRGB = PP.Tools.ColorPicker.getRGBColor(hoverData);
                DOM.$dropper.css('background-color', hoverRGB);

                DOM.$pixelSizeDemoDiv.css('background-image', 'none');
                DOM.$colorPickerDemo.css({
                'background-image' : 'none',
                'background-color' : hoverRGB
                });
                DOM.$hex.val(PP.Tools.ColorPicker.rgbToHex(hoverRGB));
            });
            }
        });

        // clear color history, palette and storage
        DOM.$colorHistoryTools.clearPalette.click(colorHistoryClick);

        function colorHistoryClick() {
            colorHistory = [];
            PP.Tools.ColorPicker.$colorHistoryPalette.find('li').remove();
            localStorage.colorHistory = [];
            localStorage.make8bitartPxon = JSON.stringify([]);
            DOM.$colorHistoryModule.addClass(classes.hidden);
        }

        // export color history
        DOM.$colorHistoryTools.exportPalette.click(function(){
            console.log('export coming soon');
        });

        // clear custom colors palette
        DOM.$colorCustomTools.clearPalette.click(function(){
            DOM.$colorCustomPalette.find('li').remove();
        });

        // import custom colors palette
        DOM.$colorCustomTools.importPalette.on('change', function(e){

            // get the file submitted
            var file = $(this).prop('files')[0];

            // helper function to parse csv data
            var parseCSVData = function(data) {

            // since we have csv data, clear the current custom palette
            DOM.$colorCustomPalette.find('li').remove();

            // get csv text and parse
            var csv = data.target.result;
            var rows = csv.split(/\r\n|\n/);

            for ( var i = 0; i < rows.length; i++ ) {
                var dataPair = rows[i].split(',');

                // create button, set properties, and add to palette
                var $newCustomButton = $('<a>');
                $newCustomButton.attr({
                'class' : 'button color',
                'style' : 'background-color:#' + dataPair[1],
                'title' : dataPair[0],
                'data-color' : '#' + dataPair[1]
                });
                var $newCustomButtonContainer = $('<li>').append($newCustomButton);
                DOM.$colorCustomPalette.append($newCustomButtonContainer);
            }

            // set events to make these colors work
            DOM.$color = $('.'+classes.color);
            DOM.$color.click(PP.Tools.ColorPicker.bindColorClick);
            };

            // read the file if browser has the FileReader API
            if ( window.FileReader ) {
                var fileReader = new FileReader();
                fileReader.readAsText(file);
                fileReader.onload = parseCSVData;
                fileReader.onerror = function() { alert('Unable to read file. Try again.'); };
                }
                else {
                alert('Your browser doesn\'t support FileReader, which is required for uploading custom palettes.');
                }
            });
        };

        function setLatestColorBtn(color) {
            var latestColorButton = $('<li><button role="button" class="button color" style="background-color:#' + color + '" title="history:#' + color + '" data-color="#' + color + '" /> </button></li>');
            PP.Tools.ColorPicker.$colorHistoryPalette.append(latestColorButton);
        }

        PP.Tools.ColorPicker.getRGBColor = function(imageData) {
            var opacity = imageData[3]/255;
            return 'rgba(' + imageData[0] + ', ' + imageData[1] + ', ' + imageData[2] + ', ' + opacity + ')';
        };

        PP.Tools.ColorPicker.rgbToHex = function( rgb ) {
            if ( rgb.length === 6 ) {
            return rgb;
            }
            else if ( rgb.charAt(0) === '#' && rgb.length === 7 ) {
            return rgb.slice(1,7);
            }
            else if ( rgb === 'transparent' ) {
            return null;
            }
            else {
            var startString = ( rgb.charAt(3) === 'a' ) ? 5 : 4;
            var rgbArray = rgb.substr(startString, rgb.length - 5).split(',');
            var hex = '';
            for ( var i = 0; i <= 2; i++ ) {
                var hexUnit = parseInt(rgbArray[i],10).toString(16);
                if ( hexUnit.length === 1 ) {
                hexUnit = '0' + hexUnit;
                }
                hex += hexUnit;
            }
            return hex;
            }
        };

        PP.Tools.ColorPicker.hexToRgba = function( hex ) {
            // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
            var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
            hex = hex.replace(shorthandRegex, function(m, r, g, b) {
            return r + r + g + g + b + b;
            });
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? 'rgba(' + parseInt(result[1], 16) + ', ' + parseInt(result[2], 16) + ', ' +  parseInt(result[3], 16) + ', 1)'  : null;
        };

        PP.Tools.ColorPicker.sanitizeColorArray = function( colorArray ) {
            for ( var i = 0; i < colorArray.length; i++ ) {
            colorArray[i] = PP.Tools.ColorPicker.rgbToHex(colorArray[i]);
            }
            return colorArray;
        };

        PP.Tools.ColorPicker.setDropperColor = function( color ) {
            pixel.color = color;
            DOM.$color.removeClass(classes.current);
            DOM.$pixelSizeDemoDiv.css('background-image', 'none');
            DOM.$colorPickerDemo.css('background-image', 'none');
            DOM.$pixelSizeDemoDiv.css('background-color', pixel.color);
            DOM.$colorPickerDemo.css('background-color', pixel.color);
            DOM.$hex.val(PP.Tools.ColorPicker.rgbToHex(DOM.$colorPickerDemo.css('background-color')));
            DOM.$draggydivs.css('box-shadow','5px 5px 0 ' + pixel.color);
        };

        PP.Tools.ColorPicker.hexColorChosen = function() {
            var newColor = '#' + DOM.$hex.val();
            $('.'+classes.current).removeClass(classes.current);
            DOM.$hex.addClass(classes.current);

            pixel.color = newColor;
            DOM.$colorPickerDemo.css('background-color', newColor);
            DOM.$draggydivs.css('box-shadow','5px 5px 0 ' + newColor);
        };

        PP.Tools.ColorPicker.areColorsEqual = function( alpha, beta ) {
            if ( ( alpha === 'rgba(0, 0, 0, 0)' && ( beta === '#000000' || beta === 'rgba(0, 0, 0, 1)' ) ) ||
            ( ( alpha === '#000000' || alpha === 'rgba(0, 0, 0, 1)' ) && beta === 'rgba(0, 0, 0, 0)' )  ||
            PP.Tools.ColorPicker.rgbToHex(alpha) !== PP.Tools.ColorPicker.rgbToHex(beta) ) {
            return false;
            }
            else {
            return true;
            }
        };


        PP.Tools.ColorPicker.bindColorClick = function() {
            var $newColor = $(this);
            var newColorLabel = $newColor.attr('data-color');
            var demoColor;

            $('.'+classes.current).removeClass(classes.current);
            $newColor.addClass(classes.current);
            pixel.color = newColorLabel;

            if ( pixel.color !== 'rgba(0, 0, 0, 0)' ) {
            demoColor = pixel.color;
            DOM.$pixelSizeDemoDiv.css('background-image', 'none');
            DOM.$colorPickerDemo.css('background-image', 'none');
            }
            else {
            DOM.$pixelSizeDemoDiv.css('background-image', windowCanvas.background);
            DOM.$colorPickerDemo.css('background-image', windowCanvas.background);
            DOM.$hex.val('');
            }
            DOM.$pixelSizeDemoDiv.css('background-color', demoColor);
            DOM.$colorPickerDemo.css('background-color', demoColor);
            DOM.$hex.val(PP.Tools.ColorPicker.rgbToHex(DOM.$colorPickerDemo.css('background-color')));
            DOM.$draggydivs.css('box-shadow','5px 5px 0 ' + newColorLabel);
        };

        PP.Tools.ColorPicker.mousemovePickerPalette = function(e) {
            var boundingRect = DOM.$8bitPicker.offset();
            var hoverData = pickerPaletteCtx.getImageData( e.pageX - boundingRect.left, e.pageY - boundingRect.top, 1, 1).data;
            var hoverRGB = PP.Tools.ColorPicker.getRGBColor(hoverData);
            DOM.$pixelSizeDemoDiv.css('background-image', 'none');
            DOM.$colorPickerDemo.css('background-image', 'none');
            DOM.$colorPickerDemo.css('background-color', hoverRGB);
            DOM.$hex.val(PP.Tools.ColorPicker.rgbToHex(hoverRGB));
        };

    }
());