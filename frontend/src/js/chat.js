const userDivs = document.querySelectorAll('.chat-user');
const usersBox = document.querySelector(".chat-users");
const chatUsername = document.getElementById("chat-username");
const messagesBox = document.querySelector(".chat-messages");

if (logged == 1) {
  const socket = new WebSocket("ws://localhost:8080/ws");
  socket.onopen = () => console.log("Connected to WebSocket");
  
  
  socket.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.message != "") {
      moveToTop(msg.sender);
    }
    if (msg.sender === chatUsername.innerText.trim() && msg.message != "") {
      displayMessage(msg.sender, msg.message, msg.date ,true);
    } else if (msg.receiver === chatUsername.innerText.trim() && !msg.status){
      displayMessage(msg.sender, msg.message, msg.date);
    } else {
      if (msg.status === 'offline') {
        updateStatus(msg.sender,msg.status);
      } else {
        updateStatus(msg.sender,msg.status);
      }
    }
  };

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
}


function moveToTop(userId) {
  const userDiv = document.getElementById(userId);

  if (userDiv) {
    usersBox.prepend(userDiv);
  }
}

function updateStatus(user, status) {
  let u = document.getElementById(user);
  if (status === 'online' && u) {
    u.classList.add("online");
  } else if (status === 'offline' && u) {
    u.classList.remove("online");
  }
}


function displayMessage(username, content, date ,reciverFlag, historyFlag) {
  const msgContainer = document.createElement("div");
  const msgDiv = document.createElement("div");

  msgContainer.classList.add("message-container");
  msgDiv.classList.add("message");
  if (reciverFlag) {
    msgContainer.classList.add("receiver");
    msgDiv.classList.add("receiver");
  }
  msgDiv.innerHTML = `<strong>${username}:</strong> ${content}
  <h3>${date}</h3>`;

  msgContainer.appendChild(msgDiv);
  if (historyFlag) {
    messagesBox.insertBefore(msgContainer, messagesBox.firstChild)
  } else {
    messagesBox.appendChild(msgContainer);
  }
  messagesBox.scrollTop = messagesBox.scrollHeight;
}

function displayHistory(data, username) {
  data.forEach((e) => {
    if (username == e.sender) {
      displayMessage(e.sender, e.message, e.date, true,true);
    } else {
      displayMessage(e.sender, e.message, e.date, false, true);
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
      if (logged === '1') {
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
      if (logged === '1') {
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
            } 
            if (!data) {
              displayToast('var(--info)', `No Messages!`);
            }
        }).catch(err => { 
          if (err.toString().includes("data is null")) {
          displayToast('var(--info)', `No Messages!`);
        } else {
          displayToast('var(--red)', `Getting chat history: ${err}`);
        }
        }
      )
}
if (logged == 1) {
  fetchUsers();
  fetchStatus();
}

messagesBox.addEventListener("scroll", () => {
  if (messagesBox.scrollTop === 0) {
    fetchChatHistory(chatUsername.innerText)
  }
});

document.getElementById("send-btn").addEventListener("click", sendMessage);

document.getElementById("chat-input").addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});
