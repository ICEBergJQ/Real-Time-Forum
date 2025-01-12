const logoutBtn = document.querySelector(".btn.logout");
const logoutModal = document.querySelector("#logoutModal");
const closeLogoutModal = logoutModal.querySelector(".close");
const confirmLogout = logoutModal.querySelector("#confirmLogout");

// const showLogoutModal = () => {
//     // const logoutModal = document.querySelector("#logoutModal");
//     if (logoutModal) {
//         logoutModal.classList.remove("hidden");
//     }
// };


//check if it's logged in alreadty bedore access logout
// Handle logout confirmation
confirmLogout.onclick = () => {
    fetch('/auth/logout', {
        method: 'POST',
        headers: { "Content-Type": "application/json" }
    })
        .then(res => {
            if (!res.ok) throw new Error("Failed to load logout modal")
            return res.json()
        })
        .then(data => {
            data?.Message ?
                displayToast('var(--green)', data.Message)
                :
                displayToast('var(--green)', "You are logged out")
            logoutModal.classList.add("hidden");
            localStorage.removeItem("logged")

            document.cookie = "session_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

            setTimeout(() => {
                window.location.href = "/";

            }, 1500)
        }).catch(err => console.log("logout Error : ", err))
}

// Show the logout modal when the logout button is clicked
logoutBtn.addEventListener("click", () => showPopup(logoutModal));
// logoutBtn.addEventListener("click", showLogoutModal);

// Hide the modal when clicking outside the modal content
window.addEventListener("click", (e) => {

    if (e.target === logoutModal || e.target.id === 'cancelLogout' || e.target === closeLogoutModal) {
        logoutModal.classList.add("hidden");
    }
});

