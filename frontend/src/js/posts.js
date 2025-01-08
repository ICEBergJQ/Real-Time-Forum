import { loginForm, teeeeeesloginForm } from '../../public/components/loginCmp.js'
import registerForm from '../../public/components/registerCmp.js'
import { Article } from '../../public/components/articleCmp.js'
import Logout from '../../public/components/logoutCmp.js'
import postForm from '../../public/components/postFormCmp.js'
const postsContainer = document.querySelector('main .post-list')
const dynamicContent = document.querySelector("#dynamicContent")
const anotherDynamic = document.querySelector("#anotherDynamic")
const dynaicPost = document.querySelector("#dynaicPost")
const logoutDynamic = document.querySelector("#logoutdynamic");
const loadMore = document.querySelector('main>button')

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

function popPost(e, id) {
    const post = articles.find(p => p.id == id)
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
const formatDate = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')
    console.log(year)
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

let cursor = formatDate(new Date())

const listPosts = (posts) => {
    postsContainer.innerHTML = ''
    articles = posts

    posts.forEach(async post => {
        const comments = await getComment(post.id)
        postsContainer.innerHTML += Article(post, comments)
    })

    attachModalEventListeners()
    //after comp loaded
    registerModal = document.querySelector("#signUpModal")
    console.log(articles)
}

loadMore.onclick = () => {
    cursor = formatDate(new Date(articles[articles.length - 1].createdat))
    fetchPosts();
}

// Function to fetch posts
function fetchPosts() {
    let url = '/post';

    // if (cursor) {
    url += `?cursor=${cursor}`
    // }

    fetch(url, {
        // method: 'GET',
        // headers: { "Content-Type": "application/json" },
        // body: JSON.stringify({ cursor: "2025-01-06 01:27:33" }),
    })
        .then(res => res.json())
        .then(posts => {
            if (posts && posts.length > 0) {
                loadMore.style.display = 'block'
                listPosts(posts);

            } else {
                alert("NO More POsts!!")
            }
        }).catch(err => console.log("get posts : ", err));
}


fetch("/categories")
    .then(res => res.json())
    .then(categories => {
        console.log(categories);

        document.querySelector('#createPostForm .categories-container').innerHTML = categories.map(cat => `<input type="checkbox" id="${cat.category_name}" name="categories" value="${cat.category_name}">
            <label for="${cat.category_name}">${cat.category_name}</label> `).join('')
    })
    .catch(err => console.log("can't get categories", err))

fetchPosts();

async function getComment(id) {
    let url = `/comment?id=${id}`
    try {
        const res = await fetch(url)
        const coms = await res.json()
        return coms || []

    } catch (err) {
        console.log("can't get comment", err)
    }

}

function displayComment(e) {
    e.target.parentElement.nextElementSibling.classList.toggle("hidden")
}

window.popPost = popPost
window.closeModal = closeModal
window.displayPopup = displayPopup
window.listPosts = listPosts
window.fetchPosts = fetchPosts
window.displayComment = displayComment



