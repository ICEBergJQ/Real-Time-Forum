export default function Logout(){
    return `
     <div id="logoutModal" class="modal hidden  ">
        <div class="modal-content popup">
            <span class="close">
             <svg class="close-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
</svg>
            </span>
            <h2 class="log">Logout</h2>
            <p>Are you sure you want to log out?</p>
            <div class="logout-actions">
                <button id="confirmLogout" class="btn_s">Yes, Logout</button>
                <button id="cancelLogout" class="btn_s cancel-btn">Cancel</button>
            </div>
        </div>
    </div>
    `
}