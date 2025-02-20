function filterPosts(filtermethod) {
    let categories = Array.from(document.querySelectorAll('nav input[type=checkbox]:checked'), elem => elem.value)

    if (logged !== '1' && (filtermethod === "getcreatedposts" || filtermethod === "getlikedposts")) {
        displayToast('var(--red)', 'you need to login!')
        displayPopup("openLogin")

        return
    }
    if (filtermethod === 'filterbycategories' && !categories.length) {
        displayToast('var(--info)', 'please select a category to filter by')
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
        if (logged === '1'){
            checkIfLoggedout(data.Message)
        }

        
        document.querySelector('.dropdown-menu').style.display = "none";
        //list filtered posts
        Array.from(document.querySelectorAll('nav input[type=checkbox]:checked'), elem =>elem.checked = false)
        data.postsremaing ? loadMore.style.display = 'block' : loadMore.style.display = 'none'
        listPosts(data.posts, 'fromFilter')
    }).catch(err => displayToast('var(--red)', err))
}

