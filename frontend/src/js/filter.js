
// radiobtns.forEach(elem => elem.checked ? checked = elem.id : null)


function filterPosts(filtermethod) {
    // document.querySelectorAll('nav checkbox')
    let categories = []

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
            alert('something went wrong:::!!')
            throw new Error('something went wrong:::!!')
        }
        return res.json()
    }).then(data => {
        listPosts(data)
        console.log("get posts", data)
    }).catch(err => console.log(err))
}

