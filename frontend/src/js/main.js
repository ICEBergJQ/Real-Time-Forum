const logged = localStorage.getItem("logged")
const navLogoutBtn = document.querySelector('button.logout')
const registerBtn = document.querySelector(".start-topic") || ''
const loginBtn = document.querySelector("button.login")
const createPostBtn = document.querySelector("button.createPostBtn")
const likeBtn = document.querySelector('button.like-btn')
const spinner = document.getElementById('spinner');
const toast = document.querySelector('.toast')
const loadMore = document.querySelector('main>button.load-more')
const postsContainer = document.querySelector('main .post-list')
const mainContent = document.querySelector('.main-content')


let categories = []
let articles = []


function createElem(tag, className, content) {
    const element = document.createElement(tag)
    element.classList.add(className)
    element.textContent = content
    return element
}

if (logged === '1') {
    ///nav btns
    navLogoutBtn.style.display = "inline-block"
    createPostBtn.style.display = "inline-block"

    //hide login / register
    loginBtn.style.display = "none"
    registerBtn.style.display = "none"

    //display filter options

} else {
    loginBtn.style.display = "inline-block"
    registerBtn.style.display = "inline-block"
    navLogoutBtn.style.display = "none"
    createPostBtn.style.display = "none"
}

const showPopup = (elem) => {
    if (elem) {
        elem.classList.remove("hidden")
    }
}

// errors  
const displayToast = (color, txt) => {
    toast.textContent = txt
    toast.style.top = "40px"
    toast.style.background = color;
    toast.style.animation = "bounce 0.5s ease-in-out"
    hideToast(1500)
}
///reset the delay
toast.addEventListener('mouseenter', () => hideToast(10000))
toast.addEventListener('mouseleave', () => hideToast(100))

let timer
const hideToast = (mill) => {
    //clear prev timeout if exists
    clearTimeout(timer)

    timer = setTimeout(() => {
        toast.style.animation = "none"
        toast.style.top = "-105px"
    }, mill);

}
//cursor
const formatDate = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

//load more content...
function popPost(e, id) {
    const post = articles.find(p => p.id == id)
    const parent = e.target.parentElement;
    parent.textContent = post.content;
    const readless = document.createElement('button');
    readless.textContent = '...Read Less';
    readless.addEventListener('click', (event) => {
        readlesss(event, id);
    });
    parent.appendChild(readless);
}

function readlesss(e, id) {
    const post = articles.find(p => p.id == id)
    const parent = e.target.parentElement;
    const content = `${post.content.slice(0, 76)}`;
    parent.textContent = content;
    const readmore = document.createElement('button');
    readmore.textContent = 'Read More...';
    readmore.addEventListener('click', (event) => {
        popPost(event, id);
    });
    parent.appendChild(readmore);
}
function checkIfLoggedout(msg) {

    if (msg === 'user logged-out successfully' || msg === "user not logged-in") {
        localStorage.removeItem("logged")
        window.location.href = "/";
        return
    }
}
