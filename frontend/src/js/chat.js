const socket = new WebSocket("ws://localhost:8080/ws");

const userDivs = document.querySelectorAll('.chat-user');
const usersBox = document.querySelector(".chat-users");


socket.onopen = () => console.log("Connected to WebSocket");

socket.onmessage = (event) => {
  const msg = JSON.parse(event.data);
  displayMessage(msg.sender, msg.message);
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

function displayMessage(username, content) {
  const chatBox = document.querySelector(".chat-messages");
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("message");
  msgDiv.innerHTML = `<strong>${username}:</strong> ${content}`;
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function displayUsers(data) {
  const userdiv = document.createElement("div");
  data.forEach(e => {
    userdiv.classList.add("chat-user");
    userdiv.id = e.username
    userdiv.innerHTML = `${e.username} <div class="status" ><i class="fa fa-circle" aria-hidden="true"></i></div>`;
    usersBox.appendChild(userdiv);
  });
}

function updateStatus(data) {
  userDivs.forEach((user)=> {
    user.classList.remove("online");
  })
  data.forEach(e => {
    document.getElementById(e.username).classList.add("online")
  });
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
                console.log(data);  
                displayUsers(data);
                
            }
        }).catch(err => displayToast('var(--red)', `get users : ${err}`))
}

function fetchChatHistory(user) {
  let url = '/chat-history';

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
                console.log(data);  
                displayUsers(data);
                
            }
        }).catch(err => displayToast('var(--red)', `getting chat history : ${err}`))
}

fetchUsers();

document.getElementById("send-btn").addEventListener("click", sendMessage);

document.getElementById("chat-input").addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});
