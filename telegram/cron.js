const { CronJob } = require('cron');
const telegramBot = require('./bot');

const CRON_CONFIGURATIONS = {
    cronTime: '* */5 * * * *',
    onTick: telegramBot.sendForReview,
    runOnInit: true
};

module.exports = async function () {
    const cron = new CronJob(CRON_CONFIGURATIONS);
    cron.start();
}
