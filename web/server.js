const express = require('express'),
    socketServer = require('socket.io'),
    port = parseInt(process.env.PORT) || 8080,
    app = express(),
    bodyParser = require('body-parser'),
    cors = require("cors");

global.SOCKET_CONNECTIONS = 0;

module.exports = async function () {

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    
    app.use(cors());

    const io = new socketServer(9090);

    io.on('connection', socket => {
        global.SOCKET_CONNECTIONS++;
        console.log(`[SOCKET] Event: "Connection" | IP: "${socket.handshake.address}" | ID: "${socket.id}" |`);
        
        socket.on('disconnect', () => {
            --global.SOCKET_CONNECTIONS;
            console.log(`[SOCKET] Event: "Disconnection" | ID: "${socket.id}" |`);
        });
    });

    require('./routes/news')(app, io);

    app.listen(port, () => {
        console.log('Server started on ' + port);
    });

    return io;
}