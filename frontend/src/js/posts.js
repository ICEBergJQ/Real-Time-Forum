import { loginForm, teeeeeesloginForm } from '../../public/components/loginCmp.js'
import registerForm from '../../public/components/registerCmp.js'
import { Article } from '../../public/components/articleCmp.js'
import Logout from '../../public/components/logoutCmp.js'
import postForm from '../../public/components/postFormCmp.js'
const postsContainer = document.querySelector('main .post-list')
let posts = []
const dynamicContent = document.querySelector("#dynamicContent")
const anotherDynamic = document.querySelector("#anotherDynamic")
const dynaicPost = document.querySelector("#dynaicPost")
const logoutDynamic = document.querySelector("#logoutdynamic");


anotherDynamic.innerHTML = registerForm()
dynamicContent.innerHTML = teeeeeesloginForm()
logoutDynamic.innerHTML = Logout()
dynaicPost.innerHTML = postForm()

let registerModal = document.querySelector("#signUpModal")
const createPost = document.querySelector("#popupOverlay")

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
if (logged) {

}
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
// Show create post modal when create post button is clicked

const showCreatePostModal = () => {
    dynaicPost.style.display = "block"
    popupOverlay.classList.remove("hidden")
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
    if (event.target === createPost) {
        createPost.classList.add("hidden")
        dynaicPost.style.display = "none"
    }
})

// Hide the modal when the close button is clicked 
const closeModal = modal => {
    if (modal === 'login')
        loginModal.classList.add("hidden")
    else if (modal === 'register')
        registerModal.classList.add("hidden")
    else if (modal === 'post')
        createPost.classList.add("hidden")

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

loginBtn.addEventListener("click", showLoginModal)
registerBtn.onclick = () => showRegisterModal()
createPostBtn.onclick = () => showCreatePostModal()
///get data

//get poosts
// fetch('/posts')
    fetch('./static/public/posts.json')
    .then(res => res.json())
    .then(data => {
        console.log("11313")
        posts = data.posts
        listPosts(data.posts)
    }).catch(err => console.log(err))





// fetch("/get-categories")
/*fetch("./posts.json")
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



