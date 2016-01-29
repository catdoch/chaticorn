// var io = require('socket.io'),
//     connect = require('connect');


var WebSocketServer = require("ws").Server;
var http = require("http");
var express = require("express");
var app = express();
var port = process.env.PORT || 5000;
var usernames = {};

app.use(express.static(__dirname + "/public"));

var server = http.createServer(app);
server.listen(port);

console.log("http server listening on %d", port);

var wss = new WebSocketServer({
    server: server
});

wss.on('connection', function(socket) {

    socket.on('adduser', function(username) {
        socket.username = username;
        usernames[username] = username;

        socket.emit('updatechat', 'SERVER', 'Welcome to the chat room!');
        socket.broadcast.emit('updatechat', 'SERVER', username + ' has connected');
        wss.emit('updateusers', usernames);
    });

    socket.on('disconnect', function() {
        delete usernames[socket.username];
        wss.emit('updateusers', usernames);
        socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
    });

    socket.on('sendchat', function(data) {
        wss.emit('updatechat', socket.username, data);
    });
});
