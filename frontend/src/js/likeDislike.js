const dislikeBtn = document.querySelector('button.dislike')
const dislikeCounter = document.querySelector('.dislike-btn span')


///if the user is logged
// const userId = localStorage.getItem("user_id");
/// else hide like/dislike btns


function interact( post_id, comment_id, reaction_type) {
    ///post likecount also count comments
     
    if (logged !== '1') {
        // console.log(checkId)
        alert("you need to login!")
        return
    }
    ///    const postId = e.dataset.postId
    fetch(`/reaction`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
           user_id:1, post_id, comment_id, reaction_type
        }),
    })
        .then(res => {
            if (!res.ok)
                throw new Error('post interaction Error ' + res.status + " " + res.statusText)
        })
        .then(() => {
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
        .catch(error => alert(error))
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