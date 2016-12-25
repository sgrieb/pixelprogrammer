(function() {
    PP.Tools.Instruments = {
    };

    PP.Tools.Instruments.init = function() {
        // draw clicked
        DOM.$pencil.click(function(e) {
            e.preventDefault();
            PP.Tools.resetModes();
            $(this).addClass(classes.currentTool);
        });

        // paint clicked
        DOM.$paint.click(function(e) {
            e.preventDefault();
            PP.Tools.resetModes();
            $(this).addClass(classes.currentTool);
            mode.paint = true;
        });

        // pencil tool (matches photoshop)
        key('B', PP.Tools.Edit.triggerClickForEnabled(DOM.$pencil));

        // paint bucket tool (matches photoshop)
        key('G', PP.Tools.Edit.triggerClickForEnabled(DOM.$paint));
    };
}());