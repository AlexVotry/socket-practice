const express = require('express');
const app = express();
const socketio = require('socket.io');


app.use(express.static(__dirname + '/public'));

const expressServer = app.listen(9000, () => {
  console.log('chat listening on 9000')
})

const io = socketio(expressServer); // socketio is using the http server on 9000.

io.on('connect', socket => {
  socket.emit('messageFromServer', { data: 'Welome to the socketIo server' })
  socket.on('messageToServer', dataFromClient => {
    console.log(dataFromClient);
  });
  socket.join('level1');
  socket.to('level1').emit('joined', `${socket.id} says I have joined the level 1 room!`)

  socket.join('level2');
  io.of('/').to('level2').emit('joined', `${socket.id} says I have joined the level 2 room!`)
});

io.of('/admin').on('connect', socket => {
  socket.emit('adminMessage', { text: 'admin message from server'});
})