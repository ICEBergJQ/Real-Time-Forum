const container = document.querySelector('.container')
const details = document.querySelector('.details')
const commentsContainer = document.querySelector('.comments')
const submitComment = document.querySelector('form')
const commentInput = document.querySelector('textarea.comment')
const id = window.location.pathname.split('/post/')[1]

function postComment(e, Post_id) {

    if (logged !== '1') {
        displayToast('var(--red)', 'you need to login!')
        return
    }

    const Content = e.target.previousElementSibling.querySelector('textarea').value.trim()
    if (!Content) {
        displayToast('var(--red)', "enter your comment!")
        return
    }
    ////get post comments
    fetch('/comment', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Post_id, Content })
    }).then(res => {
        if (!res.ok) {
             
            displayToast('var(--red)', "Something went wrong!");
        
            throw new Error(data?.Message || "Invalid credentials");
          
        }
        return res.json()

    }
    ).then(data => {
        console.log(data)
        alert("msg : ", data)
        fetchPosts()
    })
        .catch(error => {
            console.error("err : ", error.message);
            displayToast('var(--red)', error.message)

        }
        )
}