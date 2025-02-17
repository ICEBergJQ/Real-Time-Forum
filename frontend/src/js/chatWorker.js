let socket = null;
let clients = []; // To track all connected tabs

// Function to handle messages from main thread
onconnect = function (event) {
    const port = event.ports[0]; // Get the port to communicate with this tab

    // Add the port to the list of clients
    clients.push(port);

    // If it's the first tab, establish the WebSocket connection
    if (clients.length === 1) {
        socket = new WebSocket('ws://localhost:8080/ws'); // Use your server URL here

        // WebSocket open event
        socket.onopen = function () {
            console.log('WebSocket connected');
        };

        // WebSocket message event
        socket.onmessage = function (event) {
            const message = event.data;
            // Send the message to all clients (tabs)
            clients.forEach(client => client.postMessage(message));
        };

        // WebSocket error event
        socket.onerror = function (error) {
            console.error('WebSocket error:', error);
        };

        // WebSocket close event
        socket.onclose = function () {
            console.log('WebSocket connection closed');
        };
    }

    // Handle incoming messages from tabs
    port.onmessage = function (messageEvent) {
        const message = messageEvent.data;

        // If the message is a 'chat' message, send it to the server
        if (message.type === 'chat' && socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(message));
        }
    };

    // Clean up when a tab closes
    port.onclose = function () {
        const index = clients.indexOf(port);
        if (index > -1) {
            clients.splice(index, 1); // Remove the tab from the clients array
        }

        // If no tabs are open, close the WebSocket connection
        if (clients.length === 0 && socket) {
            socket.close();
            socket = null;
        }
    };
};