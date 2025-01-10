const createPostForm = document.querySelector('#createPostForm')
const postTitle = createPostForm.querySelector('input[type=text]')
const postContent = createPostForm.querySelector('textarea')

createPostForm.onsubmit = (e) => {
    e.preventDefault()

    const title = postTitle.value.trim()
    const content = postContent.value.trim()
    const categories = Array.from(document.querySelectorAll('input[type=checkbox]:checked'), elem => elem.value)

    console.log(categories.length)
    console.log(categories)
    const category_id = [1]

    if (!title || !content || !categories.length) {
        displayError('all fields are required!')
        // alert('')
        return
    }
    let Author_id = user_id

    fetch('/post', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            Author_id,
            title,
            content,
            categories,
        })
    })
        .then(res => {
            console.log(res)
            if (!res.ok)
                throw error
            res.json()
        }
        )
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
            // alert("data.message)
            fetchPosts();

            // location.href = '/'
        })
        .catch(() => alert("creating post Error"));
}