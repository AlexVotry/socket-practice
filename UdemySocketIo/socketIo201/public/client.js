const socket = io('http://localhost:9000');
const socketAdmin = io('http://localhost:9000/admin');

socket.on('messageFromServer', dataFromServer => {
  console.log(dataFromServer.data);
  socket.emit('messageToServer', {data: 'This is from the client'})
});

socketAdmin.on('adminMessage', message => {
  console.log('admin:', message);
})

socket.on('joined', msg => {
  console.log(msg);
})

document.querySelector('#message-form').addEventListener('submit', event => {
  event.preventDefault();
  const newMessage = document.querySelector('#user-message').value;
  socket.emit('newMessageToServer', {text: newMessage});
})

// socket.on('messageToEveryone', newMessage => {
//   document.querySelector('#messages').innerHTML += `<li>${newMessage.text}</li`;
//   console.log('return message', newMessage);
// })
