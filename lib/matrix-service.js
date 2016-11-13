'use-strict';

var fs = require('fs');
var path = require('path');
var Frame = require('./frame');

// constructor
function MatrixService (matrix) {
    var obj = this;
    obj.matrix = matrix;
    obj.config = JSON.parse(fs.readFileSync(path.join(__dirname, '../config.json')));

    var defaultPath = path.join(__dirname, '../data/'+ obj.config.default +'.json');

    try {
        fs.accessSync(defaultPath, fs.F_OK);
        // turn pxon to frame
        obj.defaultFrame = new Frame(JSON.parse(fs.readFileSync(defaultPath)));
    } catch (e) {
        // file doesnt exist, init empty
        obj.defaultFrame = new Frame([]);
    }
};

MatrixService.prototype.setFrame = function (frame) {
    if(frame){
        setPixels(frame, this.matrix);
    }
    else{
        setPixels(this.defaultFrame, this.matrix);
    }

    function setPixels(frame, matrix) {
        frame.pxon.forEach(function(val){
            matrix.setPixel(val.x, val.y, val.rgba.R, val.rgba.G, val.rgba.B, val.rgba.A);
        });
    }
}

module.exports = MatrixService;