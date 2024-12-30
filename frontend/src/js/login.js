const loginError = document.querySelector('.authError')

const form = document.querySelector('#loginModal form')

form.addEventListener('submit', (e) => {

    e.preventDefault();

    ///username or email
    const username = document.querySelector("#username").value.trim();
    const password = document.querySelector("#password").value.trim();
    ///    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;  // At least 8 chars, 1 letter, 1 number

    if (username == "" || password == "") {
        displayError("all fields are required!!")
        return
    } else if (password.length < 6) {
        displayError("Invalid credentials")
        return
    }

    fetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    })
        .then((res) => {
            if (!res.ok) {

                displayError("qsd :"+res.statusText)
                throw new Error("Invalid credentials");
            }
            return res.json();
        })
        .then(data => {
            console.log(data);
            ///save username to localstorage to display it in profile section
            // localStorage.setItem("user_id", data.user.id);
            // localStorage.setItem("username", data.user.username);
            // window.location.href = "/";
        })
        .catch((error) => console.error(error));
}

)
