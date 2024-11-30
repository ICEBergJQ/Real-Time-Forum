
///filter drop down
const category = document.querySelector('.category')
///filter btn
const filter = document.querySelector('.filter')
const main = document.querySelector('.main')
const radiobtns = document.querySelectorAll('[type=radio]')

const posts = []
let checked = ''

radiobtns.forEach(elem => elem.checked ? checked = elem.id : null)

filter.onclick = () => {
    let filteredPosts = []

    if (checked === "likes") {

        filteredPosts = posts.sort(function (a, b) { return a.likes - b.likes });
        listFilteredPosts(filteredPosts)
    } else if (checked === 'date') {
        filteredPosts = posts.sort((a, b) => {
            return new Date(a) - new Date(b)
        })
    } else if (checked === "category") {

        posts.filter((elem) => {
            elem.category === category.value ? filteredPosts.push(elem) : null
        })
    }


    //remove prev content
    main.innerHTML = ''
    listFilteredPosts(filteredPosts)


}


function listFilteredPosts(posts) {

    posts.forEach(elem => {

        const post = create("div", "post")

        const title = create("h2", "title", elem.title)
        const content = create("p", "content", elem.content)
        const details = create("p")

        ///datails
        const cat = create("span", "category", elem.category)
        const craetedAt = create("span", "date", elem.craetedAt)
        details.appendChild(cat)
        details.appendChild(craetedAt)

        post.appendChild(title)
        post.appendChild(content)
        post.appendChild(details)

        main.appendChild(post)
    })
}


function create(tag, className, content) {
    const element = document.createElement(tag)
    element.classList.add(className)
    element.textContent = content


    return element
}
