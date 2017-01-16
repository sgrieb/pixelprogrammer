'use-strict';

var fs = require('fs');
var path = require('path');
var Rgba = require('./../util/rgba');
var matrixService;

var Animations = {};

Animations.init = function(_matrixService){
    matrixService = _matrixService;
};

Animations.get = function(req, res) {

    var folderPath = path.join(__dirname, '../../data');
    var dirs = getDirectories(folderPath);

    res.send(dirs);

    function getDirectories(srcpath) {
        return fs.readdirSync(srcpath).filter(function(file) {
            return fs.statSync(path.join(srcpath, file)).isDirectory();
        });
    }
};

Animations.post = function(req, res) {

    // code for posting json
    // if (req.body.data){
    //     // set all the pixels!
    //     req.body.data.forEach(function(pixel){

    //         var color = new Rgba(pixel.color);

    //         matrixService.setPixel(pixel.x, pixel.y, color.R, color.G, color.B);
    //     });
    // }

    // if we have an animation name
    if (req.body.name) {

        var folder = path.join(__dirname, '../.././data/' + req.body.name);

        // if the folder doesnt exist, make it
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder);
        }

        // write the file
        fs.writeFileSync(folder + '/1.json', JSON.stringify(req.body.data));

        res.sendStatus(200);
    }
    else {
        res.sendStatus(403);
    }

};

module.exports = Animations;