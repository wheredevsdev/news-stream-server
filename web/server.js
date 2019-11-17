const express = require('express'),
    socketServer = require('socket.io'),
    port = process.env.PORT || 3000,
    app = express(),
    bodyParser = require('body-parser'),
    path = require('path'),
    httpServer = require('http').Server(app);

global.SOCKET_CONNECTIONS = 0;

module.exports = async function () {

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    app.set('views', path.join(__dirname, './views'));
    app.set('view engine', 'ejs');

    require('./routes/news')(app);

    const io = new socketServer(httpServer);

    io.on('Connection', socket => {
        global.SOCKET_CONNECTIONS++;
        console.log(`Received connection from ${socket.handshake.address}. ID: ${socket.id}`);
        
        socket.on('disconnect', () => {
            --global.SOCKET_CONNECTIONS;
            console.log(`${socket.id} disconnected.`);
        });
    });

    httpServer.listen(port, () => {
        console.log('Server started on ' + port);
    });

    return io;
}