const form = document.querySelector("form")

form.addEventListener("submit", function (event) {
    event.preventDefault();


    
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    ///add confirm password input
/*password === confirmPassword */

    ///TODO : password validation
    ///email regex
    ///trim spaces
    ///


    ///check if the username / email is already taken
    if (username == "" || email == "" || password == "") {
        alert('all fields are required!!!!!!')
        return
    }
    fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Invalid credentials");
            }
            return response.json();
        })
        .then((data) => {
            console.log(data.message); // For debugging purposes

            ///redirect to login page
            window.location.href = "/login";
        })
        .catch((error) => console.error(error));
})