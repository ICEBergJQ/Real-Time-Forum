const form = document.querySelector('#loginModal form')

form.addEventListener('submit', (e) => {

    e.preventDefault()

    ///username or email
    const username = document.querySelector("#username").value.trim()
    const password = document.querySelector("#password").value.trim()

    if (username == "" || password == "") {
        displayToast('var(--red)', "all fields are required!!")
        return
    } else if (username.length < 3 || username.length > 20) {
        displayToast('var(--red)', "username must be between  3 and 20 chars !!")
        return
    } else if (password.length < 6 || password.length > 20) {
        //Password should be at least 6 characters long
        displayToast('var(--red)', "Invalid credentials")
        return
    }
    spinner.style.display = 'block'

    fetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    })
        .then(res => {
            if (!res.ok) {

                return res.json().then(data => {
                    throw new Error(data.Message || "Invalid credentials")
                })
            }
            return res.json()
        })
        .then(() => {

            ///testing TODO use cookie
            localStorage.setItem("logged", 1)
            displayToast('var(--green)', "redirecting...!")
            setTimeout(() => {
                window.location.href = "/"

                form.reset()
            }, 700)
            spinner.style.display = 'none'

        })
        .catch(error => { displayToast('var(--red)', error) })
})
