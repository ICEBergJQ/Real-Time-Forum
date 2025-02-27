const socket = new WebSocket("ws://localhost:8080/ws");
const userDivs = document.querySelectorAll('.chat-user');
const usersBox = document.querySelector(".chat-users");
const chatUsername = document.getElementById("chat-username");
const messagesBox = document.querySelector(".chat-messages");


socket.onopen = () => console.log("Connected to WebSocket");


socket.onmessage = (event) => {
  const msg = JSON.parse(event.data);
  if (msg.sender === chatUsername.innerText.trim() && msg.message != "") {
    displayMessage(msg.sender, msg.message,true);
  } else if (msg.receiver === chatUsername.innerText.trim() && !msg.status){
    displayMessage(msg.sender, msg.message);
  } else {
    if (msg.status === 'offline') {
      updateStatus(msg.sender,msg.status);
    } else {
      updateStatus(msg.sender,msg.status);
    }
  }
};

function updateStatus(user,status) {
  let u = document.getElementById(user);
  if (status === 'online' && u) {
    u.classList.add("online");
  } else if (status === 'offline' && u) {
    u.classList.remove("online");
  }
}

function sendMessage() {
  const input = document.getElementById("chat-input");
  const receiver = document.getElementById("chat-username").innerText;
  const message = input.value.trim();
  if (message) {
    const msgObj = { receiver: receiver , message: message };
    socket.send(JSON.stringify(msgObj));
    input.value = "";
  }
}

function displayMessage(username, content,reciverFlag, historyFlag) {
  const msgContainer = document.createElement("div");
  const msgDiv = document.createElement("div");
  const name = document.createElement('h1')
  msgContainer.classList.add("message-container");
  msgDiv.classList.add("message");
  if (reciverFlag){
    msgContainer.classList.add("receiver");
    msgDiv.classList.add("receiver");
  }

  msgDiv.innerHTML = `${content}`;
  msgContainer.appendChild(msgDiv);
  if (historyFlag) {
    messagesBox.insertBefore(msgContainer, messagesBox.firstChild)
  } else {
    messagesBox.appendChild(msgContainer);
  }
  messagesBox.scrollTop = messagesBox.scrollHeight;
}

function displayHistory(data, username) {
  data.forEach((e)=>{
    if (username == e.sender) {
      displayMessage(e.sender, e.message, true,true);
    } else {
      displayMessage(e.sender, e.message,false, true);
    }
  })
}

function displayUsers(data) {
  data.forEach(e => {
    const userdiv = document.createElement("div");
    userdiv.classList.add("chat-user");
    userdiv.id = e.username
    userdiv.innerHTML = `${e.username} <div class="status" ><i class="fa fa-circle" aria-hidden="true"></i></div>`;
    usersBox.appendChild(userdiv);
  });
  console.log(data)
}

function insertStatus(data) {
  data.forEach(e => {
    let u = document.getElementById(e.username)
    if (u) {
      u.classList.add("online")
    }
  });
}

function fetchStatus() {
  let url = '/users/online';
  
  fetch(url)
  .then(res => {
    if (!res.ok) {
      throw new Error("something went wrong, please try again")
    }
    return res.json()
  })
  .then(data => {
          if (logged === '1'){
              checkIfLoggedout(data.Message)
            } else {
              toggleloginPage();
              return;
            }
          if (data && data.length > 0) { 
              insertStatus(data);
          }
      }).catch(err => displayToast('var(--red)', `get status : ${err}`))
}

function fetchUsers() {
    let url = '/users';

    fetch(url)
        .then(res => {
            if (!res.ok) {
                throw new Error("something went wrong, please try again")
            }
            return res.json()
          })
          .then(data => {
            if (logged === '1'){
                checkIfLoggedout(data.Message)
            } else {
                toggleloginPage();
                return;
            }
            if (data && data.length > 0) { 
                displayUsers(data);
            }
        }).catch(err => displayToast('var(--red)', `get users : ${err}`))
}

function fetchChatHistory(user) {
  let url = '/chat-history';

    const oldScrollHeight = messagesBox.scrollHeight;
    const oldScrollTop = messagesBox.scrollTop;

    fetch(url,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ receiver: user , offset : window.offset })
        })
        .then(res => {
            if (!res.ok) {
                throw new Error("something went wrong, please try again")
            }
            return res.json()
        })
        .then(data => {
            if (logged === '1'){
              if (data.Message) {
                checkIfLoggedout(data.Message)
              }
            } else {
                toggleloginPage();
                return;
            }
            if (data && data.length > 0) {
              window.offset += data.length; 
              console.log(window.offset); 
                displayHistory(data,user);
                messagesBox.scrollTop = messagesBox.scrollHeight - oldScrollHeight + oldScrollTop;
            } else {
              displayToast('var(--info)', `No Messages!`);
            }
        }).catch(err => displayToast('var(--red)', `getting chat history : ${err}`))
}

fetchUsers();
fetchStatus();

messagesBox.addEventListener("scroll", () => {
  if (messagesBox.scrollTop === 0) {
    fetchChatHistory(chatUsername.innerText)
  }
});

document.getElementById("send-btn").addEventListener("click", sendMessage);

document.getElementById("chat-input").addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});
