const likeBtn = document.querySelector('button.like')
const dislikeBtn = document.querySelector('button.dislike')
const likeCounter = document.querySelector('.like-btn span')
const dislikeCounter = document.querySelector('.dislike-btn span')


///if the user is logged
const userId = localStorage.getItem("user_id");
/// else hide like/dislike btns

likeBtn.addEventListener('click', (e) => {
    ///there will be a data attribbute in the like btn
    const postId = e.dataset.postId

    fetch(`/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, post_id: postId }),
    })
        .then((response) => response.json())
        .then((data) => {
            ///check if there is row in the like table with the userid and postid
            ///chech the response for the value of case

            if (data.msg == 'Done') {
                alert('liked...');
                interact('like')
            } else {
                alert('already liked...')
            }

            // window.location.reload();
        })
        .catch((error) => alert("post like Error : " + error.message))
})


dislikeBtn.addEventListener('click', () => {
    const postId = e.dataset.postId
    //already disliked
    dislikeCounter -= 1

    fetch(`/dislike`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, post_id: postId }),
    })
        .then((response) => response.json())
        .then((data) => {

            alert(data.message);
            ///check if there is row in the dislike table with the userid and postid
            if (data.case === "remove") {
                likeCounter -= 1
            }
            else if (data.case === "add") {
                likeCounter += 1
            }
        })
        .catch((error) => alert("dislike Error : " + error.message))

})

function interact(action) {
    if (action === 'like') {
        let likes = parseInt(likeCounter.textContent)
        typeof (likes) === 'number' ?
            likeCounter.textContent = likes++ : null
    } else if (action === 'dislike') {
        let dislikes = parseInt(dislikeCounter.textContent)
        typeof (dislikes) === 'number' ?
            dislikeCounter.textContent = dislikes++ : null

    }
}