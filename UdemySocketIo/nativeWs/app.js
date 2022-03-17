const http = require('http');
const websocket = require('ws');
const PORT = 8000;


const server = http.createServer((req, res) => {
  res.end('I am connected!')
});

 // https://github.com/websockets/ws/blob/master/doc/ws.md
// if http traffic occurs on this server, create a websocket
//  'HTTP/1.1 101 Switching Protocols', this means shows up on http, and switches to ws.
const wss = new websocket.Server({ server });
wss.on('headers', (msg, req) => {
  console.log(msg);
});

wss.on('connection', (ws, req) => {
  ws.on('message', msg => {
    console.log('message:', msg);
  })
  ws.send('welcome');
});

server.listen(PORT, () => {
  console.log(`listening on port ${PORT}`)
});