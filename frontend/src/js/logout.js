document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.querySelector(".btn.logout");

    const showLogoutModal = () => {
        const logoutModal = document.querySelector("#logoutModal");
        if (logoutModal) {
            logoutModal.classList.remove("hidden");
        }
    };


    // fetch("logout.html")
    //     .then((response) => {
    //         if (!response.ok) throw new Error("Failed to load logout modal");
    //         return response.text();
    //     })
    //     .then((html) => {
    //         logoutDynamic.innerHTML = html;

    const logoutModal = document.querySelector("#logoutModal");
    const closeLogoutModal = logoutModal.querySelector(".close");
    const confirmLogout = logoutModal.querySelector("#confirmLogout");
    const cancelLogout = logoutModal.querySelector("#cancelLogout");

    // Show the logout modal when the logout button is clicked
    logoutBtn.addEventListener("click", showLogoutModal);

    // Hide the modal when the close button is clicked
    closeLogoutModal.addEventListener("click", () => {
        logoutModal.classList.add("hidden");
    });

    // Hide the modal when clicking outside the modal content
    window.addEventListener("click", (event) => {
        if (event.target === logoutModal) {
            logoutModal.classList.add("hidden");
        }
    });

    // Handle logout confirmation
    confirmLogout.addEventListener("click", () => {
        localStorage.removeItem("logged"); // Clear user data from localStorage
        alert("You have been logged out!");
        logoutModal.classList.add("hidden");
        window.location.reload(); // Optionally refresh the page or redirect to login
    });

    // Handle logout cancellation
    cancelLogout.addEventListener("click", () => {
        logoutModal.classList.add("hidden");
    });
})
