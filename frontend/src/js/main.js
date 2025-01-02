const logged = localStorage.getItem("logged");
const navLogoutBtn = document.querySelector('button.logout')
const registerBtn = document.querySelector(".start-topic") || ''
const loginBtn = document.querySelector("button.login")
const createPostBtn = document.querySelector("button.createPostBtn")
const likeBtn = document.querySelector('button.like-btn')

// const profileName = document.querySelector('.profile')
let categories = []

function createElem(tag, className, content) {
    const element = document.createElement(tag)
    element.classList.add(className)
    element.textContent = content
    return element
}


if (logged) {
    ///nav btns
    navLogoutBtn.style.display = "inline-block"
    createPostBtn.style.display = "inline-block"
    // profileName.textContent = localStorage.getItem("username")
    // profileName.style.display = 'inline-block'

    //hide login / register
    loginBtn.style.display = "none"
    registerBtn.style.display = "none"

} else {
    loginBtn.style.display = "inline-block"
    registerBtn.style.display = "inline-block"
    navLogoutBtn.style.display = "none"
    createPostBtn.style.display = "none"

    //hide profile
    // profileName.style.display = 'none':

}

// logoutBtn.onclick =  function () {
//     // Clear user data from localStorage

//     confirm("Logout Confirmation") ? (

//         localStorage.clear(),
//         // Redirect to the login page
//         window.location.href = "/"
//     ) : null
// }

function displayComment(e) {
    e.target.parentElement.nextElementSibling.classList.toggle("hidden")
}

//auth comps errors
const displayError = (txt) => {
    authError.textContent = txt
    authError.style.top = "40px"
    authError.style.animation = "bounce 0.5s ease-in-out"
    hideError(authError)
}

let timer
const hideError = () => {
    clearTimeout(timer)
    timer = setTimeout(() => {
        authError.style.animation = "none"
        authError.style.top = "-55px"
    }, 3000);

}

///load comps  



// document.querySelector("#signUpModal form").addEventListener("submit", handleRegister);)