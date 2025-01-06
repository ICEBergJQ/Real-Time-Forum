const createPostForm = document.querySelector('#createPostForm')
const postTitle = createPostForm.querySelector('input[type=text]')
const postContent = createPostForm.querySelector('textarea')

createPostForm.onsubmit = (e) => {
    e.preventDefault()

    const title = postTitle.value.trim()
    const content = postContent.value.trim()
    const Categories = Array.from(document.querySelectorAll('input[type=checkbox]:checked'), elem => elem.value)

    console.log(title)
    console.log(content)
    console.log(Categories)
    const category_id = [1]
    const Author_id = 1;

    if (!title || !content) {
        alert('all fields are required!')
        return
    }

    fetch('/post', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            Author_id,
            title,
            content,
            Categories,
            category_id
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
            console.log(data)
            alert(data.message)
            // fetchPosts();

             location.href ='/'
        })
        .catch((error) => alert("creating post Error : " + error.message));
}