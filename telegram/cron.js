const cronJob = require('node-cron');
const telegramBot = require('./bot');

module.exports = async function () {

    const CRON_CONFIGURATIONS = {
        cronTime: '*/5 * * * *',
        onTick: telegramBot.botInit,
        runOnInit: true
    };
    
    cronJob.schedule(CRON_CONFIGURATIONS.cronTime, telegramBot.botInit, {runOnInit: true});
}   

