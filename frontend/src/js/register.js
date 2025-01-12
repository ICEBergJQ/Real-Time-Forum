document.querySelector('#signUpModal .btn_s').addEventListener('click', function handleRegister(a) {

    a.preventDefault();

    // a.stopImmediatePropagation();
    const username = document.querySelector("#signUpModal #username").value.trim()
    const email = document.querySelector("#email").value.trim()
    const password = document.querySelector("#signUpModal #password").value.trim()
    const confirmPassword = document.querySelector("#confirm-password").value.trim()
    ///add confirm password input

    if (username == "" || email == "" || password == "" || confirmPassword == "") {
        displayToast('var(--red)', "all fields are required!!")
        return
    } else if (password.length < 6) {
        displayToast('var(--red)', "Password must be at least 6 characters long !!")
        return
    }
    else if (password !== confirmPassword) {
        displayToast('var(--red)', "Password mismatch")
        return
    }

    fetch("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
    })
        .then(res => {
            console.log('Response status:', res.status);
            if (!res.ok) {
                displayToast('var(--red)', res.statusText)
                throw new Error("something went wrong!")
            }
            res.json()
        })
        .then(() => {
            //display a popup
            displayToast('var(--green)', 'registered, please login')
            // alert('registered, please login')
            ///redirect to login page
            // window.location.href = "/"
            displayPopup("openLogin")
        })
        .catch((error) => console.error("- ", error))

})