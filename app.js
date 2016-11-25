'use strict';

require('dotenv').config();
var WebServer = require("./lib/webserver");
var MatrixService = require("./lib/matrix-service");

var LedMatrix;

// mock the led matrix during development
if (process.env.DEVELOPMENT) {
    LedMatrix = require("./lib/matrix-mock");
}
else {
    LedMatrix = require("node-rpi-rgb-led-matrix");
}


// turn on the matrix!
var matrixService = new MatrixService(new LedMatrix(32));
matrixService.fill(255, 50, 100);
//matrixService.setFrame();

// start the webserver!
var webserver = new WebServer(process.env.CLIENT || './client', matrixService);
webserver.start();

