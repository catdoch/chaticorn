var io = require('socket.io'),
    connect = require('connect');

// var port = process.env.PORT || 8080;

var app = connect().use(connect.static('public')).listen(process.env.PORT || 3000);

var chat_room = io.listen(app);
var usernames = {};


chat_room.sockets.on('connection', function(socket) {

    socket.on('adduser', function(username) {
        socket.username = username;
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
        chat_room.sockets.emit('updatechat', socket.username, data);
    });
});
