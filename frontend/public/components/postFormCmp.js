export default function postForm() {
    return `
    <div class="popup-overlay hidden" id="popupOverlay">
    <div class="popup">
        <button class="close-btn" onclick="closeModal('post')" id="closePopup">
        <svg class="close-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
</svg>

        </button>
        <h2>Create a Post</h2>
        <form id="createPostForm">
            <label for="title">Title</label>
            <input type="text" id="title" name="title" placeholder="Enter post title"  required>

            <label for="content">Content</label>
            <textarea id="content" name="content" rows="5" placeholder="Enter post content"  required></textarea>

            <label for="categories">Categories:</label><br>
            <div class="categories-container">
            </div>
            <button class="sbtn" type="submit">Submit</button>
        </form>
    </div>
</div>
    `;
}