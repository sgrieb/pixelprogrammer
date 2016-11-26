'use-strict';

var Led = {};
var matrixService;

Led.init = function(_matrixService){
    matrixService = _matrixService;
};

Led.toggle = function(req, res) {
    var success = false;
    if(req.params.state === "1"){
        success = matrixService.start();
    }
    else if(req.params.state === "0") {
        success = matrixService.stop();
    }

    // respond
    if(success) {
        res.sendStatus(200);
    }
    else{
        res.sendStatus(500);
    }
};

module.exports = Led;