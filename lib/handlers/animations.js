'use-strict';

var fs = require('fs');
var path = require('path');

var Animations = {};

Animations.init = function(){
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

module.exports = Animations;