(function() {
    PP.init = function(){
        var colorHistory = [];

        PP.Events.init();
        PP.Canvas.init();
        PP.Tools.init(colorHistory);
        PP.Storage.init(colorHistory);
        PP.Overlay.init();
        PP.LedControls.init();
    };
}());
