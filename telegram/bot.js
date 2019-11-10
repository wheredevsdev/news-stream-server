const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(process.env.TOKEN, { polling: true });

const { COLLECTIONS } = require("../constants");
const { getModel: collection } = require("../database");

module.exports.botInit = async function () {

	const chatId = Number(process.env.CHATID);
	console.log(process.env.CHATID);

	//Find the "unsent" articles in the preReview collection.
	collection(COLLECTIONS.PRE_REVIEW).find({ status:"unsent" }).limit(20).exec((err, news) => {
		news.forEach((news) => {
			console.log(news._id);
			var completeTitle = ''+news.title;

			//Trimming the title down to 20 display characters.
			var articleTitleTrim = completeTitle.substring(0,20) + '...';

			//Checking that the title only contains ASCII characters
			//Because the bot does not support non-ascii characters 
			let ascii = /^[ -~\t\n\r]+$/;
			let title = "";

			if(ascii.test(articleTitleTrim)){
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
							}, {
								text: 'Reject',
								callback_data: title + ',Rejected,'+news._id 
							}
						]]
					}
				}
			).then(function(){

				// Change the status of the article to "sentForReview" in DB.
				collection(COLLECTIONS.PRE_REVIEW).findOneAndUpdate({_id: news._id}, {status: "sentForReview"}, {upsert:false}, function(err,doc){
					if(err){
						console.log(err);
					}
				});
			}).catch(function(err){
				console.log(err);
				process.exit(1);
			});
		});
	});
}


bot.on('callback_query', (callbackQuery) => {

	const message = callbackQuery.message;
	const callback = callbackQuery.data;

	var newsDetails = callback.split(',');

	//Send a message telling whether the article has been accepted or rejected.
	bot.sendMessage(message.chat.id, "Article \"" + newsDetails[0] + "\" has been " + newsDetails[1] );
	
	//Delete the message with article details and inline keyboard.
	bot.deleteMessage(process.env.CHATID,message.message_id);
});

