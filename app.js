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

// start the webserver!
var webserver = new WebServer(process.env.CLIENT || './client');
webserver.start();

// turn on the matrix!
var matrixService = new MatrixService(new LedMatrix());
matrixService.setFrame();
