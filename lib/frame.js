'use-strict';

var _ = require('lodash');
var Rgba = require('./rgba');

// constructor
function Frame (pxon){
    this.height = 32;
    this.width = 32;

    if(pxon){
        this.pxon = pxon;

        // sort pxon by default
        _.sortBy(pxon, ['x', 'y']);

        // attach rgb objects
        pxon.forEach(function(val){
            val.rgba = new Rgba(val.color);
        });
    }
};

module.exports = Frame;