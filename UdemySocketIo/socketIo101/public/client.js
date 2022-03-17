const socket = io('http://localhost:9000');

socket.on('messageFromServer', dataFromServer => {
  console.log(dataFromServer.data);
  console.log(socket.id); // room or namespace
  socket.emit('messageToServer', {data: 'This is from the client'})
});

document.querySelector('#message-form').addEventListener('submit', event => {
  event.preventDefault();
  const newMessage = document.querySelector('#user-message').value;
  socket.emit('newMessageToServer', {text: newMessage});
})

socket.on('messageToEveryone', newMessage => {
  document.querySelector('#messages').innerHTML += `<li>${newMessage.text}</li`;
  console.log('return message', newMessage);
})
