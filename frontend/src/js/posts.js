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

anotherDynamic.innerHTML = registerForm()
dynamicContent.innerHTML = loginForm()
logoutDynamic.innerHTML = Logout()
dynaicPost.innerHTML = postForm()

let registerModal = document.querySelector("#signUpModal")
const loginModal = document.querySelector("#loginModal")
const createPost = document.querySelector("#popupOverlay")

// X : Hide the modal when the close button is clicked 
const closeModal = modal => {
    if (modal === 'login')
        loginModal.classList.add("hidden")
    else if (modal === 'register')
        registerModal.classList.add("hidden")
    else if (modal === 'post')
        createPost.classList.add("hidden")
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

//get poosts

let cursor = formatDate(new Date())

const listPosts = (posts, fromWhere) => {
    postsContainer.innerHTML = ''
    // articles = posts
    fromWhere === 'fromFilter' ? articles = [] : null
    if (posts) {
        articles.push(...posts)
    }
    !articles.length ?
        displayToast('var(--info', 'No Post Found!!')

        : articles.forEach(async post => {
            const comments = await getComment(post.id)
            console.log(comments)
            postsContainer.innerHTML += Article(post, comments)
        })
}

const listSinglePost = (post) => postsContainer.insertAdjacentHTML("afterbegin", Article(post, []));
//////return the post id to replace the "1"
///the comùent belongs to
const listSingleComment = (Post_id, container, com) => container.querySelector('h2').insertAdjacentHTML("afterend", Comment(Post_id, com));

loadMore.onclick = () => {
    cursor = formatDate(new Date(articles[articles.length - 1].createdat))
    fetchPosts();
}

// Function to fetch posts
function fetchPosts() {
    let url = '/post';
    url += `?cursor=${cursor}`
    spinner.style.display = 'block';
    fetch(url)
        .then(res => {
            // console.log(res)
            if (!res.ok) {
                throw new Error("something went wrong with !!:!")
            }
            return res.json()
        })
        .then(data => {
            console.log(data)
            if (data.posts && data.posts.length > 0) {

                data.postsremaing ? loadMore.style.display = 'block' : loadMore.style.display = 'none'

                listPosts(data.posts);

            } else {
                displayToast('var(--info)', "NO POsts!!")
                spinner.style.display = 'none';
            }

        }).catch(err => displayToast('var(--red)', `get posts : ${err}`))
}


fetch("/categories")
    .then(res => res.json())
    .then(categories => {

        document.querySelector('#createPostForm .categories-container').innerHTML = categories.map(cat => `<input type="checkbox" id="${cat.category_name}" name="categories" value="${cat.category_name}">
            <label for="${cat.category_name}">${cat.category_name}</label> `).join('')
    })
    .catch(err => displayToast('var(--red)', `can't get categories${err}`))

fetchPosts();

////.
async function getComment(postId) {
    let url = `/comment?id=${postId}`
    try {
        const res = await fetch(url)
        if (!res.ok) throw new Error('something wrong with salah')

        const coms = await res.json()
        return coms || []

    } catch (err) {
        displayToast('var(--red)', `can't get comment ${err}`)
    }
}

const displayComments = (e) => e.target.parentElement.nextElementSibling.classList.toggle("hidden")

window.displayPopup = displayPopup
window.listPosts = listPosts
window.fetchPosts = fetchPosts
window.displayComments = displayComments
window.listSinglePost = listSinglePost
window.listSingleComment = listSingleComment
window.closeModal = closeModal
