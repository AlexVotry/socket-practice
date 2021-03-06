function joinNs(endpoint) {
  if (nsSocket) {
    nsSocket.close();
    document.querySelector('#user-input').removeEventListener('#submit', formSubmission);
  }

  nsSocket = io(`http://localhost:9000/${endpoint}`);
  let chosenRoom;

  nsSocket.on('nsRoomLoad', nsRooms => {
    let roomList = document.querySelector('.room-list');
    roomList.innerHTML = "";
    nsRooms.forEach(room => {
      let glyph = room.privateRoom ? "lock" : "globe";
      roomList.innerHTML += `<li class="room"><span class="glyphicon glyphicon-${glyph}"></span>${room.roomTitle}</li>`
    })
    // add click listener to each room:
    let roomNodes = document.getElementsByClassName('room');
    Array.from(roomNodes).forEach(elem => {
      elem.addEventListener('click', e => {
        chosenRoom = e.target.innerText;
        joinRoom(chosenRoom);
      })
    })
  })
  
  nsSocket.on('messageToClients', newMessage => {
    document.querySelector('#messages').innerHTML += buildHTML(newMessage);
  })
  
  document.querySelector('#message-form').addEventListener('submit', formSubmission);
}

function formSubmission(event) {
  event.preventDefault();
  const newMessage = document.querySelector('#user-message').value;
  nsSocket.emit('newMessageToServer', { text: newMessage });
}

function buildHTML (msg) {
  const convertedDate = new Date(msg.time).toLocaleString();
 return `
    <li>
      <div class="user-image">
        <img src="${msg.avatar}" />
      </div>
      <div class="user-message">
        <div class="user-name-time">${msg.username}<span>${convertedDate}</span></div>
        <div class="message-text">${msg.text}</div>
      </div>
    </li>
  `
}