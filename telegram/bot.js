const { getModel: collection } = require("../database");
const { Types } = require('mongoose');
const Bluebird = require("bluebird");

const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(process.env.TOKEN, { polling: true });

const { COLLECTIONS } = require("../constants");


/**
 * @description Triggered when someone presses the 'Accept' or 'Reject' button.
 * @param { * } ioObject socket.io Object
 */
function listenForReviews(ioObject) {

	bot.on('callback_query', callbackQuery => {

		const message = callbackQuery.message;
		const callback = callbackQuery.data;

		const newsDetails = callback.split(',');

		return Promise.resolve()
			.then(function () {
				// Adding article to PostReview if it has been accepted
				if (newsDetails[1] == 'Accepted') {
					return collection(COLLECTIONS.PRE_REVIEW)
						.findOne({ _id: Types.ObjectId(newsDetails[2]) })
						.exec()
						.then(news => {
							console.log("Inserting data into the post-review collection");

							return collection(COLLECTIONS.POST_REVIEW)
								.create({
									title: news.title,
									author: news.author,
									publishedDate: news.publishedAt,
									origin: news.source,
									url: news.url,
									urlToImage: news.urlToImage,
									content: news.content
								})
								.then(function () {
									// Emit new article event only when succesfully saved to our database.
									ioObject.sockets.emit('new_article', { data: 'SomeArticle' });

									// Delete the message with article details and inline keyboard.
									bot.deleteMessage(process.env.CHATID, message.message_id);
								});
						})
						.catch(err => {
							console.log(err);
							return bot.sendMessage(message.chat.id, "An error occurred while 'Accepting' \"" + newsDetails[0] + "\". The _id is: " + newsDetails[2]);
						});
				} else {
					return undefined;
				}
			})
			.then(function () {
				// Send a message telling whether the article has been accepted or rejected.
				return bot.sendMessage(message.chat.id, "Article \"" + newsDetails[0] + "\" has been " + newsDetails[1])
					.then(() => nModel.findOneAndUpdate({ _id: newsDetails[2] }, { status: newsDetails[1] }, { upsert: false }));
			})
			.catch(err => console.log(err));
	});
}
exports.listenForReviews = listenForReviews;



/**
 * @description Fetches articles from 'prereview' collection and sends messages for review using
 * the TG bot api.
 */
function sendForReview(articleLimit = 20) {

	const chatId = parseInt(process.env.CHATID);
	// Find the "unsent" articles in the preReview collection.
	collection(COLLECTIONS.PRE_REVIEW)
		.find({ status: "unsent" })
		.limit(articleLimit)
		.then(news => {
			return Bluebird.map(news, news => {
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
				return bot.sendMessage(
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
				})
					.catch(function (err) {
						console.log(err);
					});
			});
		})
		.catch(function (err) {
			console.log(err);
		});
}

exports.sendForReview = sendForReview;
