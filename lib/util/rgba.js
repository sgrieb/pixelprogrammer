'use-strict';

// constructor
function Rgba (rgbStr){

    // get the 3 color values as strings
    // remove rgba( )
    var colorStr = rgbStr.substring(5, rgbStr.length-1);

    // array of each color
    var colorArr = colorStr.split(',');

    // set the colors
    this.R = colorArr[0].trim();
    this.G = colorArr[1].trim();
    this.B = colorArr[2].trim();
    this.A = colorArr[3].trim();
};

module.exports = Rgba;