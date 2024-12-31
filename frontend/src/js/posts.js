import { loginForm, teeeeeesloginForm } from '../../public/components/loginCmp.js'
import registerForm from '../../public/components/registerCmp.js'
import { Article } from '../../public/components/articleCmp.js'
import Logout from '../../public/components/logoutCmp.js'
import postForm from '../../public/components/postFormCmp.js'
const postsContainer = document.querySelector('main .post-list')
let posts = []
const dynamicContent = document.querySelector("#dynamicContent")
const anotherDynamic = document.querySelector("#anotherDynamic")
const logoutDynamic = document.querySelector("#logoutdynamic");


anotherDynamic.innerHTML = registerForm()
dynamicContent.innerHTML = teeeeeesloginForm()
logoutDynamic.innerHTML = Logout()

let registerModal = document.querySelector("#signUpModal")

document.addEventListener("DOMContentLoaded", () => {
    const likeButtons = document.querySelectorAll(".btn")

    likeButtons.forEach((button) => {
        button.addEventListener("click", () => {
            if (button.textContent.includes("👍")) {
                const likes = parseInt(button.textContent.match(/\d+/)) || 0
                button.textContent = `👍 Like (${likes + 1})`
            }
        })
    })
})

///TODO : still not working
function Reply() {
    const sendBtn = document.querySelector(".send-btn")
    const replyInput = document.querySelector(".reply-input")

    sendBtn.addEventListener("click", () => {
        const replyText = replyInput.value
        if (replyText.trim() !== "") {
            alert("Reply submitted: " + replyText)
            replyInput.value = "" // Clear the input after submission
        } else {
            alert("Reply cannot be empty!")
        }
    })
}

// /LOGIN AND SIGN UP/
const showLoginModal = () => {
    const loginModal = document.querySelector("#loginModal")
    if (loginModal) {
        loginModal.classList.remove("hidden")
    }
}
const showRegisterModal = () => {
    registerModal ?
        registerModal.classList.remove("hidden") : null
}

const displayPopup = (target) => {
    console.log(loginModal)
    if (target === "openLogin") {
        registerModal.classList.add("hidden") // Hide register modal
        showLoginModal()
    } else if (target === "openSignup") {
        loginModal.classList.add("hidden") // Hide login modal
        showRegisterModal()
    }
}
// create post

document.addEventListener("DOMContentLoaded", () => {
    const createPostBtn = document.querySelector(".btn.createPostBtn")

    const dynaicPost = document.querySelector("#dynaicPost")

    // Load the create post modal from post.html
    fetch("./static/public/post.html")
        .then((response) => {
            if (!response.ok) throw new Error("Failed to load create post modal")
            return response.text()
        })
        .then((html) => {

            dynaicPost.innerHTML += html
            const popupOverlay = document.querySelector("#popupOverlay")
            const closePopupBtn = document.querySelector("#closePopup")
            const createPostForm = document.querySelector("#createPostForm")

            // Show create post modal when create post button is clicked
            createPostBtn.addEventListener("click", () => {
                dynaicPost.style.display = "block"
                popupOverlay.classList.remove("hidden")
            })

            // Close popup
            /*closePopupBtn.addEventListener("click", () => {
                popupOverlay.classList.add("hidden")
                dynaicPost.style.display = "none"
            })*/

            // Close popup when clicking outside
            window.addEventListener("click", (event) => {
                if (event.target === popupOverlay) {
                    popupOverlay.classList.add("hidden")
                    dynaicPost.style.display = "none"
                }
            })

            // Handle form submission
            createPostForm.addEventListener("submit", (e) => {
                e.preventDefault()

                const title = document.querySelector("#title").value
                const content = document.querySelector("#content").value
                const category = document.querySelector("#categories").value

                // Basic validation
                if (!title || !content || !category) {
                    alert("Please fill in all fields")
                    return
                }

                // Placeholder for post creation
                alert(`Post Created:\nTitle: ${title}\nCategory: ${category}`)

                // Close the modal
                popupOverlay.classList.add("hidden")
                dynaicPost.style.display = "none"

                // Reset form
                createPostForm.reset()
            })
        })
        .catch((error) => console.error("Error loading create post modal:", error))
})

const category = document.querySelector('.category')
const createPost = document.querySelector("#dynaicPost")

// userId ? createPost.innerHTML += postForm() : null

const listPosts = (posts) => {
    postsContainer.innerHTML = posts.length ? posts.map(post => Article(post)) : `<p>No Posts For Now!! </p>`
    ///get elems after comp load
    attachModalEventListeners()
    //after comp loaded
    registerModal = document.querySelector("#signUpModal")
}
function popPost(e, id) {
    const post = posts.find(p => p.id === id)
    e.target.parentElement.textContent = post.content
}

// Hide the modal when clicit pull origin developking outside the modal content
window.addEventListener("click", (event) => {

    if (event.target === loginModal) {
        loginModal.classList.add("hidden")
    }
    if (event.target === registerModal) {
        registerModal.classList.add("hidden")
    }
})

// Hide the modal when the close button is clicked 
const closeModal = modal => {
    if (modal === 'login')
        loginModal.classList.add("hidden")
    else if (modal === 'register')
        registerModal.classList.add("hidden")
}
// registerBtn.click() 

const attachModalEventListeners = () => {
    //trigger login popup
    const buttons = document.querySelectorAll(".like-btn, .dislike-btn, #Like, #DisLike, .send-btn")

    buttons.forEach((button) => {
        button.addEventListener("click", (e) => {
            e.preventDefault()
            if (!localStorage.getItem("logged")) {
                showLoginModal()
            } else {
                alert("Action successful! You are logged in.")
            }
        })
    })
}

// Show the login modal when the login button is clicked
console.log(loginBtn);

loginBtn.addEventListener("click", showLoginModal)
registerBtn.onclick = () => showRegisterModal()
///get data

//get poosts
fetch('/posts')
// fetch('./static/public/posts.json')
    .then(res => res.json())
    .then(data => {
        console.log("11313")
        posts = data.posts
        listPosts(data.posts)
    }).catch(err=> console.log(err))




/*
// fetch("/get-categories")
fetch("./posts.json")
    .then(res => res.json())
    .then(catesss => {
        console.log(catesss)

        // const option = document.createElement('option')
        // option.value = catesss.id
        // option.textConten = catesss.name
        // category.appendChild(option)
    })
    .catch((err) => console.log("can't get categories", err))
*/
window.popPost = popPost
window.closeModal = closeModal
window.displayPopup = displayPopup



