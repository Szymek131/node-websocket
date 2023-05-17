const express = require('express');
const path = require('path');
const socket = require('socket.io');

const app = express();

const messages = [];
let users = [];

app.use(express.static(path.join(__dirname, '/client')));

app.get('/', (req, res) => {
  res.render('index.html');
});

app.use((req, res) => {
  res.status(404).send('404 not found...');
})

const server = app.listen(8000, () => {
  console.log('Server is running on port: 8000');
});

const io = socket(server);

io.on('connection', (socket) => {
  console.log('New client! Its id – ' + socket.id);
  console.log('I\'ve added a listener on message and disconnect events \n');
  socket.on('message', (message) => {
    console.log('Oh, I\'ve got something from ' + socket.id);
    messages.push(message);
    socket.broadcast.emit('message', message);
  });
  socket.on('disconnect', () => {
    console.log('Oh, socket ' + socket.id + ' has left')
    const missingUser = users.find(user => user.id === socket.id);
    console.log(missingUser);
    socket.broadcast.emit('message', { author: 'Chat Bot', content: missingUser.author + ' has left the conversation!' });
    users = users.filter(item => item.id !== socket.id);
  });
  socket.on('join', (userName) => {
    console.log('User ' + userName.author + ' joined the chat')
    users.push({ author: userName.author, id: socket.id });
    socket.broadcast.emit('message', { author: 'Chat Bot', content: userName.author + ' has joined the conversation!' });
  });
});