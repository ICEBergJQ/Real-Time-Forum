function filterPosts(filtermethod) {
    let categories = Array.from(document.querySelectorAll('nav input[type=checkbox]:checked'), elem => elem.value)

    if (logged !== '1' && (filtermethod === "getcreatedposts" || filtermethod === "getlikedposts")) {
        displayToast('var(--red)', 'you need to login!')
        displayPopup("openLogin")

        return
    }

    let data = {
        filtermethod,
        categories,
        cursor: formatDate(new Date())
    }
    
    fetch('/filter', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
            data
        ),
    }).then(res => {
        if (!res.ok) {
            throw new Error('something went wrong:::!!')
        }
        return res.json()
    }).then(data => {
        console.log(data)
        //list filtered posts
        listPosts(data.posts)
    }).catch(err => displayToast('var(--red)', err))
}

