// Create the shared worker (make sure the path is correct)
const worker = new SharedWorker('chatWorker.js');

// When the worker is ready, communicate with it
worker.port.start();

// Handle incoming messages from the shared worker
worker.port.onmessage = function (event) {
    const message = event.data;
    console.log('Message from worker:', message);
    displayMessage(message); // Update the UI with the message
};

// Function to send messages to the shared worker (which will forward them to the WebSocket)
function sendMessage(messageContent) {
    const message = {
        type: 'chat', // Custom message type
        content: messageContent
    };

    worker.port.postMessage(message); // Send the message to the worker
}

// Event listener for sending messages
document.getElementById('sendButton').addEventListener('click', () => {
    const messageInput = document.getElementById('messageInput');
    const messageContent = messageInput.value;
    if (messageContent) {
        sendMessage(messageContent);
        messageInput.value = ''; // Clear the input field
    }
});

// Display message in the UI
function displayMessage(message) {
    const messageContainer = document.getElementById('messageContainer');
    const messageElement = document.createElement('div');
    messageElement.textContent = message.content; // Display message content
    messageContainer.appendChild(messageElement); // Append message to the container
}

// HTML for the chat UI (already explained in previous messages)
document.body.innerHTML = `
    <div id="messageContainer" style="max-height: 300px; overflow-y: scroll; border: 1px solid #ccc; padding: 10px;"></div>
    <input type="text" id="messageInput" placeholder="Type a message" style="width: 80%;" />
    <button id="sendButton">Send</button>
`;
