var express = require('express'),
        port = process.env.PORT || 3000,
        app = express(),
        bodyParser = require('body-parser');

    var path = require('path');
    var server = require('http').Server(app);

module.exports = async function () {

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    app.set('views', path.join(__dirname, './views'));
    app.set('view engine', 'ejs');

    require('./routes/news')(app);

    let io = require('socket.io')(server);
    
    server.listen(port, () => {
        console.log('Server started on ' + port);
    });

    return io;
}