// we need http because we aren't using express. (to compare with nativeWs)
const http = require('http');
const socketio = require('socket.io');

// make http server with node
const server = http.createServer((req, res) => {
  res.end('I am connected');
});

const io = socketio(server);
io.on('connection', (socket) => {
  // ws.sent becomes socket.emit() add an (event, message)
  socket.emit('welcome', 'Welcome to the socke IO')
  // same as ws, except 'message' can be called anything.
  socket.on('message', msg => {
    console.log(msg);
  })
})

server.listen(8000, () => {
  console.log('listening on port 8000...')
}); 

