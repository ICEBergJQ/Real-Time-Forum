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

    if (!title || !content || !categories.length) {
        displayToast('var(--red)', 'all fields are required!')
        // alert('')
        return
    }
    if(title.length>300 || content.length>4000){
        displayToast('var(--red)', 'You have exceeded the maximum character limit!!')
        return
    }

    fetch('/post', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            title,
            content,
            categories,
        })
    })
        .then(res => {
            console.log(res)
            if (!res.ok)
                throw error
            return res.json()
        }
        )
        .then(data => {
            checkIfLoggedout(data)
            //listSinglePost(data)

            displayToast('var(--info)', 'post created successfully!!!')
            popupOverlay.classList.add("hidden")
            createPostForm.reset()
            // alert("data.message)
            // fetchPosts();
            setTimeout(() => {
                form.reset()
                window.location.href = "/"

            }, 700)
        })
        .catch(() => displayToast('var(--red)', "creating post Error"));
}