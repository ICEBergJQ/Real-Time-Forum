const logoutBtn = document.querySelector(".btn.logout");
const logoutModal = document.querySelector("#logoutModal");
const closeLogoutModal = logoutModal.querySelector(".close");
const confirmLogout = logoutModal.querySelector("#confirmLogout");

//check if it's logged in alreadty bedore access logout
// Handle logout confirmation
confirmLogout.onclick = () => {
    fetch('/auth/logout', {
        method: 'POST',
        headers: { "Content-Type": "application/json" }
    })
        .then(res => {
            if (!res.ok) throw new Error("something went wrong, please try again")
            return res.json()
        })
        .then(data => {
            displayToast('var(--green)', data.Message)

            logoutModal.classList.add("hidden");
            localStorage.removeItem("logged")

            setTimeout(() => {
                window.location.href = "/";

            }, 700)
        }).catch(err => displayToast('var(--red)', "logout Error : " + err))
}

// Show the logout modal when the logout button is clicked
logoutBtn.addEventListener("click", () => showPopup(logoutModal));

// Hide the modal when clicking outside the modal content
window.addEventListener("click", (e) => {

    if (e.target === logoutModal || e.target.id === 'cancelLogout' || e.target === closeLogoutModal) {
        logoutModal.classList.add("hidden");
    }
});

