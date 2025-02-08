export default function chatComponent() {
    return `
    <div id="chat" class="modal hidden">
        <div class="chat-header">
            <span>Chat</span>
            <button id="close-chat">&times;</button>
        </div>
        <div id="chat-messages" class="chat-messages"></div>
        <div class="chat-input">
            <input type="text" id="chat-input" placeholder="Type a message...">
            <button id="send-message">Send</button>
        </div>
    </div>
    <button id="open-chat">Open Chat</button>
    `;
}