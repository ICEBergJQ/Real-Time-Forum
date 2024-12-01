const container = document.querySelector('.container')
const details = document.querySelector('.details')
const commentsContainer = document.querySelector('.comments')
const submitComment = document.querySelector('form')
const commentInput = document.querySelector('textarea.comment')
const id = window.location.pathname.split('/post/')[1]

fetch("/get-post/" + id, {
    method: "POST"
})
    .then(res => {
        if (res.ok)
            res.json()
        else
            throw new Error('Post not found')
    }
    )
    .then(data => {
        container.querySelector('h2').textContent = data.title
        container.querySelector('p').textContent = data.content
        details.querySelector('.likes').textContent = data.likes
        details.querySelector('.dislike').textContent = data.dislike
        details.querySelector('.comments').textContent = data.comments
        console.log(data)
    }).catch(err => alert('something wrong', err))



////get post comments
fetch('/get-comments/' + id)
    .then(res => {
        if (!res.ok) {
            throw new Error(`Response status: ${response.status}`)
        }

        //fetch the response body content
        res.json()
    })
    .then((comments) => {

        console.log(comments);

        comments.forEach(comm => {
            let comment = createElem('p', 'comment', comm.content)
            let commentAuthor = createElem('span', 'author', comm.author)
            let commentDate = createElem('span', 'author', comm.date)
            let wrapper = createElem('div', 'wrapper')
            /*
            userId == comm.authorId
            //add delete btn
            */
            wrapper.appendChild(comment)
            wrapper.appendChild(commentAuthor)
            wrapper.appendChild(commentDate)
            commentsContainer.appendChild(wrapper)
        });
    })
    .catch(
        (error) => {
            console.error(error.message);
        }
    )



submitComment.addEventListener('submit', (e) => {
    e.preventDefault()


    ////get post comments
    fetch('/add-comment/' + id, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, post_id: id })
    })
        .then(res => {
            if (!res.ok) {
                throw new Error(`Response status: ${response.status}`)
            }

            //fetch the response body content
            res.json()
        })
        .then(data => {
            alert(data)
            window.location.reload()
        })
        .catch(
            (error) => {
                console.error(error.message);
                alert(error.message);
            }
        )
})
