'use-strict';

var express = require('express');
var path = require('path');
var fs = require("fs");
var bodyParser = require('body-parser');

var app;
var port = 80;

if(process.env.PORT){
    port = process.env.PORT;
}

// constructor
function WebServer (clientDir){
    this.clientDir = clientDir;
};

WebServer.prototype.start = function () {
    app = express();

    // parse bodies as json
    app.use(bodyParser.json());

    // host static files
    app.use('/', express.static(this.clientDir));

    // post files
    app.post('/pxon', function (req, res) {
        
        // write the file
        fs.writeFileSync(path.join(__dirname, './data/test.json'), JSON.stringify(req.body), function(err) {
            if(err) {
                return console.log(err);
            }

            console.log("The file was saved!");
        }); 

        res.send('Oh hey!');
    });

    app.listen(port);
    console.log('Server started on port: '+ port +'!');
};

module.exports = WebServer;