const like = document.querySelector('button.like')
const dislike = document.querySelector('button.dislike')
const likeCounter = document.querySelector('likes')
const dislikeCounter = document.querySelector('dislikes')


///if the user is logged
const userId = localStorage.getItem("user_id");
/// else hide like/dislike btns

like.addEventListener('click', (e) => {
    ///there will be a data attribbute in the like btn
    const postId = e.dataset.postId
    //already liked
    if (like.classList.contains('liked')) {
        ///removve the like
        likeCounter -= 1


        ///send req to db
        fetch(`http://localhost:5000/removelike`, {
            method: "POST",

            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: userId, post_id: postId }),
        })
            .then((response) => response.json())
            .then((data) => {
                ///post like removed
                alert(data.message);
                // window.location.reload();
            })
            .catch((error) => alert("post like Error : " + error.message))
    } else {
        likeCounter += 1

        ///addd like to a post
        fetch(`http://localhost:5000/addlike`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: userId, post_id: postId }),
        })
            .then((response) => response.json())
            .then((data) => {
                ///post liked
                alert(data.message);
            })
            .catch((error) => alert("post like Error: " + error.message))

    }

})


dislike.addEventListener('click', () => {
    const postId = e.dataset.postId
    //already disliked
    if (like.classList.contains('disliked')) {
        dislikeCounter -= 1

        fetch(`http://localhost:5000/removeDislike`, {
            method: "POST",

            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: userId, post_id: postId }),
        })
            .then((response) => response.json())
            .then((data) => {
                alert(data.message);
                // window.location.reload();
            })
            .catch((error) => alert("dislike Error : " + error.message))
    }
    else {
        dislikeCounter += 1
        ///send req to db
        fetch(`http://localhost:5000/dislike`, {
            method: "POST",

            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: userId, post_id: postId }),
        })
            .then((response) => response.json())
            .then((data) => {
                alert(data.message);
                // window.location.reload();
            })
            .catch((error) => alert("Error: " + error.message))
    }
})