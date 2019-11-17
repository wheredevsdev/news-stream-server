/**
 * postReview Schema
 * @description Documents should be created in the `PostReview` collection once
 * an article has been reviewed, in the following format:
 * {
 * 	title: String 		// Title of the news article
 * 	author: String 	// Author of the article
 * 	publishDate: Date // Date of publish
 * 	origin: String 	// Domain from which we pulled the article from 
 * 	url: String 		// Direct link to the article
 * 	content: String 	// Full content of the article to display in expanded view
 * 	reviewer: String 	// TG username of the admin who reviews the post
 * 	status: 				// ["Rejected", "Accepted"]
 * 	preReview: 			// reference to the article in the PreReview collection
 * }
 * 
 */

"use strict";
const mongoose = require("mongoose");

const postReviewSchema = new mongoose.Schema({
	title: {
		type: String
	},
	author: {
		type: String
	},
	publishedDate: {
		type: Date
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
		default:"Accepted"
	},
	reviewer: {
		type: String
	},
	preReview: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "PreReview"
	}
}, {
	timestamps: true
});

const PostReview = mongoose.model("PostReview", postReviewSchema);

module.exports = PostReview;