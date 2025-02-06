import chatComponent from "./chat.js";

const socket = new WebSocket("ws://localhost:8080/ws");
socket.addEventListener("message", (event) => {
    console.log("Message from server:", event.data);
});

document.addEventListener("DOMContentLoaded", () => {
    const chatContainer = document.querySelector("#chat_id");
    chatContainer.innerHTML = chatComponent();

    document.getElementById("open-chat").addEventListener("click", function () {
        document.getElementById("chat").classList.remove("hidden");
    });

    document.getElementById("close-chat").addEventListener("click", function () {
        document.getElementById("chat").classList.add("hidden");
    });
});