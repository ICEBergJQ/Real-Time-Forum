import chatComponent from "../../public/components/chatCmp.js";
// import chatComponent from '../../public/components/postFormCmp.js'

document.body.insertAdjacentHTML("beforeend", chatComponent());

let socket;

async function connectWebSocket() {
    const userID = await fetchUserID();
    if (!userID) return;

    socket = new WebSocket(`ws://localhost:8080/ws?id=${userID}`);
     // Send messages
     sendMessageBtn.addEventListener("click", () => {
        const message = messageInput.value;
        if (message.trim() !== "") {
            socket.send(message);
            messageInput.value = "";
        }
    });

    socket.onmessage = function(event) {
        const message = JSON.parse(event.data);
        console.log("Received message:", message);
        // Display message if it's meant for this user
        if (message.receiverID === userID) {
            displayMessage(message);
        }
    };
}

connectWebSocket();


document.addEventListener("DOMContentLoaded", () => {
    // Insert the chat component into the page
    document.getElementById("chat_id").innerHTML = chatComponent();

    const chatModal = document.getElementById("chat");
    const openChatBtn = document.getElementById("open-chat");
    const closeChatBtn = document.getElementById("close-chat");
    const sendMessageBtn = document.getElementById("send-message");
    const messageInput = document.getElementById("chat-input");
    const chatMessages = document.getElementById("chat-messages");

    // WebSocket connection to server
    // const socket = new WebSocket("ws://localhost:8080/ws");

    // Open chat
    openChatBtn.addEventListener("click", () => {
        chatModal.classList.remove("hidden");
    });

    // Close chat
    closeChatBtn.addEventListener("click", () => {
        chatModal.classList.add("hidden");
    });

    // Receive messages
    // socket.onmessage = function (event) {
    //     const newMessage = document.createElement("div");
    //     newMessage.classList.add("message");
    //     newMessage.textContent = event.data;
    //     chatMessages.appendChild(newMessage);
    // };

   
});

async function fetchUserID() {
    try {
        const response = await fetch("/api/user_id");
        if (!response.ok) throw new Error("Failed to fetch user ID");
        const data = await response.json();
        localStorage.setItem("userID", data.user_id); // Store user ID
        return data.user_id;
    } catch (error) {
        console.error("Error fetching user ID:", error);
        return null;
    }
}

// Call it on page load
fetchUserID();


/// send username and message to backend 