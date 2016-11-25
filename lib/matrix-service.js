'use-strict';

var fs = require('fs');
var path = require('path');
var Frame = require('./util/frame');
var LedMatrix;

// mock the led matrix during development
if (process.env.DEVELOPMENT) {
    LedMatrix = require("./matrix-mock");
}
else {
    LedMatrix = require("node-rpi-rgb-led-matrix");
}

// constructor
function MatrixService () {
    var obj = this;

    obj.matrix = new LedMatrix(32);
    obj.config = JSON.parse(fs.readFileSync(path.join(__dirname, '../config.json')));

    // var defaultPath = path.join(__dirname, '../data/'+ obj.config.default +'.json');

    // try {
    //     fs.accessSync(defaultPath, fs.F_OK);
    //     // turn pxon to frame
    //     obj.defaultFrame = new Frame(JSON.parse(fs.readFileSync(defaultPath)));
    // } catch (e) {
    //     // file doesnt exist, init empty
    //     obj.defaultFrame = new Frame([]);
    // }
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

MatrixService.prototype.fill = function (r, g, b) {
    this.matrix.fill(r, g, b);
}

module.exports = MatrixService;