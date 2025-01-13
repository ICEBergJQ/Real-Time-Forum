const container = document.querySelector('.container')
const details = document.querySelector('.details')
const commentsContainer = document.querySelector('.comments')
const submitComment = document.querySelector('form')
const commentInput = document.querySelector('textarea.comment')
const id = window.location.pathname.split('/post/')[1]

function postComment(e, Post_id) {
    let textarea = e.target.previousElementSibling.querySelector('textarea')
    console.log(e)
    if (logged !== '1') {
        displayToast('var(--red)', 'you need to login!')
        return
    }

    const Content = textarea.value.trim()
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

    }).then(data => {
        console.log(data)
        displayToast('var(--green)', 'comment added succesfully!!')
        // alert("msg : ", data)
        // fetchPosts()
        listSingleComment(e.target.parentElement.parentElement, data)
        textarea.value = ''
    })
        .catch(error => {
            console.error("err : ", error.message);
            displayToast('var(--red)', error.message)

        })
}