const container = document.querySelector('.container')
const details = document.querySelector('.details')
const commentsContainer = document.querySelector('.comments')
const submitComment = document.querySelector('form')
const commentInput = document.querySelector('textarea.comment')
const id = window.location.pathname.split('/post/')[1]

function postComment(e, Post_id) {
    let textarea = e.target.previousElementSibling.querySelector('textarea')
    if (logged !== '1') {
        displayToast('var(--red)', 'you need to login!')
        displayPopup("openLogin")
        return
    }

    const Content = textarea.value.trim()
    if (!Content) {
        displayToast('var(--red)', "enter your comment!")
        return
    }
    if (content.length > 300) {
        displayToast('var(--red)', 'You have exceeded the maximum character limit!!')
        return
    }
    ////get post comments
    fetch('/comment', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Post_id, Content })
    }).then(res => {
        if (!res.ok) {

            return res.json().then(data => { 
                throw new Error(data.Message || "Invalid input")
            })
        }
        return res.json()

    }).then(data => { 
        checkIfLoggedout(data.Message)

        displayToast('var(--green)', 'comment added succesfully!!')
        listSingleComment(Post_id, e.target.parentElement.parentElement, data)
        let commentsCount = e.target.parentElement.parentElement.querySelector('h2 span')
        commentsCount.textContent = parseInt(commentsCount.textContent) + 1
        textarea.value = ''
    })
        .catch(error => {
            displayToast('var(--red)', error.message)

        })
}