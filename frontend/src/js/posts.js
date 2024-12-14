//import { loginForm } from '../../public/components/login.js'
import { Article } from '../../public/components/article.js';
import Logout from '../../public/components/logout.js'
import postForm from '../../public/components/postForm.js';
const postsContainer = document.querySelector('main .post-list')
let posts = []

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


});


///TODO : still not working
function Reply() {
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
}

// /LOGIN AND SIGN UP/ 

const showLoginModal = () => {
    const loginModal = document.querySelector("#loginModal");
    if (loginModal) {
        loginModal.classList.remove("hidden");
    }
};

document.addEventListener("DOMContentLoaded", () => {
   

  




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

            // Show the register modal when the re(".btn.login");gister button is clicked
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



// create post

document.addEventListener("DOMContentLoaded", () => {
    const createPostBtn = document.querySelector(".btn.createPostBtn");

    const dynaicPost = document.querySelector("#dynaicPost");

    // Load the create post modal from post.html
    fetch("post.html")
        .then((response) => {
            if (!response.ok) throw new Error("Failed to load create post modal");
            return response.text();
        })
        .then((html) => {

            dynaicPost.innerHTML = html;
            const popupOverlay = document.querySelector("#popupOverlay");
            const closePopupBtn = document.querySelector("#closePopup");
            const createPostForm = document.querySelector("#createPostForm");

            // Show create post modal when create post button is clicked
            createPostBtn.addEventListener("click", () => {
                dynaicPost.style.display = "block";
                popupOverlay.classList.remove("hidden");
            });

            // Close popup
            closePopupBtn.addEventListener("click", () => {
                popupOverlay.classList.add("hidden");
                dynaicPost.style.display = "none";
            });

            // Close popup when clicking outside
            window.addEventListener("click", (event) => {
                if (event.target === popupOverlay) {
                    popupOverlay.classList.add("hidden");
                    dynaicPost.style.display = "none";
                }
            });

            // Handle form submission
            createPostForm.addEventListener("submit", (e) => {
                e.preventDefault();

                const title = document.querySelector("#title").value;
                const content = document.querySelector("#content").value;
                const category = document.querySelector("#categories").value;

                // Basic validation
                if (!title || !content || !category) {
                    alert("Please fill in all fields");
                    return;
                }

                // Placeholder for post creation
                alert(`Post Created:\nTitle: ${title}\nCategory: ${category}`);

                // Close the modal
                popupOverlay.classList.add("hidden");
                dynaicPost.style.display = "none";

                // Reset form
                createPostForm.reset();
            });
        })
        .catch((error) => console.error("Error loading create post modal:", error));
});


// logout

document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.querySelector(".btn.logout");
    const logoutDynamic = document.querySelector("#logoutdynamic");

    const showLogoutModal = () => {
        const logoutModal = document.querySelector("#logoutModal");
        if (logoutModal) {
            logoutModal.classList.remove("hidden");
        }
    };

    // Load the logout modal from logout.html
    logoutDynamic.innerHTML = Logout()

    // fetch("logout.html")
    //     .then((response) => {
    //         if (!response.ok) throw new Error("Failed to load logout modal");
    //         return response.text();
    //     })
    //     .then((html) => {
    //         logoutDynamic.innerHTML = html;

    const logoutModal = document.querySelector("#logoutModal");
    const closeLogoutModal = logoutModal.querySelector(".close");
    const confirmLogout = logoutModal.querySelector("#confirmLogout");
    const cancelLogout = logoutModal.querySelector("#cancelLogout");

    // Show the logout modal when the logout button is clicked
    logoutBtn.addEventListener("click", showLogoutModal);

    // Hide the modal when the close button is clicked
    closeLogoutModal.addEventListener("click", () => {
        logoutModal.classList.add("hidden");
    });

    // Hide the modal when clicking outside the modal content
    window.addEventListener("click", (event) => {
        if (event.target === logoutModal) {
            logoutModal.classList.add("hidden");
        }
    });

    // Handle logout confirmation
    confirmLogout.addEventListener("click", () => {
        localStorage.removeItem("user_id"); // Clear user data from localStorage
        alert("You have been logged out!");
        logoutModal.classList.add("hidden");
        window.location.reload(); // Optionally refresh the page or redirect to login
    });

    // Handle logout cancellation
    cancelLogout.addEventListener("click", () => {
        logoutModal.classList.add("hidden");
    });
})
//         .catch((error) => console.error(error));
// });



const category = document.querySelector('.category')
const createPost = document.querySelector("#dynaicPost")


!userId ? createPost.innerHTML = postForm() : null

// fetch("/get-categories")
fetch("./posts.json")
    .then(res => res.json())
    .then(catesss => {
        console.log(catesss);

        // const option = document.createElement('option')
        // option.value = catesss.id
        // option.textConten = catesss.name
        // category.appendChild(option)
    })
    .catch((err) => console.log("can't get categories", err))


//get poosts
// fetch('/')
fetch('./posts.json')
    .then(res => res.json())
    .then(data => {
        posts = data.posts
        listPosts(data.posts)
    }
    )

const listPosts = (posts) => {
    postsContainer.innerHTML = posts.length ? posts.map(post => Article(post)) : `<p>No Posts For Now!! </p>`
}
const dynamicContent = document.querySelector("#dynamicContent");
const anotherDynamic = document.querySelector("#anotherDynamic");

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
function popPost(id) {
    console.log(posts.find(p => p.id === id))
}

  // dynamicContent.innerHTML = loginForm()

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

window.popPost = popPost