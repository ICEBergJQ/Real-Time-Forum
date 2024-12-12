const userId = localStorage.getItem("user_id");
const logoutBtn = document.querySelector('button.logout') || ''
const registerBtn = document.querySelector(".start-topic") || ''
const loginBtn = document.querySelector("button.login")
const createPostBtn = document.querySelector("button.createPostBtn")
// const profileName = document.querySelector('.profile')

function createElem(tag, className, content) {
    const element = document.createElement(tag)
    element.classList.add(className)
    element.textContent = content
    return element
}
if (userId) {
    logoutBtn.style.display = "inline-block"
    createPostBtn.style.display = "inline-block"
    // profileName.textContent = localStorage.getItem("username")
    // profileName.style.display = 'inline-block'

    //hide login / register
    loginBtn.style.display = "none"
    registerBtn.style.display = "none"

} else{
    loginBtn.style.display = "inline-block"
    registerBtn.style.display = "inline-block"
   logoutBtn.style.display = "none"
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