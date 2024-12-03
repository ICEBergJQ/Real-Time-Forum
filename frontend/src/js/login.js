const form = document.querySelector("form")
const loginError = document.querySelector('.loginError')

form.addEventListener("submit", function (e) {
    ///prevent degault page refresh
    e.preventDefault();

    ///username or email
    const username = document.querySelector("#username").value.trim();
    const password = document.querySelector("#password").value.trim();
    ///    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;  // At least 8 chars, 1 letter, 1 number

    if (username == "" || password == "") {
        loginError.textContent = "fields are required!!"
    } else if (password.length < 6) {
        loginError.textContent = "Password must be at least 6 characters long !!"
    }

    if (loginError.textContent) {
        loginError.classList.add('display-err')
        return
    }
    fetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    })
        .then((res) => {
            if (!res.ok) {
                loginError.textContent = "Invalid credentials!!"
                throw new Error("Invalid credentials");
            }
            return res.json();
        })
        .then(data => {
            console.log(data); 
            ///save username to localstorage to display it in profile section
            localStorage.setItem("user_id", data.user.id);
            localStorage.setItem("username", data.user.username);
            window.location.href = "/";
        })
        .catch((error) => console.error(error));
})