const socket = new WebSocket("ws://localhost:8080/ws");

socket.onopen = () => console.log("Connected to WebSocket");

socket.onmessage = (event) => {
  const msg = JSON.parse(event.data);
  displayMessage(msg.username, msg.content);
};

function sendMessage() {
  const input = document.getElementById("chat-input");
  const message = input.value.trim();
  if (message) {
    const msgObj = { username: "User1", content: message };
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

document.getElementById("send-btn").addEventListener("click", sendMessage);

document.getElementById("chat-input").addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});
