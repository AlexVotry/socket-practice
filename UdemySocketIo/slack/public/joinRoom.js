function joinRoom(roomName) {
// Semd this roomName to the server
  nsSocket.emit('joinRoom', roomName);
  
  nsSocket.on('updateMembers', numOfUsers => {
    // we want to update the room member total now that we have joined.
    document.querySelector('.curr-room-num-users').innerHTML = `${numOfUsers}  <span class="glyphicon glyphicon-user"></span>`
    document.querySelector('.curr-room-text').innerText = roomName || 'ChatRoom';
  })

  nsSocket.on('historyCache', history => {
    console.log('history',history) 
    let messageUl = document.querySelector('#messages');
    messageUl.innerHTML = '';
    history.forEach(msg => {
      const newMesg = buildHTML(msg);
      let currentMessages = messageUl.innerHTML;
      messageUl.innerHTML = currentMessages += newMesg;
    })
    messageUl.scrollTo(0,messageUl.scrollHeight); // scrolls to bottom of messages.
  })

  let searchBox = document.querySelector('#search-box');
  searchBox.addEventListener('input', e => {
    let searchItem = e.target.value.toLowerCase();
    let messages = Array.from(document.getElementsByClassName('message-text'));
    messages.forEach(msg => {
      const message = msg.innerText.toLowerCase();
      msg.style.display = message.indexOf(searchItem) === -1 ? "none" : "block";
    })
  })

}