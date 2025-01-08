const dislikeBtn = document.querySelector('button.dislike')
const dislikeCounter = document.querySelector('.dislike-btn span')


///if the user is logged
// const userId = localStorage.getItem("user_id");
/// else hide like/dislike btns


function interact(e, post_id, comment_id, reaction_type) {
    console.log(e, post_id, comment_id, reaction_type);

    ///    const postId = e.dataset.postId
    fetch(`/reaction`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            user_id: 2,
            post_id,  comment_id,reaction_type
        }),
    })
        .then(res => {
            res.json()
            console.log(res)
        }
        )
        .then(data => {
            fetchPosts()
            ///check if there is row in the like table with the userid and postid
            ///chech the response for the value of case
            // console.log(data)
            // if (data.msg == 'Done') {
            //     alert(`${action}d...`);
            //     //handleInteraction(action)
            // } else {
            //     alert(`already ${action}d...`)
            // }

            // window.location.reload();
        })
        .catch((error) => alert("post interaction Error : " + error.message))
}

function handleInteraction(action) {
    const likeCounter = document.querySelector('.like-btn span')

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