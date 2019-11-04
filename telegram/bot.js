const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(process.env.TOKEN, { polling: true });

const { COLLECTIONS } = require("../constants");
const { getModel: collection } = require("../database");

module.exports.botInit = async function () {

	const chatId = Number(process.env.CHATID);
	console.log(process.env.CHATID);

	collection(COLLECTIONS.PRE_REVIEW).find({ status:"unsent" }).exec((err, news) => {
		news.forEach((news) => {
			console.log(news._id);
			bot.sendMessage(
				chatId,
				'Review ' + news.title + '?',
				{
					reply_markup: {
						inline_keyboard: [[
							{
								text: 'Accept',
								callback_data: news.title + ',Accepted,' + news._id
							}, {
								text: 'Reject',
								callback_data: news.title + ',Rejected,' + news._id
							}
						]]
					}
				}
			).then(function(){
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

module.exports.botCallbackInit = async function(){

	bot.on('callback_query', (callbackQuery) => {

		const message = callbackQuery.message;
		const callback = callbackQuery.data;

		var newsTitle = callback.split(',');
		bot.sendMessage(message.chat.id, 'Article '+ newsTitle[0] + ' has been ' + newsTitle[1] )
		
		bot.deleteMessage(process.env.CHATID,message.message_id);
	});
	
}