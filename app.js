require('dotenv').config();
const webServer = require("./web/server");
const database = require("./database");
const newsBot = require("./telegram/cron");


(async function main() {
	
	console.log("Establishing connection to database.");
	await database.init();

	console.log("Starting HTTP web server.");
	await webServer();

	console.log("Starting Telegram Review Bot.");
	await newsBot();

})();