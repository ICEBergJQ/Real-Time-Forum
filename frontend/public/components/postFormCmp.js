export default function postForm(){
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
                <input type="checkbox" id="tech" name="categories" value="Technology">
                <label for="tech">Technology</label>

                <input type="checkbox" id="science" name="categories" checked value="Science">
                <label for="science">Lifestyle</label>

                <input type="checkbox" id="health" name="categories" value="Health">
                <label for="health">Health</label>

                <input type="checkbox" id="sports" name="categories" value="Sports">
                <label for="sports">Sports</label>

                <input type="checkbox" id="art" name="categories" value="Art">
                <label for="art">Education</label>
            </div>


            <button class="sbtn" type="submit">Submit</button>
        </form>
    </div>
</div>
    `;
}