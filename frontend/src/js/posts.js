import loginForm from '../../public/components/loginCmp.js'
import registerForm from '../../public/components/registerCmp.js'
import Article from '../../public/components/articleCmp.js'
import Comment from '../../public/components/commentCmp.js'
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




// X : Hide the modal when the close button is clicked 
const closeModal = modal => {
    if (modal === 'login')
        loginModal.classList.add("hidden")
    else if (modal === 'register')
        registerModal.classList.add("hidden")
    else if (modal === 'post')
        createPost.classList.add("hidden")

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



// Show the login modal when the login button is clicked

loginBtn.addEventListener("click", showLoginModal)
registerBtn.onclick = () => showRegisterModal()
createPostBtn.onclick = () => showCreatePostModal()
///get data

//get poosts

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
}

const listSinglePost = (post) => postsContainer.insertAdjacentHTML("afterbegin", Article(post, []));
//////return the post id to replace the "1"
///the comùent belongs to
const listSingleComment = (container, com) => container.insertAdjacentHTML("afterbegin", Comment("1", com));

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
        .then(res => {

            if (!res.ok) {
                displayToast('var(--red)', res.statusText)
                throw new Error("something went wrong!")
            }
            return res.json()
        })
        .then(posts => {
            if (posts && posts.length > 0) {
                loadMore.style.display = 'block'
                listPosts(posts);

            } else {
                displayToast('var(--info)', "NO POsts!!")
                spinner.style.display = 'none';
            }

        }).catch(err => console.log("get posts : ", err))
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

window.displayPopup = displayPopup
window.listPosts = listPosts
window.fetchPosts = fetchPosts
window.displayComment = displayComment
window.listSinglePost = listSinglePost
window.listSingleComment = listSingleComment
window.closeModal = closeModal
