const form = document.querySelector("form")
const loginError = document.querySelector('.loginError')

form.addEventListener("submit", function (e) {
    ///prevent degault page refresh
    e.preventDefault();

    ///username or email
    const username_email = document.getElementById("username_email").value;
    const password = document.getElementById("password").value;

    if (username_email == "" || password == "") {
        loginError.textContent = "fields are required!!"
        return
    }
    fetch("http://localhost:5000/authentication/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    })
        .then((res) => {
            if (!res.ok) {
                loginError.textContent = "Invalid credentials!!"
                throw new Error("Invalid credentials");
            }
            return res.json();
        })
        .then((data) => {
            console.log(data.message); // For debugging purposes
            // Redirect to the home page
            localStorage.setItem("user_id", data.user.id);
            ///save username to localstorage to display it in profile section
            localStorage.setItem("username", data.user.username);
            window.location.href = "/";
        })
        .catch((error) => console.error(error));
})