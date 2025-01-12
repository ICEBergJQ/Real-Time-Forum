const logged = localStorage.getItem("logged")
const navLogoutBtn = document.querySelector('button.logout')
const registerBtn = document.querySelector(".start-topic") || ''
const loginBtn = document.querySelector("button.login")
const createPostBtn = document.querySelector("button.createPostBtn")
const likeBtn = document.querySelector('button.like-btn')
const spinner = document.getElementById('spinner');
// const profileName = document.querySelector('.profile')

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


//auth comps errors
const displayToast = (color, txt) => {
    toast.textContent = txt
    toast.style.top = "40px"
    toast.style.background = color;
    toast.style.animation = "bounce 0.5s ease-in-out"
    hideToast()
}

let timer
const hideToast = () => {
    clearTimeout(timer)
    timer = setTimeout(() => {
        toast.style.animation = "none"
        toast.style.top = "-55px"
    }, 3000);

}