const { CronJob } = require('cron');
const telegramBot = require('./bot');
const newsAPI = require("../library/newsAPI");

// Job configuration tuples.
// "jobName": ["cronTime", "tickFunction"]
// Call .start(jobName) to trigger tickFunction every cronTime.
const JOB_CONFIGS = {
    "NEWS_FETCH": ['* * */24 * * *', telegramBot.sendForReview],
    "NEWS_REVIEW": ['* * * */1 * *', newsAPI.getNews] // Iska cronTime koi set kar do.
};

exports.start = function (jobName) {
    const [cronTime, tickFunction] = JOB_CONFIGS[jobName];
    const cron = new CronJob({
        cronTime,
        onTick: () => { tickFunction() }
    });
    cron.start();
}
