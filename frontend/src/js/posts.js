document.addEventListener("DOMContentLoaded", () => {
    const mainContent = document.querySelector("#main-content");

    fetch("post.html")
        .then((response) => {
            if (!response.ok) throw new Error("Failed to load content");
            return response.text();
        })
        .then((html) => {
            mainContent.innerHTML = html;

            // Add any additional event listeners for dynamically loaded content
            const commentBtns = document.querySelectorAll(".comment-btn");
            commentBtns.forEach((btn) => {
                btn.addEventListener("click", () => {
                    const commentsSection = btn
                        .closest(".post-details")
                        .querySelector(".container-comment");
                        console.log(commentsSection)
                    commentsSection.classList.toggle("hidden");
                });
            });
        })
        .catch((error) => console.error(error));
});



document.addEventListener("DOMContentLoaded", () => {
    const commentBtns = document.querySelectorAll(".comment-btn");

    commentBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            // Get the closest comments container
            const commentsSection = btn
                .closest(".post-preview")
                .querySelector(".comments-container");

            if (commentsSection) {
                commentsSection.classList.toggle("hidden"); // Toggle hidden class
            } else {
                console.error("Comments section not found for this post");
            }
        });
    });
});



document.addEventListener("DOMContentLoaded", () => {
    const likeButtons = document.querySelectorAll(".btn");

    likeButtons.forEach((button) => {
        button.addEventListener("click", () => {
            if (button.textContent.includes("👍")) {
                const likes = parseInt(button.textContent.match(/\d+/)) || 0;
                button.textContent = `👍 Like (${likes + 1})`;
            }
        });
    });

    const sendBtn = document.querySelector(".send-btn");
    const replyInput = document.querySelector(".reply-input");

    sendBtn.addEventListener("click", () => {
        const replyText = replyInput.value;
        if (replyText.trim() !== "") {
            alert("Reply submitted: " + replyText);
            replyInput.value = ""; // Clear the input after submission
        } else {
            alert("Reply cannot be empty!");
        }
    });
});


// /LOGIN AND SIGN UP/ 

document.addEventListener("DOMContentLoaded", () => {
    const loginBtn = document.querySelector(".btn.login");
    const registerBtn = document.querySelector(".btn.start-topic");
    const dynamicContent = document.querySelector("#dynamicContent");
    const anotherDynamic = document.querySelector("#anotherDynamic");

    // Load the login modal from login.html
    fetch("login.html")
        .then((response) => {
            if (!response.ok) throw new Error("Failed to load login modal");
            return response.text();
        })
        .then((html) => {
            dynamicContent.innerHTML = html;

            const loginModal = document.querySelector("#loginModal");
            const closeLoginModal = loginModal.querySelector(".close");

            // Show the login modal when the login button is clicked
            loginBtn.addEventListener("click", () => {
                loginModal.classList.remove("hidden");
            });

            // Hide the modal when the close button is clicked
            closeLoginModal.addEventListener("click", () => {
                loginModal.classList.add("hidden");
            });

            // Hide the modal when clicit pull origin developking outside the modal content
            window.addEventListener("click", (event) => {
                if (event.target === loginModal) {
                    loginModal.classList.add("hidden");
                }
            });

            // Add event listener for switching to the register modal
            const openSignUpLink = loginModal.querySelector("#openSignup");
            openSignUpLink.addEventListener("click", (e) => {
                e.preventDefault();
                loginModal.classList.add("hidden"); // Hide login modal
                const signUpModal = document.querySelector("#signUpModal");
                if (signUpModal) {
                    signUpModal.classList.remove("hidden"); // Show register modal
                }
            });
        })
        .catch((error) => console.error(error));

    // Load the register modal from register.html
    fetch("register.html")
        .then((response) => {
            if (!response.ok) throw new Error("Failed to load register modal");
            return response.text();
        })
        .then((html) => {
            anotherDynamic.innerHTML = html;

            const registerModal = document.querySelector("#signUpModal");
            const closeRegisterModal = registerModal.querySelector(".close");

            // Show the register modal when the register button is clicked
            registerBtn.addEventListener("click", () => {
                registerModal.classList.remove("hidden");
            });

            // Hide the modal when the close button is clicked
            closeRegisterModal.addEventListener("click", () => {
                registerModal.classList.add("hidden");
            });

            // Hide the modal when clicking outside the modal content
            window.addEventListener("click", (event) => {
                if (event.target === registerModal) {
                    registerModal.classList.add("hidden");
                }
            });

            // Add event listener for switching to the login modal
            const openLoginLink = registerModal.querySelector("#openLogin");
            openLoginLink.addEventListener("click", (e) => {
                e.preventDefault();
                registerModal.classList.add("hidden"); // Hide register modal
                const loginModal = document.querySelector("#loginModal");
                if (loginModal) {
                    loginModal.classList.remove("hidden"); // Show login modal
                }
            });
        })
        .catch((error) => console.error(error));
});