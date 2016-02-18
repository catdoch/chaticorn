var io = require('socket.io'),
    http = require('http'),
    express = require('express'),
    app = express(),
    server = http.createServer(app),
    port = process.env.PORT || 5000;

app.use('/bundled', express.static(__dirname + '/bundled'));
app.use('/javascript', express.static(__dirname + '/javascript'));
app.use('/css', express.static(__dirname + '/css'));
app.use(express.static(__dirname + "/public"));
app.use('/sounds', express.static(__dirname + "/sounds"));

var chat_room = io.listen(server);

var usernames = {};

server.listen(port);


chat_room.sockets.on('connection', function(socket) {

    socket.on('adduser', function(username, colour) {
        socket.username = username;
        socket.colour = colour;
        usernames[username] = username;

        socket.emit('updatechat', 'SERVER', 'Welcome to the chat room!');
        socket.broadcast.emit('updatechat', 'SERVER', username + ' has connected');
        chat_room.sockets.emit('updateusers', usernames);
    });

    socket.on('disconnect', function() {
        delete usernames[socket.username];
        chat_room.sockets.emit('updateusers', usernames);
        socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
    });

    socket.on('sendchat', function(data) {
        chat_room.sockets.emit('updatechat', socket.username, data, socket.colour);
    });
});