export function loginForm() {
    return `
    <div id="loginModal" class="modal hidden">
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2 class="log">Login</h2>
            <form class="for">
                <label for="username">Username</label>
                <input type="text" id="username" name="username" placeholder="Enter your username" required>
    
                <label for="password">Password</label>
                <input type="password" id="password" name="password" placeholder="Enter your password" required>
    
                <button type="submit" class="btn_s">Login</button>
            </form>
            <p class="sign-up-text">
                Don't have an account? <a href="#" class="sign-up-link" id="openSignup">Sign Up</a>
            </p>
        </div>
    </div>`
}