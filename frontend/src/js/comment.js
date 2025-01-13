const container = document.querySelector('.container')
const details = document.querySelector('.details')
const commentsContainer = document.querySelector('.comments')
const submitComment = document.querySelector('form')
const commentInput = document.querySelector('textarea.comment')
const id = window.location.pathname.split('/post/')[1]
 
function postComment(e, Post_id) {

         
    if (logged !== '1') {
        alert("you need to login!")
        return
    }

    const Content = e.target.previousElementSibling.querySelector('textarea').value.trim()
    if (!Content) {
        alert("enter your comment!")
        return
    }
    console.log(Content, Post_id)
    let Author_id = user_id
    ////get post comments
    fetch('/comment', {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Author_id, Post_id, Content })
    })
        .then(res => {
            if (!res.ok)
                throw new Error(`Response status: ${res.status}`)

            //fetch the response body content
            res.json()
        })
        .then(data => {
            alert("msg : ", data)
            //listPosts(articles);
            fetchPosts()
            // window.location.reload()
        })
        .catch(
            (error) => {
                console.error("err : ", error.message);
                alert(error.message);
            }
        )
}