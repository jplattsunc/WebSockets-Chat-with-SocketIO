const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static('public'));

let users = {};

io.on('connection', (socket) => {
    socket.on('set nickname', (nickname) => {
        users[socket.id] = nickname;
        io.emit('user list', Object.values(users));
        socket.broadcast.emit('chat message', { user: 'System', msg: `${nickname} has joined the chat.` });
    });

    socket.on('chat message', (msg) => {
        socket.broadcast.emit('chat message', { user: users[socket.id], msg });
    });

    socket.on('typing', () => {
        socket.broadcast.emit('typing', users[socket.id]);
    });

    socket.on('stop typing', () => {
        socket.broadcast.emit('stop typing', users[socket.id]);
    });

    socket.on('disconnect', () => {
        socket.broadcast.emit('chat message', { user: 'System', msg: `${users[socket.id]} has left the chat.` });
        delete users[socket.id];
        io.emit('user list', Object.values(users));
    });
});

server.listen(3000, () => console.log('Server running on port 3000'));
