'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NewsSchema = new Schema({

    title: {
        type: String
    },
    author: {
        type: String
    },
    content: {
        type:String
    }
});

module.exports = mongoose.model('newsy', NewsSchema);