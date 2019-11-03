/**
 * PreReview Schema
 * @description Documents of the following format should be created in the `prereview` collection once
 * they are scraped or pulled from an API.
 * {
 * 		title: String // Title of the news article
 * 		author: String // Author of the article
 * 		publishDate: Date // Date of publish
 * 		origin: String // Domain from which we pulled the article from 
 * 		url: String // Direct link to the article
 * 		source: ["Crawler", "API"]
 * 
 * 		createdDate: Date // Date at which we created the post in our database.
 * }
 * 
 */

'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PreReviewSchema = new Schema({
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

module.exports = mongoose.model('newsy', PreReviewSchema);