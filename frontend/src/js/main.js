const logged = localStorage.getItem("logged")
const navLogoutBtn = document.querySelector('button.logout')
const registerBtn = document.querySelector(".start-topic") || ''
const loginBtn = document.querySelector("button.login")
const createPostBtn = document.querySelector("button.createPostBtn")
const likeBtn = document.querySelector('button.like-btn')
const spinner = document.getElementById('spinner');

// const profileName = document.querySelector('.profile')
///TODO
//return created date with the created comment also in post

let categories = []
let articles = []
const toast = document.querySelector('.toast')

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
    // profileName.textContent = localStorage.getItem("username")
    // profileName.style.display = 'inline-block'

    //hide login / register
    loginBtn.style.display = "none"
    registerBtn.style.display = "none"

    //display filter options

} else {
    loginBtn.style.display = "inline-block"
    registerBtn.style.display = "inline-block"
    navLogoutBtn.style.display = "none"
    createPostBtn.style.display = "none"

    //hide profile
    // profileName.style.display = 'none':

}

const showPopup = (elem) => {
    if (elem) {
        elem.classList.remove("hidden");
    }
};

// errors  
const displayToast = (color, txt) => {
    toast.textContent = txt
    toast.style.top = "40px"
    toast.style.background = color;
    toast.style.animation = "bounce 0.5s ease-in-out"
    hideToast(3000)
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
        console.log(mill)
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

//load more
function popPost(e, id) {
    const post = articles.find(p => p.id == id)
    e.target.parentElement.textContent = post.content
}