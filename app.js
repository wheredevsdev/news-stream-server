require('dotenv').config();
var express = require('express'),
    mongoose = require('mongoose'),
    port = process.env.PORT || 3000,
    models = require('./API/Models/NewsModel');
    app = express(),
    bodyParser = require('body-parser');

const TelegramBot = require('node-telegram-bot-api');

var routeVals = require('./API/Routes/NewsRoutes');
var path = require('path');

var Conn = process.env.DB;
var token = process.env.TOKEN;

mongoose.Promise = global.Promise;
mongoose.connect(Conn, { useNewUrlParser: true });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('views', path.join(__dirname, './API/Views'));
app.set('view engine', 'ejs');

routeVals(app);

app.listen(port);
console.log('Server started on ' + port);

const bot = new TelegramBot(token, {

    polling: true

});

var newsModelX = mongoose.model('newsy');


bot.onText(/\/review/, (msg, match) => {

    const chatId = msg.chat.id;

    newsModelX.find({ content: "SomeContentX" }).exec((err, news) => {
        news.forEach((news) => {
            console.log(news._id);
            bot.sendMessage(
                    chatId,
                    'Review ' + news.title+ '?',
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
});

bot.on('callback_query', (callbackQuery) => {

    const message = callbackQuery.message;
    const callback = callbackQuery.data;

    bot.sendMessage(message.chat.id, `Article has been "${callback}"`);

});