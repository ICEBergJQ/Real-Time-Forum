const chatMessages = document.querySelector(".chat-messages");
const usersContainer = document.querySelector(".chat-users");
const chatBox = document.getElementById("chat-box");
const closeChatBtn = document.querySelector(".close-chat");
const chatSection = document.getElementById("chat");
const feed = document.getElementById("feed");
const menu = document.getElementById("hiddenMenu");
const menuButton = document.querySelector(".menu");
const overlay = document.querySelector(".overlay");
const filter = document.querySelector(".filter-menu");
const filterbtn = document.querySelectorAll(".sbtf");

document.querySelectorAll(".dropdown > ul").forEach((menu) => {
  menu.style.display = "none";
});

// Add click event listeners to toggle dropdown menus
document.querySelectorAll(".dropdown > a").forEach((item) => {
  item.addEventListener("click", function (e) {
    e.preventDefault(); // Prevent default link behavior

    const dropdownMenu = this.nextElementSibling; // Get the sibling <ul>
    const isVisible = dropdownMenu.style.display === "block";

    // Hide all dropdown menus
    document.querySelectorAll(".dropdown > ul").forEach((menu) => {
      menu.style.display = "none";
    });

    // Toggle the clicked dropdown menu
    dropdownMenu.style.display = isVisible ? "none" : "block";
  });
});

function toggleMenu() {
  menu.classList.toggle("active");
  menuButton.classList.toggle("active");
  overlay.classList.toggle("active");
  menu.querySelectorAll('input[name="categories"]').forEach((radio) => {
    radio.checked = false;
  });
  if (chatSection.style.display != "none") {
    closeChat();
    chatSection.classList.add("hidden");
    feed.classList.remove("hidden");
  }
}

filterbtn.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    closeMenu();
  });
});

function closeMenu() {
  menu.classList.remove("active");
  overlay.classList.remove("active");
  menuButton.classList.remove("active");
  menu.querySelectorAll('input[name="categories"]').forEach((radio) => {
    radio.checked = false;
  });
}

function toggleCategories() {
  let arrow = document.getElementById("arrow");
  arrow.classList.toggle("active");
}

// Add click event listener to the window to hide dropdowns
window.addEventListener("click", function (e) {
  // Check if the clicked element is not inside a dropdown
  if (!e.target.closest(".dropdown")) {
    document.querySelectorAll(".dropdown > ul").forEach((menu) => {
      menu.style.display = "none";
    });
  }
});

function showCreatePostModal() {
  popupOverlay.classList.remove("hidden");
}

function openChat(user) {
  chatUsername.textContent = user.textContent;
  chatBox.style.display = "flex";
}

function toggleChat() {
  chatSection.classList.toggle("hidden");
  feed.classList.toggle("hidden");
  menu.classList.remove("active");
  menuButton.classList.remove("active");
  closeChat();
}
window.addEventListener("resize", function () {
  if (window.innerWidth > 893) {
    let menu = document.getElementById("hiddenMenu");
    let menuButton = document.querySelector(".menu");

    feed.classList.remove("hidden");
    chatSection.classList.remove("hidden");
    menu.classList.remove("active");
    menuButton.classList.remove("active");
    overlay.classList.remove("active");
  } else {
    if (feed.style.display != "none" && chatSection.style.display != "none") {
      filter.querySelectorAll('input[name="categories"]').forEach((radio) => {
        radio.checked = false;
      });

      chatSection.classList.add("hidden");
      feed.classList.remove("hidden");
    }
  }
});

overlay.addEventListener("click", () => {
  toggleMenu();
});
menu.addEventListener("click", function (event) {
  event.stopPropagation(); // Prevents the overlay from closing the menu
});

if (window.innerWidth < 893) {
  feed.classList.remove("hidden");
  chatSection.classList.add("hidden");
}

document.addEventListener("DOMContentLoaded", () => {
  const commentBtns = document.querySelectorAll(".comment-btn");

  commentBtns.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      // Use index to find the correct comment section
      const commentContainer =
        document.querySelectorAll(".container-comment")[index];

      // Toggle visibility of the comment container
      if (commentContainer) {
        commentContainer.classList.toggle("hidden");
      }
    });
  });

  usersContainer.addEventListener("click", (event) => {
    if (event.target.classList.contains("chat-user")) {
      openChat(event.target);
      userDiv = document.getElementById(event.target.textContent.trim());
      if (userDiv) {
        let readIcon = userDiv.querySelector("#read");
        if (readIcon) {
          readIcon.innerHTML =
            '<i class="fa fa-envelope-open-o" aria-hidden="true"></i>';
        }
      }
      fetchChatHistory(event.target.textContent.trim());
    }
  });

  closeChatBtn.addEventListener("click", closeChat);
});
