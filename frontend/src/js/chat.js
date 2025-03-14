const userDivs = document.querySelectorAll(".chat-user");
const usersBox = document.querySelector(".chat-users");
const chatUsername = document.getElementById("chat-username");
const messagesBox = document.querySelector(".chat-messages");
const typing = document.querySelector(".typing");

if (logged == 1) {
  let socket = new WebSocket("ws://localhost:8080/ws");
  function connectWebSocket() {
    socket = new WebSocket("ws://localhost:8080/ws");

    socket.onopen = () => console.log("Connected to WebSocket");

    socket.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.message !== "") {
        moveToTop(msg.receiver);
        moveToTop(msg.sender);
      }
      if (msg.Message) {
        checkIfLoggedout(msg.Message);
        return;
      }

      if (
        msg.type == "typing" &&
        msg.sender === chatUsername.innerText.trim()
      ) {
        displayTyping("display");
        clearTimeout(typingTimeout);

        typingTimeout = setTimeout(() => {
          displayTyping("hide");
        }, 3500);
      } else if (
        msg.type == "stopped-typing" &&
        msg.sender === chatUsername.innerText.trim()
      ) {
        displayTyping("hide");
      } else if (
        msg.sender === chatUsername.innerText.trim() &&
        msg.message !== ""
      ) {
        displayMessage(msg.sender, msg.message, msg.date, true);
        window.offset++
      } else if (
        msg.receiver === chatUsername.innerText.trim() &&
        !msg.status &&
        !msg.type
      ) {
        displayMessage(msg.sender, msg.message, msg.date);
        window.offset++
      } else {
        if (msg.message !== "") {
          let userDiv = document.getElementById(msg.sender);
          if (userDiv) {
            let readIcon = userDiv.querySelector("#read");
            if (readIcon) {
              readIcon.innerHTML =
                '<i class="fa fa-envelope-o" aria-hidden="true"></i>';
            }
          }
          displayToast("var(--info)", `new message from ${msg.sender}`);
        }
      }
      if (msg.status) {
        updateStatus(msg.sender, msg.status);
      }
    };
  }

  connectWebSocket();

  socket.onclose = () => {
    console.log("WebSocket closed. Reconnecting...");
    setTimeout(connectWebSocket, 2000);
  };

  socket.onerror = (error) => {
    console.error("WebSocket Error:", error);
    socket.close();
  };

  let typingTimeout;
  let lastTypingTime = 0;

  input.addEventListener("input", () => {
    const now = Date.now(); // Get current timestamp

    if (now - lastTypingTime >= 2000) {
      sendTyping("typing");
      lastTypingTime = now;
    }

    clearTimeout(typingTimeout);

    typingTimeout = setTimeout(() => {
      if (socket.readyState === WebSocket.OPEN) {
        sendTyping("stopped-typing");
      }
    }, 3000);
  });

  function sendTyping(type) {
    const receiver = chatUsername.innerText.trim();
    let msgObj;

    if (type) {
      msgObj = { receiver: receiver, type: type };
    }

    if (msgObj) {
      socket.send(JSON.stringify(msgObj));
    }
  }

  function sendMessage() {
    const input = document.getElementById("chat-input");
    const receiver = chatUsername.innerText.trim();
    const message = input.value.trim();
    let msgObj;

    if (message) {
      if (message.length > 400) {
        displayToast("var(--red)", 'message too long')
        return
      }
      msgObj = { receiver: receiver, message: message };
      input.value = "";
    }
    if (msgObj) {
      socket.send(JSON.stringify(msgObj));
    }
  }
}

function moveToTop(userId) {
  const userDiv = document.getElementById(userId);

  if (userDiv) {
    usersBox.prepend(userDiv);
  }
}

function updateStatus(user, status) {
  let u = document.getElementById(user);
  if (status === "online" && u) {
    u.classList.add("online");
  } else if (status === "offline" && u) {
    u.classList.remove("online");
  }
}

function displayMessage(username, content, date, reciverFlag, historyFlag) {
  const msgContainer = document.createElement("div");
  const msgDiv = document.createElement("div");

  msgContainer.classList.add("message-container");
  msgDiv.classList.add("message");
  if (reciverFlag) {
    msgContainer.classList.add("receiver");
    msgDiv.classList.add("receiver");
  }
  msgDiv.innerHTML = `<strong></strong> <span></span> <h3></h3>`;

  msgDiv.querySelector("strong").textContent = username + ":";
  msgDiv.querySelector("span").textContent = content;
  msgDiv.querySelector("h3").textContent = date;
  

  msgContainer.appendChild(msgDiv);
  if (historyFlag) {
    messagesBox.insertBefore(msgContainer, messagesBox.firstChild);
  } else {
    messagesBox.appendChild(msgContainer);
  }
  messagesBox.scrollTop = messagesBox.scrollHeight;
}

