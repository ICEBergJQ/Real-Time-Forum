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

    const showLoginModal = () => {
        const loginModal = document.querySelector("#loginModal");
        if (loginModal) {
            loginModal.classList.remove("hidden");
        }
    };
    
    const attachModalEventListeners = () => {
        const buttons = document.querySelectorAll(".like-btn, .dislike-btn, #Like, #DisLike, .send-btn");
        buttons.forEach((button) => {
            button.addEventListener("click", (e) => {
                e.preventDefault();
                if (!localStorage.getItem("user_id")) {
                    showLoginModal();
                } else {
                    alert("Action successful! You are logged in.");
                }
            });
        });
    };



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
            loginBtn.addEventListener("click", showLoginModal);

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

            attachModalEventListeners();
            
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








// // // Example user data (to be set in localStorage for testing)
// localStorage.setItem("users", JSON.stringify([{ username: "testuser", password: "password123" }]));




// document.addEventListener("DOMContentLoaded", () => {
//     const loginBtn = document.querySelector(".btn.login");
//     const registerBtn = document.querySelector(".btn.start-topic");
//     const navActions = document.querySelector(".nav-actions");

//     const toggleLoginState = (isLoggedIn) => {
//         if (isLoggedIn) {
//             // Hide Login and Sign Up, Show Logout
//             navActions.innerHTML = '<button class="btn logout">Logout</button>';
//             const logoutBtn = document.querySelector(".btn.logout");
//             logoutBtn.addEventListener("click", () => {
//                 localStorage.removeItem("loggedInUser");
//                 toggleLoginState(false);
//             });
//         } else {
//             // Restore Login and Sign Up buttons
//             navActions.innerHTML = `
//                 <button class="btn login">Login</button>
//                 <button class="btn start-topic">Sign Up</button>
//             `;
//             initLoginEvents();
//         }
//     };

//     const validateLogin = (username, password) => {
//         const users = JSON.parse(localStorage.getItem("users")) || [];
//         return users.some(user => user.username === username && user.password === password);
//     };

//     const handleLogin = () => {
//         const username = document.querySelector("#username").value.trim();
//         const password = document.querySelector("#password").value.trim();

//         if (validateLogin(username, password)) {
//             localStorage.setItem("loggedInUser", username);
//             alert("Login successful!");
//             toggleLoginState(true);
//             document.querySelector("#loginModal").classList.add("hidden");
//         } else {
//             alert("Invalid username or password.");
//         }
//     };

//     const initLoginEvents = () => {
//         const loginModal = document.querySelector("#loginModal");
//         if (loginModal) {
//             const loginForm = loginModal.querySelector("form");
//             loginForm.addEventListener("submit", (e) => {
//                 e.preventDefault();
//                 handleLogin();
//             });

//             const closeLoginModal = loginModal.querySelector(".close");
//             closeLoginModal.addEventListener("click", () => {
//                 loginModal.classList.add("hidden");
//             });

//             loginBtn.addEventListener("click", () => {
//                 loginModal.classList.remove("hidden");
//             });
//         }
//     };

//     // Initialize login events and toggle based on login state
//     const loggedInUser = localStorage.getItem("loggedInUser");
//     toggleLoginState(!!loggedInUser);
// });







// document.addEventListener("DOMContentLoaded", () => {
   
//    // Initialize example user data in localStorage for testing
//    if (!localStorage.getItem("users")) {
//     localStorage.setItem(
//         "users",
//         JSON.stringify([
//             { username: "testuser", password: "password123" },
//             { username: "admin", password: "adminpass" } // Additional test user
//         ])
//     );
// }
   
//     // Helper function to toggle visibility
//     const toggleVisibility = (element) => {
//         element?.classList.toggle("hidden");
//     };

//     // Comment toggle functionality
//     document.querySelectorAll(".comment-btn").forEach((btn) => {
//         btn.addEventListener("click", () => {
//             const commentsSection = btn.closest(".post-preview")?.querySelector(".comments-container");
//             if (commentsSection) {
//                 toggleVisibility(commentsSection);
//             } else {
//                 console.error("Comments section not found for this post");
//             }
//         });
//     });

