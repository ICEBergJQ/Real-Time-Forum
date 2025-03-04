let articles = [];
let categories = [];
window.offset = 0;
window.articles = articles;


function checkIfLoggedout(msg) {

    if (msg === 'user logged-out successfully' || msg === "user not logged-in") {
        localStorage.removeItem("logged")
        toggleloginPage();
        window.location.href = "/";
        return
    }
}

function toggleloginPage() {
    if (logged === '1') {
        mainContent.classList.remove("hidden")
        navbar.classList.remove("hidden")
        chatBtn.classList.remove("hidden")
    } else {
        mainContent.classList.add("hidden")
        navbar.classList.add("hidden")
        chatBtn.classList.add("hidden")
        displayPopup("openLogin")
    }
}

const displayToast = (color, txt) => {
    toast.textContent = txt
    toast.style.top = "40px"
    toast.style.background = color;
    toast.style.animation = "bounce 0.5s ease-in-out"
    hideToast(1500)
}


let timer
const hideToast = (mill) => {
    //clear prev timeout if exists
    clearTimeout(timer)

    timer = setTimeout(() => {
        toast.style.animation = "none"
        toast.style.top = "-105px"
    }, mill);

}

function calculateAge(birthdate) {
    const birthDate = new Date(birthdate);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    // If birthday hasn't occurred yet this year, subtract 1 from age
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
    }

    return age;
}

function closeChat() {
    chatUsername.textContent = "";
    chatMessages.innerHTML = "";
    chatBox.style.display = "none";
    window.offset = 0;
  }

function searchUsersById() {
  const input = document.getElementById("userSearch").value.toLowerCase();
  const userDivs = document.querySelectorAll(".chat-user");
  
  userDivs.forEach((userDiv) => {
    if (input === "") {
        userDiv.classList.remove('hidden')
    } else if (userDiv.id.toLowerCase().includes(input)) {
      userDiv.classList.remove('hidden')
    } else {
      userDiv.classList.add('hidden')
    }
  });
}

const listPosts = (post) => {

    if (post) {
        
    }
}

