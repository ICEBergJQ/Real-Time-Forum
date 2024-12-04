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

    fetch(`/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, post_id: postId }),
    })
        .then((response) => response.json())
        .then((data) => {
            ///post like removed
            alert(data.message);
            
            ///check if there is row in the like table with the userid and postid
            ///chech the response for the value of case
            if (data.case === "remove") {
                likeCounter -= 1
            }
            else if (data.case === "add") {
                likeCounter += 1
            }
            // window.location.reload();
        })
        .catch((error) => alert("post like Error : " + error.message))
})


dislike.addEventListener('click', () => {
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