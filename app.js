const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const axios = require('axios');

const port = process.env.PORT || 4001;
const index = require('./routes/index');

// const app = express();
app.use(index);

// const server = http.createServer(app);

// const io = socketIo(server);
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const getApiAndEmit = async socket => {
  try {
    const res = await axios.get('https://jsonplaceholder.typicode.com/todos/1');
    socket.emit('FromAPI', res.data.title);
  } catch (error) {
    console.errror(`error: ${error.code}`);
  }
};

io.on("connection", socket => {
  console.log("New client connected"), setInterval(
    () => getApiAndEmit(socket),
    10000
  );
  socket.on("disconnect", () => console.log("Client disconnected"));
});

app.listen(port, () => console.log(`listening on port ${port}`));

