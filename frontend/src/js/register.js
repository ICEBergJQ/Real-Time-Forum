const authError = document.querySelector('.authError')

document.querySelector('#signUpModal .btn_s').addEventListener('click', function handleRegister(a) {
    console.log('Form submission event:', a);

    a.preventDefault();

    console.log('Prevented form submission');

    // a.stopImmediatePropagation();
    const username = document.querySelector("#signUpModal #username").value.trim()
    const email = document.querySelector("#email").value.trim()
    const password = document.querySelector("#signUpModal #password").value.trim()
    const confirmPassword = document.querySelector("#confirm-password").value.trim()
    ///add confirm password input

    if (username == "" || email == "" || password == "" || confirmPassword == "") {
        displayError("all fields are required!!")
        return
    } else if (password.length < 6) {
        displayError("Password must be at least 6 characters long !!")
        return
    }
    else if (password !== confirmPassword) {
        displayError("Password mismatch")
        return
    }

    fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
    })
        .then(res => {
            console.log('Response status:', res.status);
            if (!res.ok) {
                displayError(res.statusText)
                throw new Error("something went wrong!")
            }
            res.json()
        })
        .then(data => {
            console.log(data) // For debugging purposes
            alert('registered')
            ///redirect to login page
            // window.location.href = "/login"
        })
        .catch((error) => console.error("- ", error))

})