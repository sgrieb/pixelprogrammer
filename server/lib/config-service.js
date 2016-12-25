'use-strict';

var fs = require('fs');
var path = require('path');
var configPath = path.join(__dirname, '../config.json');

// constructor
function ConfigService () {
    this.config = JSON.parse(fs.readFileSync(configPath));
};

ConfigService.prototype.setLedState = function(state) {
    this.config.ledState = state;
    this.save();
}

ConfigService.prototype.save = function(){
    fs.writeFile(configPath, JSON.stringify(this.config), function(err) {
        if (err){
            throw err;
        }
        else{
            console.log('Config saved!');
        }
    });
}

module.exports = ConfigService;