//     // Like button functionality
//     document.querySelectorAll(".btn").forEach((button) => {
//         button.addEventListener("click", () => {
//             if (button.textContent.includes("👍")) {
//                 const likes = parseInt(button.textContent.match(/\d+/)) || 0;
//                 button.textContent = `👍 Like (${likes + 1})`;
//             }
//         });
//     });

//     // Reply submission functionality
//     const sendBtn = document.querySelector(".send-btn");
//     const replyInput = document.querySelector(".reply-input");
//     sendBtn?.addEventListener("click", () => {
//         const replyText = replyInput.value.trim();
//         if (replyText) {
//             alert("Reply submitted: " + replyText);
//             replyInput.value = "";
//         } else {
//             alert("Reply cannot be empty!");
//         }
//     });

//     // Modal handling
//     const handleModal = (modal, action) => {
//         if (modal) {
//             modal.classList[action]("hidden");
//         }
//     };

//     // Attach modal event listeners
//     const attachModalListeners = () => {
//         const loginModal = document.querySelector("#loginModal");
//         const signUpModal = document.querySelector("#signUpModal");

//         if (loginModal) {
//             const closeLoginModal = loginModal.querySelector(".close");
//             const openSignUpLink = loginModal.querySelector("#openSignup");
//             closeLoginModal?.addEventListener("click", () => handleModal(loginModal, "add"));
//             openSignUpLink?.addEventListener("click", (e) => {
//                 e.preventDefault();
//                 handleModal(loginModal, "add");
//                 handleModal(signUpModal, "remove");
//             });
//         }

//         if (signUpModal) {
//             const closeSignUpModal = signUpModal.querySelector(".close");
//             const openLoginLink = signUpModal.querySelector("#openLogin");
//             closeSignUpModal?.addEventListener("click", () => handleModal(signUpModal, "add"));
//             openLoginLink?.addEventListener("click", (e) => {
//                 e.preventDefault();
//                 handleModal(signUpModal, "add");
//                 handleModal(loginModal, "remove");
//             });
//         }
//     };

//     // Load modal content dynamically
//     const loadModal = (url, containerId) => {
//         fetch(url)
//             .then((response) => {
//                 if (!response.ok) throw new Error(`Failed to load ${url}`);
//                 return response.text();
//             })
//             .then((html) => {
//                 const container = document.querySelector(containerId);
//                 container.innerHTML = html;
//                 attachModalListeners();
//             })
//             .catch((error) => console.error(error));
//     };

//     loadModal("login.html", "#dynamicContent");
//     loadModal("register.html", "#anotherDynamic");

//     // User login/logout functionality
//     const toggleLoginState = (isLoggedIn) => {
//         const navActions = document.querySelector(".nav-actions");
//         if (isLoggedIn) {
//             navActions.innerHTML = '<button class="btn logout">Logout</button>';
//             document.querySelector(".btn.logout").addEventListener("click", () => {
//                 localStorage.removeItem("loggedInUser");
//                 toggleLoginState(false);
//             });
//         } else {
//             navActions.innerHTML = `
//                 <button class="btn login">Login</button>
//                 <button class="btn start-topic">Sign Up</button>
//             `;
//             attachModalListeners();
//         }
//     };

//     const validateLogin = (username, password) => {
//         const users = JSON.parse(localStorage.getItem("users")) || [];
//         return users.some(user => user.username === username && user.password === password);
//     };

//     document.querySelector(".btn.login")?.addEventListener("click", () => {
//         const username = document.querySelector("#username").value.trim();
//         const password = document.querySelector("#password").value.trim();
//         if (validateLogin(username, password)) {
//             localStorage.setItem("loggedInUser", username);
//             alert("Login successful!");
//             toggleLoginState(true);
//         } else {
//             alert("Invalid username or password.");
//         }
//     });

//     toggleLoginState(!!localStorage.getItem("loggedInUser"));
// });




// login home paaaaaage*******************************************
// ***************************************************************

// document.addEventListener("DOMContentLoaded", () => {
//     // Select the buttons
//     const loginBtn = document.querySelector(".btn.login");
//     const signUpBtn = document.querySelector(".btn.start-topic");
//     const logoutBtn = document.querySelector(".btn.logout")

//     // Hide the buttons by setting their display style to 'none'
//     if (loginBtn) loginBtn.style.display = "none";
//     if (signUpBtn) signUpBtn.style.display = "none";
//     if (logoutBtn) logoutBtn.classList.remove("hidden")
// });