function interact(e, post_id, comment_id, reaction_type) {


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

            return res.json()
        })
        .then(data => {
            let currentElem = e.target
            console.log(data)
            let count = currentElem.children[1].textContent
            let otherElem = null
            let otherCount = null

            if (currentElem.classList.contains('dislike-btn')) {
                console.log(2133)
                otherElem = currentElem.previousElementSibling
                otherCount = currentElem.previousElementSibling.children[1].textContent
            } else {
                otherElem = currentElem.nextElementSibling
                otherCount = currentElem.nextElementSibling.children[1].textContent
            }
            if (data.Message === 'Removed') {
                currentElem.children[1].textContent = parseInt(count) - 1
            }
            if (data.Message === 'Added') {
                currentElem.children[1].textContent = parseInt(count) + 1
            }
            if (data.Message === 'Updated') {
                currentElem.children[1].textContent = parseInt(count) + 1
                otherElem.children[1].textContent = parseInt(otherCount) - 1

            }

            // fetchPosts()

        })
        .catch(error => displayToast('var(--red)', error)
        )
}
