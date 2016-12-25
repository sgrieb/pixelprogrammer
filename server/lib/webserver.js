'use-strict';

var express = require('express');
var path = require('path');
var fs = require("fs");
var bodyParser = require('body-parser');
var MatrixService = require("./matrix-service");

// web handlers
var Led = require('./handlers/led');
var Animations = require('./handlers/animations');

var app;
var port = 80;

if(process.env.PORT){
    port = process.env.PORT;
}

// constructor
function WebServer (clientDir){

    // turn on the matrix!
    this.matrixService = new MatrixService();

    this.matrixService.start();

    this.clientDir = clientDir;
};

WebServer.prototype.start = function () {
    var obj = this;
    app = express();

    // parse bodies as json
    app.use(bodyParser.json());

    // host static files
    app.use('/', express.static(this.clientDir));

    // handlers
    Led.init(this.matrixService);
    
    Animations.init(this.matrixService);

    // toggle the led
    app.get('/led/toggle/:state', Led.toggle);

    // get animations
    app.get('/animations', Animations.get)

    // post animations
    app.post('/animations', Animations.post);

    app.listen(port);
    console.log('Server started on port: '+ port +'!');
};

module.exports = WebServer;