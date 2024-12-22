const createPostForm = document.querySelector('#createPostForm') || ''
const postTitle = document.querySelector('input[type=text]')
const postContent = document.querySelector('textarea')
const postCategory = document.querySelector('#categories')

createPostForm.onsubmit = (e) => {
    e.preventDefault()
    const title = postTitle.value.trim()
    const content = postContent.value.trim()
    const category = postCategory.value

    if (!title || !content.length < 10 || !category) {
        alert('all fields are required!')
        return
    }

    fetch('/create-post', {
        method: 'post',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            user_id: userId,
            title,
            content,
            category
        })
    })
        .then(res => res.json())
        .then(data => {
            alert(data.message)
            // Window.location.reload()
        })
        .catch((error) => alert("creating post Error : " + error.message));
}