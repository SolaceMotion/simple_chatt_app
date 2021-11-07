//Import modules
const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');

//Import Server class
const { Server } = require('socket.io');

//Use cors middleware
app.use(cors());

//Initialize Server
const server = http.createServer(app);

//Initialize socket.io on client port
const io = new Server(server, { cors: { origin: ['http://localhost:3000'] } });

//Upon server connection, emit a message to the client
//Callback gives access to the socket object
io.on('connection', socket => {
  //When a client connects, print id to console
  console.log('user ' + socket.id + ' connected');

  //Custom "message" event
  //"name" and "message" in callback is the data sent by the client
  socket.on('message', ({ name, message }) => {
    console.log(name, message);

    //Broadcast message to all connected clients by emitting 'message' event from server
    io.emit('message', { name, message });
  });

  //When client disconnects, print id to console
  socket.on('disconnect', () => {
    console.log('user ' + socket.id + ' disconnected');
  });
});

//Run server on port 4000
server.listen(4000, () => {
  console.log('listening on http://localhost:4000');
});
