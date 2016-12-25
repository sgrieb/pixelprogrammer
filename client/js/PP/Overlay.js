(function() {
    PP.Overlay = {
    };

    PP.Overlay.init = function(){
        DOM.$overlay.mousedown(PP.onMouseDown).mouseup(PP.onMouseUp);
        DOM.$overlay[0].addEventListener('touchstart', PP.onMouseDown, false);
        DOM.$overlay[0].addEventListener('touchend', PP.onMouseUp, false);

        // close save modal alias to esc
        key('esc', function(){ DOM.$modalContainers.addClass(classes.hidden); });
    };

    PP.Overlay.displayFinishedArt = function(src){
        DOM.$saveImg.attr('src', src);
        DOM.$saveImg.parent().attr('href', src);
        DOM.$saveModalContainer.removeClass(classes.hidden);
        DOM.$saveModalContainer.find('.ui-hider').focus();
    };

    PP.Overlay.renderLocalGallery = function(){
        if ( savedCanvasArray.length === 0 ) {
        DOM.$openLocalModalContainer.addClass(classes.hidden);
        DOM.$openLocalForm.addClass(classes.hidden);
        return;
        }

        DOM.$openLocalForm.removeClass(classes.hidden);
        DOM.$openLocalGalleryItems.remove();

        for( var i = 0; i < savedCanvasArray.length; i++ ) {
        var $li = $('<li data-local="' + i + '">' +
            '<button role="button" class="thumb"><img src="' + savedCanvasArray[i] + '" alt="open thumbnail #' + i + '" /></button>' +
            '<button role="button" class="delete"><img class="delete" src="assets/draggybits/hider.png" alt="delete thumbnail #' + i + '"></button>' +
        '</li>');
        DOM.$openLocalGallery.append($li);
        }

        DOM.$openLocalGalleryItems = DOM.$openLocalGallery.find('li');
        DOM.$openLocalGalleryItemThumbs = DOM.$openLocalGallery.find('.thumb');
        DOM.$openLocalGalleryItemDelete = DOM.$openLocalGallery.find('.delete');

        DOM.$openLocalGalleryItemThumbs.click(function(){
        var img = savedCanvasArray[$(this).parent('li').data('local')];
        PP.Canvas.drawToCanvas(img, 0, 0, true);
        DOM.$openLocalModalContainer.addClass(classes.hidden);
        });

        // delete locally
        DOM.$openLocalGalleryItemDelete.click(function() {
        if ( window.confirm('Careful! This will permanently delete this thumbnail\'s art from your browser.') ) {
            savedCanvasArray.splice($(this).parent('li').data('local'), 1);
            localStorage.make8bitartSavedCanvasArray = JSON.stringify(savedCanvasArray);
            savedCanvasArray = JSON.parse(localStorage.make8bitartSavedCanvasArray);
            PP.Overlay.renderLocalGallery();
        }
        });
    };

}());