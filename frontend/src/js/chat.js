const socket = new WebSocket("ws://localhost:8080/ws")
socket.addEventListener("message", (event) => {
    JSON.stringify(event.data)
})