function filterPosts(filtermethod) {
    let categories = Array.from(document.querySelectorAll('nav input[type=checkbox]:checked'), elem => elem.value)

    let data = {
        filtermethod,
        categories,
        cursor: formatDate(new Date()),
        id: 1
    }
    console.log(filtermethod)
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
        //list filtered posts
        listPosts(data.posts)
    }).catch(err => displayToast('var(--red)', err))
}

