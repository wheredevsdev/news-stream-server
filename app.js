require('dotenv').config();
const webServer = require("./web/server");
const database = require("./database");
const newsAPI = require("./library/newsAPI");
const newsBotJob = require("./telegram/cron");
const newsBot = require("./telegram/bot");

(async function main() {
	
	console.log("Establishing connection to database.");
	await database.init();

	console.log("Starting HTTP web server.");
	let ioObject = await webServer();

	// console.log("Starting the news api fetch");
	// await newsAPI.getNews();

	console.log("Starting Telegram review bot.");
	await newsBotJob();

	console.log("Initiating Telegram review bot Callback listener.");
	await newsBot.setBotCallbackEvent(ioObject);
	
})();