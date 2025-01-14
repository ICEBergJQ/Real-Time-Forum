function interact(post_id, comment_id, reaction_type) {

    //check if logged
    if (logged !== '1') {
        displayToast('var(--red)', 'you need to login!')
        return
    }
    fetch(`/reaction`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            post_id, comment_id, reaction_type
        }),
    })
        .then(res => {
            if (!res.ok)
                throw new Error('post interaction Error ' + res.status)
        })
        .then(() => {
            fetchPosts()

        })
        .catch(error => alert(error))
}
