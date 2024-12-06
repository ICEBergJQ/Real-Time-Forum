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
                    const commentsSection = btn.parentElement.parentElement.querySelector(".container-comment");
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
            const commentsSection = btn.closest(".post-details").querySelector(".comments-section");
            commentsSection.classList.toggle("hidden");
        });
    });
});

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

            // Hide the modal when clicking outside the modal content
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

//--------------------------------------------------------------


const category = document.querySelector('.category')
const createPost = document.querySelector(".create-post-container")

if (userId ) {
    createPost.innerHTML = `
    <h2>Create a Post</h2>
    <form id="createPostForm">
      <label for="title">Title:</label><br>
      <input type="text" id="title" name="title" required><br>
    
      <label for="content">Content:</label><br>
      <textarea id="content" name="content" required></textarea><br>
    
      <label for="categories">Categories:</label><br>
      <select id="categories" name="categories" multiple required>
      
      </select><br>
    
      <button type="submit">Submit Post</button>
    </form>
    `;

    fetch("/get-categories")
        .then(res => res.json())
        .then(catesss => {
            const option = document.createElement('option')
            option.value = catesss.id
            option.textConten = catesss.name
            category.appendChild(option)
        })
        .catch((err) => console.log("can't get categories", err))

    createPost.querySelector('button').addEventListener('click', (e) => {
        e.preventDefault()
        const title = document.querySelector('input[type=text]').value
        const content = document.querySelector('textarea').value
        const selectedCategory = document.querySelector('textarea').value

        fetch('localhost:5000/craete-post', {
            method: 'post',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user_id: userId,
                title, content,
                categories: selectedCategory
            })
        })
            .then(res => res.json())
            .then(data => {
                alert(data.message)
                Window.location.reload()
            })
            .catch((error) => alert("creating post Error : " + error.message));

    })
}


//get poosts
const postsContainer = document.querySelector('.main>.container')
fetch('/get-posts')
    .then(res => res.json())
    .then(data => {
        postsContainer.innerHTML = data.map(post => `
    <div class="post">
<h3>${post.title}</h3>
<p>${post.content}</p>
<p>
    <button ${!userId ? disabled : null}>Likes:</button> ${post.likes} | 
    <button ${!userId ? disabled : null}>Dislikes:</button> ${post.dislikes} | 
    <button ${!userId ? disabled : null}>Comments:</button> ${post.comments}
</p>
                   <hr/>
    </div>
    `)
    })