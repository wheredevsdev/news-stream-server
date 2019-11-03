module.exports = async function () {
    require('dotenv').config();
    var express = require('express'),
        port = process.env.PORT || 3000,
        app = express(),
        bodyParser = require('body-parser');

    var path = require('path');

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    app.set('views', path.join(__dirname, './API/views'));
    app.set('view engine', 'ejs');

    require('./routes/news')(app);

    app.listen(port, () => {
        console.log('Server started on ' + port);
    });
}