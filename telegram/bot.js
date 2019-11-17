var newsModel = require('../database/models/PostReview');
const { getModel: collection } = require("../database");
const mongoose = require('mongoose');
const nModel = mongoose.model('PreReview');
const postReviewModel = mongoose.model('PostReview');

const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(process.env.TOKEN, { polling: true });

const { COLLECTIONS } = require("../constants");


/**
 * @description Triggered when someone presses the 'Accept' or 'Reject' button.
 * @todo Fetch document from Prereview using _id in newsDetails[2];
 */

async function setBotCallbackEvent (ioObject){

	bot.on('callback_query', callbackQuery => {

		const message = callbackQuery.message;
		const callback = callbackQuery.data;
	
		const newsDetails = callback.split(',');
			
		// Send a message telling whether the article has been accepted or rejected.
		bot.sendMessage(message.chat.id, "Article \"" + newsDetails[0] + "\" has been " + newsDetails[1])
		.then(() => nModel.findOneAndUpdate({ _id: newsDetails[2] }, { status: newsDetails[1] }, { upsert: false }))
		.catch(err => console.log(err));

		let ObjectId = mongoose.Types.ObjectId;

		// Adding article to PostReview if it has been accepted
		if(newsDetails[1] == 'Accepted') {

			ioObject.sockets.emit('new_article', {data: 'SomeArticle'});

			nModel.findOne({ _id: ObjectId(newsDetails[2]) }).exec()
			.then(news => {
				console.log("Inserting data into the post-review collection");
				postReviewModel.create({
					title: news.title,
					author: news.author,
					publishedDate: news.publishedAt,
					origin: news.source,
					url: news.url,
					urlToImage: news.urlToImage,
					content: news.content
				});

				////console.log(news);
				// Delete the message with article details and inline keyboard.
				bot.deleteMessage(process.env.CHATID, message.message_id);
			})
			.catch(err => {
				console.log(err);
				bot.sendMessage(message.chat.id, "An error occurred while 'Accepting' \"" + newsDetails[0] + "\". The _id is: " + newsDetails[2]);
			});
		}
		
	});

}
exports.setBotCallbackEvent = setBotCallbackEvent;



/**
 * @description Fetches articles from 'prereview' collection and sends messages for review using
 * the TG bot api.
 */
function sendForReview() {

	const chatId = parseInt(process.env.CHATID);
	// Find the "unsent" articles in the preReview collection.
	collection(COLLECTIONS.PRE_REVIEW)
		.find({ status: "unsent" })
		.limit(20)
		.then(news => {
			news.forEach((news) => {
				const completeTitle = '' + news.title;

				// Trimming the title down to 20 display characters.
				const articleTitleTrim = completeTitle.substring(0, 20) + '...';

				// Checking that the title only contains ASCII characters
				// Because the bot does not support non-ascii characters 
				const ascii = /^[ -~\t\n\r]+$/;
				let title = "";

				if (ascii.test(articleTitleTrim)) {
					title = articleTitleTrim;
				}

				//Sending the message with article details and inline keyboard.
				bot.sendMessage(
					chatId,
					'Review ' + news.title + ' at ' + news.url + ' ?',
					{
						reply_markup: {
							inline_keyboard: [[
								{
									text: 'Accept',
									callback_data: title + ',Accepted,' + news._id
								},
								{
									text: 'Reject',
									callback_data: title + ',Rejected,' + news._id
								}
							]]
						}
					}
				).then(function () {
					// Change the status of the article to "sentForReview" in DB.
					return collection(COLLECTIONS.PRE_REVIEW)
						.findOneAndUpdate({ _id: news._id }, { status: "sentForReview" }, { upsert: false })
						.catch(function (err) {
							console.log(err);
						});
				});
			});
		})
		.catch(function (err) {
			console.log(err);
		});
}

exports.sendForReview = sendForReview;
