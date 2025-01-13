import loginForm from '../../public/components/loginCmp.js'
import {registerForm, registerFormp} from '../../public/components/registerCmp.js'
import  Article  from '../../public/components/articleCmp.js'
import Logout from '../../public/components/logoutCmp.js'
import postForm from '../../public/components/postFormCmp.js'
const postsContainer = document.querySelector('main .post-list')
const dynamicContent = document.querySelector("#dynamicContent")
const anotherDynamic = document.querySelector("#anotherDynamic")
const dynaicPost = document.querySelector("#dynaicPost")
const logoutDynamic = document.querySelector("#logoutdynamic");
const loadMore = document.querySelector('main>button.load-more')

anotherDynamic.innerHTML = registerForm()
dynamicContent.innerHTML = loginForm()
logoutDynamic.innerHTML = Logout()
dynaicPost.innerHTML = postForm()

let registerModal = document.querySelector("#signUpModal")
const loginModal = document.querySelector("#loginModal")
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
    if (loginModal)
        loginModal.classList.remove("hidden")
}

const showRegisterModal = () => {
    registerModal ?
        registerModal.classList.remove("hidden") : null
}
// Show create post modal when create post button is clicked

const showCreatePostModal = () => {
    popupOverlay.classList.remove("hidden")
}

///switch login / register
const displayPopup = (target) => {
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
    }
})

// X : Hide the modal when the close button is clicked 
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
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

let cursor = formatDate(new Date())

const listPosts = (posts) => {
    postsContainer.innerHTML = ''
    articles = posts
    console.log(articles)

    !articles ?
        postsContainer.innerHTML += "<p>No Posts Found!!</p>"
        : posts.forEach(async post => {
            const comments = await getComment(post.id)
            // console.log(comments)
            postsContainer.innerHTML += Article(post, comments)
        })

    attachModalEventListeners()
    //after comp loaded
    // registerModal = document.querySelector("#signUpModal")
}


const listSinglePost = (post) => {
    console.log("hi : ", post)
    postsContainer.insertAdjacentHTML("afterbegin", Article(post, []));

    // postsContainer.prepend(Article(post, []))
    // postsContainer.innerHTML += Article(post, [])
 //   attachModalEventListeners()
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
    spinner.style.display = 'block';
    fetch(url)
        .then(res => res.json())
        .then(posts => {
            if (posts && posts.length > 0) {
                loadMore.style.display = 'block'
                listPosts(posts);

            } else {
                alert("NO More POsts!!")
            }
            spinner.style.display = 'none';

        }).catch(err => console.log("get posts : ", err));
}


fetch("/categories")
    .then(res => res.json())
    .then(categories => {

        document.querySelector('#createPostForm .categories-container').innerHTML = categories.map(cat => `<input type="checkbox" id="${cat.category_name}" name="categories" value="${cat.category_name}">
            <label for="${cat.category_name}">${cat.category_name}</label> `).join('')
    })
    .catch(err => console.log("can't get categories", err))

fetchPosts();

async function getComment(postId) {
    let url = `/comment?id=${postId}`
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

function filterPosts(filtermethod) {
    // document.querySelectorAll('nav checkbox')
    let categories = []

    let data = {
        filtermethod,
        categories,
        cursor: formatDate(new Date()),
        id: 1
    }
    console.log(filtermethod)
    fetch('/filter', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
            data
        ),
    }).then(res => {
        if (!res.ok) {
            alert('something went wrong:::!!')
            throw new Error('something went wrong:::!!')
        }
        return res.json()
    }).then(data => {
        listPosts(data)
        console.log("get posts", data)
    }).catch(err => console.log(err))
}

// window.popPost = popPost
window.closeModal = closeModal
window.displayPopup = displayPopup
window.listPosts = listPosts
window.fetchPosts = fetchPosts
window.displayComment = displayComment
window.filterPosts = filterPosts
window.listSinglePost = listSinglePost
window.popPost=popPost



