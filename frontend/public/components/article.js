import Comment from './comment.js'

export function Article(post){
    return `
    
    <article class="post-preview">
      <div class="post-header">
        <h3><a href="/post/${post.id}">${post.title}</a></h3>
        <p>By <strong>${post.author}</strong> | Category: <em><span>${post.category}</span></em> | Posted on: ${post.date}</p>
      </div>
      <p class="post-snippet">${post.content}</p>
      <button onclick="popPost(${post.id})">Read More</button>
      <a href="" class="btn">Read More</a>
      <div class="post-details">
        <button class="btn like-btn"><i class="fa fa-thumbs-o-up" style="font-size:18px"></i> Like
          (<span>${post.likes}</span>)</button>
        <button class="btn dislike-btn"><i class="fa fa-thumbs-o-down" style="font-size:18px"></i> Dislike
          (${post.dislikes})</button>
        <button class="btn comment-btn" onclick="displayComment(event)">💬 Comment</button>
      </div>
      <!-- Comments Section (Initially Hidden) -->
      <div class="container-comment hidden">
        <h2><span>${post.comments.length}</span> Comments</h2>
         ${loadComments(post.comments)}
      </div>
    </article> `
}


const loadComments = (comments) => comments.map(com => Comment(com))
