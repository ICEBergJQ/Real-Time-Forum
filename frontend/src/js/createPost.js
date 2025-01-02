

const createPostForm = document.querySelector('#createPostForm')
const postTitle = createPostForm.querySelector('input[type=text]')
const postContent = createPostForm.querySelector('textarea')

createPostForm.onsubmit = (e) => {
    e.preventDefault()

    const title = postTitle.value.trim()
    const content = postContent.value.trim()
    const postCategory = Array.from(document.querySelectorAll('input[type=checkbox]:checked'), elem => elem.value)

    console.log(title)
    console.log(content)
    console.log(postCategory)

    if (!title || !content) {
        alert('all fields are required!')
        return
    }

    fetch('/posts', {
        method: 'post',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            title,
            content,
            postCategory
        })
    })
        .then(res => res.json())
        .then(data => {

            /*
               // Placeholder for post creation
                alert(`Post Created:\nTitle: ${title}\nCategory: ${category}`)
 
                // Close the modal
                popupOverlay.classList.add("hidden")
                dynaicPost.style.display = "none"
 
                // Reset form
                createPostForm.reset()
            */
            alert(data.message)
            // Window.location.reload()
        })
        .catch((error) => alert("creating post Error : " + error.message));
}