(function() {
    PP.Storage = {
    };

    PP.Storage.init = function(colorHistory){
        // check local storage for color history palette
        if ( PP.Storage.canStorage() && localStorage.colorHistory ) {
            colorHistory = localStorage.colorHistory.split(',');
        }
        else {
            colorHistory = [];
            DOM.$colorHistoryModule.addClass(classes.hidden);
        }

        // only show the following in draggy divs if local storage exists
        if ( !PP.Storage.canStorage() ) {
            $('.'+classes.local).addClass(classes.hidden);
        }
        else {
            if ( localStorage.make8bitartSavedCanvasArray && localStorage.make8bitartSavedCanvasArray !== '[]' ) {
            // draw local storage gallery
            savedCanvasArray = JSON.parse(localStorage.make8bitartSavedCanvasArray);
            PP.Overlay.renderLocalGallery();

            // open local storage gallery
            DOM.$buttonOpenLocal.trigger('click');
            }
            else {
            DOM.$openLocalForm.addClass(classes.hidden);
            }
        }

        // save locally
        DOM.$buttonSaveLocal.click(function() {
            PP.Storage.saveToLocalStorageArray();
            PP.Overlay.renderLocalGallery();

            alert('Your art has been saved locally to your browser. You can see all locally saved art by clicking the "open existing art" button!');
        });

        // save full canvas
        DOM.$buttonSaveFull.click(function() {
            var savedPNG = DOM.$canvas[0].toDataURL('image/png');
            PP.Overlay.displayFinishedArt(savedPNG);
        });

        // save selection of canvas button clicked
        DOM.$buttonSaveSelection.click(function() {
            if ( mode.save ) {
            mode.save = false;
            DOM.$saveInstruction.slideUp();
            $(this).val(copy.selectionOn);
            DOM.$overlay.addClass(classes.hidden);
            }
            else {
            PP.Tools.resetModes();
            mode.save = true;
            DOM.$saveInstruction.slideDown();
            $(this).val(copy.selectionOff);
            ctxOverlay.fillRect(0,0,DOM.$overlay.width(),DOM.$overlay.height());
            DOM.$overlay.removeClass(classes.hidden);
            }
        });

        // open import local modal
        DOM.$buttonOpenLocal.click(function(){
            DOM.$openLocalModalContainer.removeClass(classes.hidden);
            DOM.$openLocalModalContainer.find('.ui-hider').focus();
        });

        // import pxon
        DOM.$buttonImportPXON.change(PP.Storage.importPXON);

        // export pxon
        DOM.$buttonExportPXON.click(PP.Storage.exportPXON);

        // hide save modal container if exit button clicked
        DOM.$modalExit.click(function() {
            DOM.$modalContainers.addClass(classes.hidden);
            DOM.$linkImgur.html('');
            DOM.$buttonSaveImgur.removeClass(classes.hidden);
        });

        // hide save modal container if clicking outside of modal
        DOM.$modalContainers.click(function(e) {
            var target = $(e.target).context;
            if ( target === DOM.$saveModalContainer[0] || target === DOM.$openLocalModalContainer[0] ) {
            $(this).addClass(classes.hidden);
            }
        });

        // save to imgur
        DOM.$buttonSaveImgur.click(function() {
            PP.Storage.uploadToImgur();
        });

        DOM.$buttonExportLed.click(function(){
            var toSave = {
                name: 'steve',
                data:JSON.parse(localStorage.make8bitartPxon)
            };

            PP.API.postPxon(JSON.stringify(toSave));
        });
    };

    PP.Storage.canStorage = function(){
        try {
            return 'localStorage' in window && window.localStorage !== null;
            }
            catch (e) {
            return false;
        }
    };

    PP.Storage.saveToLocalStorage = function(){
        if ( PP.Storage.canStorage() ) {
        savedCanvas = DOM.$canvas[0].toDataURL('image/png');
        localStorage.make8bitartSavedCanvas = savedCanvas;
        }
    };

    PP.Storage.saveToLocalStorageArray = function(){
        if ( PP.Storage.canStorage() ) {
        //parsejson
        if ( localStorage.make8bitartSavedCanvasArray ) {
            savedCanvasArray = JSON.parse(localStorage.make8bitartSavedCanvasArray);
        }
        else {
            savedCanvasArray = [];
        }

        //push
        savedCanvasArray.push(DOM.$canvas[0].toDataURL('image/png'));

        //stringify
        localStorage.make8bitartSavedCanvasArray = JSON.stringify(savedCanvasArray);
        }
    };

    PP.Storage.uploadToImgur = function(){
        var imgDataURL = DOM.$saveImg.attr('src').replace(/^data:image\/(png|jpg);base64,/, '');
        $.ajax({
        method: 'POST',
        url: 'https://api.imgur.com/3/image',
        headers: {
            Authorization: 'Client-ID ' + imgur.clientId,
        },
        dataType: 'json',
        data: {
            image: imgDataURL,
            type: 'base64',
            title: 'made on make8bitart.com',
            description: 'made on make8bitart.com'
        },
        success: function(result) {
            var directURL = result.data.link;
            var shareURL = 'https://imgur.com/gallery/' + result.data.id;
            var imgurHTML = '<p>imgur page: <a target="_blank" href="' + shareURL + '">' + shareURL + '</a><br />' +
                                'direct image link: <a target="_blank" href="' + directURL + '">' + directURL + '</a></p>';
            DOM.$linkImgur.html( imgurHTML);
            DOM.$buttonSaveImgur.addClass(classes.hidden);
        },
        error: function(result) {
            DOM.$linkImgur.text('There was an error saving to Imgur.');
        }
        });
    };

    PP.Storage.getFileData = function(file){
        if ( window.FileReader ) {
        var fileReader = new FileReader();
        fileReader.readAsText(file);
        fileReader.onload = function(data){
            if (data) {
                pxon = JSON.parse(data.target.result);
                historyPointer = undoRedoHistory.length - 1;

                // draw image to reset canvas
                PP.Canvas.reset();

                // set local storage
                localStorage.make8bitartPxon = JSON.stringify(pxon.pxif.pixels);

                // draw the pxon
                pxon.pxif.pixels.forEach(function(e, i, a){
                    PP.Canvas.drawPixel(e.x, e.y, e.color, e.size );
                });
            }
        };

        fileReader.onerror = function() { alert('Unable to read file. Try again.'); };
        }
        else {
        alert('Your browser doesn\'t support FileReader, which is required for uploading custom palettes.');
        }
    };

    PP.Storage.pushPixelToStorage = function(x, y, color, size){
        // clone the storage
        var pxonArr = [];

        if(localStorage.make8bitartPxon) {
            pxonArr = JSON.parse(localStorage.make8bitartPxon);
        }

        var newStorage = pxonArr.slice(0);

        var newPixel = {
            x:x,
            y:y,
            color:color,
            size:size
        };

        if(pxonArr.length > 0){
        var found = false;
        // check the storage for our new pixel
        pxonArr.forEach(function(val, index){
            // we are already storing this pixel
            if(val.x == x && val.y == y){
            found = true;
            if(color == 'rgba(0, 0, 0, 0)'){
                // remove if its transparent
                newStorage.splice(index, 1);
            }
            else{
                // replace it, its a new color
                newStorage[index] = newPixel;
            }
            }
        });
        if(!found){
            newStorage.push(newPixel);
        }

        //update the storage
        localStorage.make8bitartPxon = JSON.stringify(newStorage);
        }
        else{
        // this is the first item
        if(color != 'rgba(0, 0, 0, 0)'){
            localStorage.make8bitartPxon = JSON.stringify([newPixel]);
        }
        }
    };

    PP.Storage.importPXON = function(e){
        var file = $(this).prop('files')[0];
        PP.Storage.getFileData(file);
    };

    PP.Storage.exportPXON = function(e){
        // other exif info
        pxon.exif.software = 'make8bitart.com';
        pxon.exif.dateTime = new Date();
        pxon.exif.dateTimeOriginal = ( pxon.exif.dateTimeOriginal ) ? pxon.exif.dateTimeOriginal : pxon.exif.dateTime;

        // pxif
        pxon.pxif.pixels = JSON.parse(localStorage.make8bitartPxon);

        // export pxon in new window
        window.open('data:text/json,' + encodeURIComponent(JSON.stringify(pxon)), '_blank');
    };

}());