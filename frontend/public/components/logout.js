export default function Logout(){
    return `
     <div id="logoutModal" class="modal hidden">
        <div class="modal-content">
            <span class="close">&times;</span>
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