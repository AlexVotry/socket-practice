// https://developer.mozilla.org/en-US/docs/Web/API/WebSocket

let ws = new WebSocket('ws://localhost:8000');  // needs a url to connect to (node server);

ws.onopen = event => {
  ws.send('message sent to server');
}

ws.onmessage = event => {
  console.log(event);
}

