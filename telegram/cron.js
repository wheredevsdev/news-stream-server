const { CronJob } = require('cron');
const telegramBot = require('./bot');


module.exports = async function (ioObject) {

    const CRON_CONFIGURATIONS = {
        cronTime: '*/1 * * * * ',
        onTick: () => telegramBot.sendForReview(),
        runOnInit: true
    };

    const cron = new CronJob(CRON_CONFIGURATIONS);
    cron.start();
}
