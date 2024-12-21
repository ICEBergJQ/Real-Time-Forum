import Comment from './commentCmp.js'

export function Article(post) {
  return `
    <article class="post-preview">
      <div class="post-header">
        <h3><a href="#">${post.title}</a></h3>
        <p>By <strong>${post.author}</strong> | Category: <em><span>${post.category}</span></em> | Posted on: ${post.date}</p>
      </div>
      <p class="post-snippet">${post.content.length > 100 ? post.content.slice(0,76) : null}...
      <button onclick="popPost(event, ${post.id})">Read More</button>
      </p>
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
         <div id="Reply-section" class="reply-section">
              <h3>Reply</h3>
              <div class="editor">
                <textarea class="reply-input" placeholder="Add as many details as possible..."></textarea>
              </div>
              <button class="btn send-btn">Send</button>
            </div>
      </div>
    </article>`
}

const loadComments = (comments) => comments.map(com => Comment(com))