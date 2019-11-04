module.exports = async function () {

    const cronJob = require('node-cron');
    const telegramBot = require('./bot');

    const CRON_CONFIGURATIONS = {
        cronTime: '*/5 * * * *',
        onTick: telegramBot.botInit,
        runOnInit: true
    };
    
    cronJob.schedule(CRON_CONFIGURATIONS.cronTime, telegramBot.botInit, {runOnInit: true});
}

