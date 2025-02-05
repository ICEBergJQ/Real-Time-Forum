export default function chat() {
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
    <style>
    .modal { position: fixed; bottom: 20px; right: 20px; width: 300px; background: white; border: 1px solid #ccc; border-radius: 8px; display: flex; flex-direction: column; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .hidden { display: none; }
    .chat-header { display: flex; justify-content: space-between; padding: 10px; background: #007bff; color: white; border-top-left-radius: 8px; border-top-right-radius: 8px; }
    .chat-messages { height: 200px; overflow-y: auto; padding: 10px; border-bottom: 1px solid #ccc; }
    .chat-input { display: flex; padding: 10px; }
    .chat-input input { flex: 1; padding: 5px; border: 1px solid #ccc; border-radius: 4px; }
    .chat-input button { margin-left: 5px; padding: 5px 10px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
    .message { background: #f1f1f1; padding: 5px; margin: 5px 0; border-radius: 4px; }
    </style>
`
}