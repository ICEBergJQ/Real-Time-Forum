export default function postForm() {
    return `
    <div class="popup-overlay hidden" id="popupOverlay">
    <div class="popup">
        <button class="close-btn" onclick="closeModal('post')" id="closePopup">X</button>
        <h2>Create a Post</h2>
        <form id="createPostForm">
            <label for="title">Title</label>
            <input type="text" id="title" name="title" placeholder="Enter post title" value="tetst title" required>

            <label for="content">Content</label>
            <textarea id="content" name="content" rows="5" placeholder="Enter post content"  required> test content</textarea>

            <label for="categories">Categories:</label><br>
            <div class="categories-container">
            </div>
            <button class="sbtn" type="submit">Submit</button>
        </form>
    </div>
</div>
    `;
}