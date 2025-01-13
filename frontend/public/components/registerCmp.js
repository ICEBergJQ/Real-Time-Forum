export default function registerForm() {
    return `
 <div id="signUpModal" class="modal hidden">
        <div class="modal-content">
            <span class="close" onclick="closeModal('register')">&times;</span>
            <h2 class="log">Sign Up</h2>
            <form class="for">
                   <label for="username">Full Name</label>
                <input type="text" id="username" name="username" placeholder="Enter your full name" required>
    
                <label for="email">Email</label>
                <input type="email" id="email" name="email" placeholder="Enter your email" required>
    
                <label for="password">Password</label>
                <input type="password" id="password" name="password" placeholder="Enter your password" required>
    
                <label for="confirm-password">Confirm Password</label>
                <input type="password" id="confirm-password" name="confirm-password" placeholder="Confirm your password" required>
    
                <button class="btn_s">Sign Up</button>
            </form>
            <p class="sign-up-text">
                   Already have an account? <span class="sign-up-link"  onclick="displayPopup('openLogin')" id="openLogin">Login</span>
            </p>
        </div>
    </div>
    `
}
