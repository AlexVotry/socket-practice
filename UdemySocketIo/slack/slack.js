const express = require('express');
const app = express();
const socketio = require('socket.io');

app.use(express.static(__dirname + '/public'));
const expressServer = app.listen(9000, () => {
  console.log('chat listening on 9000')
})
const io = socketio(expressServer); // socketio is using the http server on 9000.
let namespaces = require('./data/namespacess');

io.on('connect', socket => {
  // build an array to send back with the img and endpoint for each namespace
  let nsData = namespaces.map(ns => {
    return {
      img: ns.img,
      endpoint: ns.endpoint
    }
  })
  // console.log('DATA:', nsData);
  // send the nsData back to the client. WE need to use socket, not io, because we want it to go to just his client.

  socket.emit('nsList', nsData);
});

// loop through each namespace and listen for a connection
namespaces.forEach((ns) => {
  const namespace = io.of(ns.endpoint);
  namespace.on('connect', nsSocket => {
    const username = nsSocket.handshake.query.username;
    nsSocket.emit('nsRoomLoad', ns.rooms);
    nsSocket.on('joinRoom', async roomToJoin => {
      const roomToLeave = Array.from(nsSocket.rooms)[1]; // old room.
      nsSocket.leave(roomToLeave);
      updateUsersInRoom(namespace, roomToLeave);
      
      nsSocket.join(roomToJoin);
      const thisRoom = ns.rooms.find(room => room.roomTitle === roomToJoin);
      nsSocket.emit('historyCache', thisRoom.history);
      updateUsersInRoom(namespace, roomToJoin);
    })
    
    nsSocket.on('newMessageToServer', message => {
      const fullMsg = {
        text: message.text,
        time: Date.now(),
        username,
        avatar: 'https://via.placeholder.com/30'
      }
      // send to all sockets that are in the same room.
      const roomTitle = Array.from(nsSocket.rooms)[1];
      const thisRoom = ns.rooms.find(room => room.roomTitle === roomTitle);
      if (roomTitle) {
        thisRoom.history.push(fullMsg);
        namespace.to(roomTitle).emit('messageToClients', fullMsg);
      }
    })
  })
})

async function updateUsersInRoom(namespace, roomToJoin) {
  const allSockets = await namespace.in(roomToJoin).allSockets();
  const clients = Array.from(allSockets);
  namespace.in(roomToJoin).emit('updateMembers', clients.length);
}