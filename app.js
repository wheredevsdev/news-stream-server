require('dotenv').config();
const webServer = require("./web/server");
const database = require("./database");
const cron = require("./web/cron");
const BotLib = require("./library/bot");

(async function main() {

	console.log("Establishing connection to database.");
	await database.init();

	console.log("Starting HTTP web server.");
	let ioObject = await webServer();

	console.log("Starting job to fetch news.")
	cron.start("NEWS_FETCH");

	console.log("Starting job to send news for review.")
	cron.start("NEWS_REVIEW");

	console.log("Initiating Telegram review listener.");
	BotLib.listenForReviews(ioObject);

})();