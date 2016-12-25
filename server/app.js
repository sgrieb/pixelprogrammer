'use strict';

require('dotenv').config();
var WebServer = require("./lib/webserver");

// start the webserver!
var webserver = new WebServer(process.env.CLIENT || './client');
webserver.start();

