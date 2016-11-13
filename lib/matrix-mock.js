'use-strict';

var Frame = require("./frame");

// constructor
function MatrixMock (){
    console.log('Matrix started!');
};

MatrixMock.prototype.fill = function (red, green, blue) {
    console.log('Filling with : RGB(' + red + ', ' + green + ', ' + blue + ')');
}

MatrixMock.prototype.setPixel = function (x, y, red, green, blue , alpha) {
    console.log('Set pixel ' + x + ', ' + y + ' :  RGBA(' + red + ', ' + green + ', ' + blue + ', ' + alpha + ')');
}

module.exports = MatrixMock;