function displayHistory(data, username) {
  data.forEach((e) => {
    if (username == e.sender) {
      displayMessage(e.sender, e.message, e.date, true, true);
    } else {
      displayMessage(e.sender, e.message, e.date, false, true);
    }
  });
}

function displayUsers(data) {
  data.forEach((e) => {
    const read = document.createElement("div");
    const userdiv = document.createElement("div");
    read.id = "read";
    read.innerHTML = '<i class="fa fa-envelope-open-o" aria-hidden="true"></i>';
    userdiv.classList.add("chat-user");
    userdiv.id = e.username;
    userdiv.appendChild(read);
    userdiv.innerHTML += `${e.username} <div class="status" ><i class="fa fa-circle" aria-hidden="true"></i></div>`;
    usersBox.appendChild(userdiv);
  });
}

function insertStatus(data) {
  if (!Array.isArray(data)) return;

  data.forEach((e) => {
    if (!e.username) return;
    let u = document.getElementById(e.username);
    if (u) {
      u.classList.add("online");
    }
  });
}

function fetchStatus() {
  let url = "/users/online";

  fetch(url)
    .then((res) => {
      if (!res.ok) {
        displayToast("var(--red)", `Error getting status... try again later`);
      }
      return res.json();
    })
    .then((data) => {
      if (logged === "1") {
        if (data && data.Message) {
          checkIfLoggedout(data.Message);
        }
      } else {
        toggleloginPage();
        return;
      }

      if (Array.isArray(data) && data.length > 0) {
        insertStatus(data);
      }
    })
    .catch((err) => {
      displayToast("var(--red)", `Error getting status... try again later`);
    });
}

function fetchUsers() {
  let url = "/users";

  fetch(url)
    .then((res) => {
      if (!res.ok) {
        throw new Error("something went wrong, please try again");
      }
      return res.json();
    })
    .then((data) => {
      if (logged === "1") {
        checkIfLoggedout(data.Message);
      } else {
        toggleloginPage();
        return;
      }
      if (data && data.length > 0) {
        displayUsers(data);
      }
    })
    .catch((err) => displayToast("var(--red)", `get users : ${err}`));
}

function fetchChatHistory(user) {
  let url = "/chat-history";

  const oldScrollHeight = messagesBox.scrollHeight;
  const oldScrollTop = messagesBox.scrollTop;

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ receiver: user, offset: window.offset }),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("something went wrong, please try again");
      }
      return res.json();
    })
    .then((data) => {
      if (logged === "1") {
        if (data.Message) {
          checkIfLoggedout(data.Message);
        }
      } else {
        toggleloginPage();
        return;
      }
      if (data && data.length > 0) {
        window.offset += data.length;
        displayHistory(data, user);
        messagesBox.scrollTop =
          messagesBox.scrollHeight - oldScrollHeight + oldScrollTop;
      }
      if (!data) {
        displayToast("var(--info)", `No Messages!`);
      }
    })
    .catch((err) => {
      if (err.toString().includes("null")) {
        displayToast("var(--info)", `No Messages!`);
      } else {
        displayToast("var(--red)", `Getting chat history... try again later`);
      }
    });
}
if (logged == 1) {
  fetchUsers();
  document.addEventListener("DOMContentLoaded", () => {
    fetchStatus();
  });

  function throttle(func, limit) {
    let lastCall = 0;
    return function (...args) {
      const now = Date.now();
      if (now - lastCall >= limit) {
        lastCall = now;
        func(...args);
      } else {
        displayToast("var(--info)", `please be patient`);
      }
    };
  }

  const throttledFetchChatHistory = throttle(() => {
    fetchChatHistory(chatUsername.innerText);
  }, 2000);

  messagesBox.addEventListener("scroll", () => {
    if (messagesBox.scrollTop === 0) {
      throttledFetchChatHistory();
    }
  });

  document.getElementById("send-btn").addEventListener("click", sendMessage);

  document.getElementById("chat-input").addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });
}

function displayTyping(display) {
  if (display === "display") {
    typing.classList.add("active");
  } else {
    typing.classList.remove("active");
  }
}
