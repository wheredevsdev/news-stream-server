/**
 * PostReview Schema
 * @description Documents of the following format should be created in the `postreview` collection once
 * an article has been reviewed
 * {
 * 		title: String // Title of the news article
 * 		author: String // Author of the article
 * 		publishDate: Date // Date of publish
 * 		source: String // Domain from which we pulled the article from 
 * 		url: String // Direct link to the article
 * 		snippet: String // Snippet to show in stream view
 * 		fullContent: String // Full content of the article to display in expanded view
 * 		reviewer: String // TG username of the admin who reviews the post
 * 		status: ["Rejected", "Accepted"] 
 * 
 * 		createdDate: Date // Date at which we created the post in our database.
 * }
 * 
 */

// 'use strict';
// var mongoose = require('mongoose');
// var Schema = mongoose.Schema;

// var PostReviewSchema = new Schema({
// 	title: {
//         type: String
//     },
//     author: {
//         type: String
//     },
//     content: {
//         type:String
//     }
// });

// module.exports = mongoose.model('newsy', PostReviewSchema);