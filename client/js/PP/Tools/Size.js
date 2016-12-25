(function() {
    PP.Tools.Size = {
    };

    PP.Tools.Size.init = function() {
        PP.Tools.Size.setSize(15);

        // pixel size slider changed
        DOM.$pixelSizeInput.change(function() {
            PP.Tools.Size.set( $(this).val() );
        });
    };

    PP.Tools.Size.setSize = function(size){
        if(size){
            pixel.size = parseInt(size);
            DOM.$pixelSizeDemoDiv.css({
                width : pixel.size,
                height: pixel.size
            });
            DOM.$pixelSizeInput.val(pixel.size);

            var img = new Image();
            img.src = PP.Canvas.generateBackgroundGrid(pixel.size);
            img.onload = function updateCanvasBackground() {
                DOM.$canvas.css('background','url(' + img.src + ')');
            };
        }
    }
}());