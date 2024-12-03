const form = document.querySelector("form")
const registerError = document.querySelector('.registerError')

form.addEventListener("submit", function (event) {
    event.preventDefault()

    const fullname = document.querySelector("#fullname").value.trim()
    const email = document.querySelector("#email").value.trim()
    const password = document.querySelector("#password").value.trim()
    const confirmPassword = document.querySelector("#confirm-password").value.trim()
    ///add confirm password input
    /* */
    if (fullname == "" || email == "" || password == "" || confirmPassword == "") {
        loginError.textContent = "all fields are required!!"
    } else if (password.length < 6) {
        loginError.textContent = "Password must be at least 6 characters long !!"
    }
    else if (password !== confirmPassword) {
        loginError.textContent = "Password and Confirm Password do not match"
    }

    ///display error toast
    if (registerError.textContent) {
        registerError.classList.add('display-err')
        return
    }

    ///check if the fullname / email is already taken
    if (fullname == "" || email == "" || password == "") {
        alert('all fields are required!!!!!!')
        return
    }
    fetch("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullname, email, password }),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Invalid credentials")
            }
            return response.json()
        })
        .then((data) => {
            console.log(data) // For debugging purposes

            ///redirect to login page
            window.location.href = "/login"
        })
        .catch((error) => console.error(error))
})