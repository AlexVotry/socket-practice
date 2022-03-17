const express = require('express');
const app = express();
const socketio = require('socket.io');


app.use(express.static(__dirname + '/public'));

const expressServer = app.listen(9000, () => {
  console.log('chat listening on 9000')
})

const io = socketio(expressServer); // socketio is using the http server on 9000.

io.on('connect', socket => {
  // console.log('rooms', socket.rooms);
  socket.emit('messageFromServer', { data: 'Welome to the socketIo server' })
  socket.on('messageToServer', dataFromClient => {
    // console.log(dataFromClient);
  });
  socket.on('newMessageToServer', newMessage => {
    console.log(newMessage.text);
    io.emit('messageToEveryone', { text: newMessage.text }) // socket is each individual client io is for everyone
  })
});

