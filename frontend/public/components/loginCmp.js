export default function loginForm() {
    return `
    <div id="loginModal" class="modal hidden ">
        <div class="modal-content popup">
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