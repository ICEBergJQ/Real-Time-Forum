export default function loginForm() {
    return `
    <div id="loginModal" class="modal hidden ">
        <div class="modal-content popup">
            <span class="close" onclick="closeModal('login')">
              <svg class="close-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
</svg>
            </span>
            <h2 class="log">Login</h2>
            <form class="for" ">
                <label for="username">Username</label>
                <input type="text" id="username" name="username" placeholder="Enter your username" autocomplete="off"  required>
                <label for="password">Password</label>
                <input type="password" id="password"  name="password" placeholder="Enter your password"  required>
                <button type="submit" class="btn_s">Login</button>
            </form>
            <p class="sign-up-text">
                Don't have an account? <span class="sign-up-link" onclick="displayPopup('openSignup')" id="openSignup">Sign Up</span>
            </p>
        </div>
    </div>`
} 