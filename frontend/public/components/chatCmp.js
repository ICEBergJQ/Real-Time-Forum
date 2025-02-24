// export default function chatComponent() {

const users = [];
const chatSection = document.getElementById('chat');
const chatToggleButton = document.getElementById('chat-toggle');
const userSearchInput = document.getElementById('userSearch');
const chatUsersDiv = document.getElementById('chat-users');
const chatBox = document.getElementById('chat-box');
const chatMessagesDiv = document.getElementById('chat-messages');
const chatUsername = document.getElementById('chat-username');

function renderUsers(filteredUsers = users) {
    chatUsersDiv.innerHTML = '';
    fetch("/users").then(users => {
        if (!users.ok) {
            throw new Error("Response NOT 200 !!!!!");
        }
        return users.json();
    })
        .then(data => {
            if (logged !== '1') {
                alert("Need to log in !!!");
            }
            users.push(...data);
            for (let i = 0; i < users.length; i++) {
                const userDiv = document.createElement('div');
                userDiv.classList.add('chat-user');
                userDiv.textContent = users[i].username;
                chatUsersDiv.appendChild(userDiv);
                userDiv.onclick = () => startChat(users[i].username, Chathistory(offset = 0, users[i].username));
            }
        }).catch(err => displayToast('var(--red)', `get users : ${err}`));
}

function startChat(user) {
    chatUsername.textContent = `Chat with ${user}`;
    chatBox.style.display = 'block';
    const message = document.querySelector(".chat-input")
    message.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            sendMessage(user)
            message.value = ''
        }
    })
}

function toggleChat() {
    chatSection.style.display = chatSection.style.display === 'none' ? 'block' : 'none';
    // renderUsers();
}

function closeChat() {
    chatBox.style.display = 'none';
}

if (logged === "1") {
    const socket = new WebSocket("ws://localhost:8080/ws");

    socket.addEventListener("error", (error) => {
        console.log(`WebSocket Error: ${error}`);
    });

    socket.addEventListener("open", () => {
        console.log("WebSocket connection established.");
        OnlineUsers();
        renderUsers();
    });

    if (socket) {
        socket.onmessage = (event) => {
            displayToast('var(--green)', 'message added succesfully!!')
            console.log('sssssssssss', event.data);
        };

    }

    function sendMessage(user) {
        let message = document.querySelector(".chat-input").value
        socket.send(JSON.stringify({
            receiver: user,
            message: message
        }))
        // console.log(user, message);
        message.value = '';
    }
}

async function Chathistory(offset, user) {
    await fetch("/chat-history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            receiver: user,
            offset: offset
        })
    }).then(messages => {
        if (!messages.ok) {
            displayToast('var(--red)', `Response Not 200 !!!`)
        }
        return messages.json()
    }).then(data => {
        console.log(data);
        displayToast('var(--green)', 'chat added succesfully!!')
    }).catch(err => displayToast('var(--red)', `get messages : ${err}`));

}

function OnlineUsers() {
    let users = [];
    fetch("/users/online").then(onlineUsers => {
        if (!onlineUsers.ok) {
            throw new Error("Response NOT 200 !!!!!");
        }
        return onlineUsers.json()
    }).then(data => {
        if (logged !== '1') {
            alert("Need to log in !!!");
        }
        users.push(...data)
        console.log('aaa', users);

    }).catch(err => displayToast('var(--red)', `get OnlineUsers : ${err}`));
}


// if (logged === '1') {
// renderUsers();
// OnlineUsers()
// }
