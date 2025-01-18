export default function registerForm() {
    return `
 <div id="signUpModal" class="modal hidden  ">
        <div class="modal-content popup">
            <span class="close" onclick="closeModal('register')">
               <svg class="close-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
</svg>
            </span>
            <h2 class="log">Sign Up</h2>
            <form class="for">
                   <label for="username">username</label>
                <input type="text" id="username" name="username" placeholder="Enter your username" required>
    
                <label for="email">Email</label>
                <input type="email" id="email" name="email" placeholder="Enter your email" required>
    
                <label for="password">Password</label>
                <input type="password"   id="password" name="password" placeholder="Enter your password" required>
    
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
