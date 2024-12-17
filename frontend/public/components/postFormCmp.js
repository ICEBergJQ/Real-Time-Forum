export default function postForm(){
    return `
    <h2>Create a Post</h2>
    <form id="createPostForm">
      <label for="title">Title:</label><br>
      <input type="text" id="title" name="title" required><br>
    
      <label for="content">Content:</label><br>
      <textarea id="content" name="content" required></textarea><br>
    
      <label for="categories">Categories:</label><br>
      <select id="categories" name="categories" multiple required>
      
      </select><br>
    
      <button type="submit">Submit Post</button>
    </form>
    `;
}