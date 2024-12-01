
const category = document.querySelector('.category')
const createPost = document.getElementById("create-post-container")

if (userId) {
    createPost.innerHTML = `
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

    fetch("/get-categories")
        .then(res => res.json())
        .then(catesss => {
            const option = document.createElement('option')
            option.value = catesss.id
            option.textConten = catesss.name
            category.appendChild(option)
        })
        .catch((err) => console.log("can't get categories", err))

    createPost.querySelector('button').addEventListener('click', (e) => {
        e.preventDefault()
        const title = document.querySelector('input[type=text]').value
        const content = document.querySelector('textarea').value
        const selectedCategory = document.querySelector('textarea').value

        fetch('localhost:5000/craete-post', {
            method: 'post',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user_id: userId,
                title, content,
                categories: selectedCategory
            })
        })
            .then(res => res.json())
            .then(data => {
                alert(data.message)
                Window.location.reload()
            })
            .catch((error) => alert("creating post Error : " + error.message));

    })
}


///get poosts
const postsContainer = document.querySelector('.main>.container')
fetch('/get-posts')
    .then(res => res.json())
    .then(data => {
        postsContainer.innerHTML = data.map(post => `
    <div class="post">
<h3>${post.title}</h3>
<p>${post.content}</p>
<p>
    <button ${!userId ? disabled : null}>Likes:</button> ${post.likes} | 
    <button ${!userId ? disabled : null}>Dislikes:</button> ${post.dislikes} | 
    <button ${!userId ? disabled : null}>Comments:</button> ${post.comments}
</p>
                   <hr/>
    </div>
    `)
    })