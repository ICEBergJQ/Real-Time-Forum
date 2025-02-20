// export default function chatComponent() {
const socket = new WebSocket("ws://localhost:8080/ws");
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
                userDiv.onclick = () => startChat(users[i].username);
            }
        }).catch(err => displayToast('var(--red)', `get users : ${err}`));
}

// userSearchInput.addEventListener('input', (event) => {
//     const query = event.target.value.toLowerCase();
//     const filteredUsers = users.filter(user => user.username.toLowerCase().includes(query));
//     renderUsers(filteredUsers);
// });

function startChat(user) {
    chatUsername.textContent = `Chat with ${user}`;
    chatBox.style.display = 'block';
    const message = document.querySelector(".chat-input")
    message.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            sendMessage(user)
        }
    })
    // , sendMessage(users[i].username
}

function toggleChat() {
    chatSection.style.display = chatSection.style.display === 'none' ? 'block' : 'none';
    renderUsers();
}

function closeChat() {
    chatBox.style.display = 'none';
}

socket.addEventListener("error", (error) => {
    console.log(`WebSocket Error: ${error}`);
});

socket.addEventListener("open", () => {
    console.log("WebSocket connection established.");
});

if (socket) {
    socket.onmessage = (event) => {
        displayToast('var(--green)', 'message added succesfully!!')
        console.log(event.data);
    };

}


function sendMessage(user) {
    let message = document.querySelector(".chat-input").value
    socket.send(JSON.stringify({
        receiver: user,
        message: message
    }))
    console.log(user, message);
    message.value = '';
}

renderUsers();
// }