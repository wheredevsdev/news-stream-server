const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(process.env.TOKEN, { polling: true });

const { COLLECTIONS } = require("../constants");
const { getModel: collection } = require("../database");

module.exports = async function () {

	

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
								callback_data: 'Accepted,' + news._id
							}, {
								text: 'Reject',
								callback_data: 'Rejected,' + news._id
							}
						]]
					}
				}
			);


		});
	});
	

	bot.on('callback_query', (callbackQuery) => {

		const message = callbackQuery.message;
		const callback = callbackQuery.data;

		bot.sendMessage(message.chat.id, `Article has been "${callback}"`);
	});
}