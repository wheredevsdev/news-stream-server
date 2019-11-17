/**
 * preReview Schema
 * @description Documents should be created in the `PreReview` collection once
 * they are scraped or pulled from an API, in the following format:
 * {
 * 	title: String 			// Title of the news article
 * 	author: String 		// Author of the article
 * 	publishedDate: Date 	// Date of publish
 * 	origin: String 		// Domain from which we pulled the article from 
 * 	url: String 			// Direct link to the article
 * 	source: 					// ["Crawler", "API"]
 * 	status: 					// whether or not the article has been ent for review to admins
 * }
 * 
 */

"use strict";
const mongoose = require("mongoose");

const preReviewSchema = new mongoose.Schema({
	title: {
		type: String
	},
	author: {
		type: String
	},
	publishedDate: {
        type:Date,
        default: (new Date()).toLocaleDateString()
	}, 
	origin: {
		type: String
	},
	url: {
		type: String
	},
	urlToImage: {
		type: String
	},
	content: {
		type: String
	}, 
	source: {
		type:String,
		default:"API"
	},
	status: {
		type:String,
		default:"unsent"
	}
}, {
	timestamps: true
});

const PreReview = mongoose.model("PreReview", preReviewSchema);

module.exports = PreReview;