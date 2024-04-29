const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: '*' }, methods: ['GET', 'POST']});

io.on('connection', (socket) => {
  console.log('New client connected');
  socket.on('disconnect', () => console.log('Client disconnected'));
  socket.on('join-document', (docID) => {
    console.log(`Joining document ${docID}`);
    socket.join(docID);
  });
});

server.listen(3000, () => console.log('Listening on port 3000'));