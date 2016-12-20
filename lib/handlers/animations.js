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

    if (req.body.data){


        // set all the pixels!
        req.body.data.forEach(function(pixel){

            var color = new Rgba(pixel.color);

            matrixService.setPixel(pixel.x, pixel.y, color.R, color.G, color.B);
        });
    }

    // if (req.body.name) {
    //     // write the file
    //     fs.writeFileSync(path.join(__dirname, '../.././data/' + req.body.name + '.json'), JSON.stringify(req.body), function(err) {
    //         if(err) {
    //             return console.log(err);
    //         }

    //         console.log("The file was saved!");
    //     }); 
    // }
    // else {
    //     res.sendStatus(403);
    // }

};

module.exports = Animations;