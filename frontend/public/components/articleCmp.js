import Comment from './commentCmp.js'

export function Article(post, comments) {
  return `
    <article class="post-preview">
      <div class="post-header">
        <h3><a href="#">${post.title}</a></h3>
        <p>By <strong>${post.author}</strong> | Category: <em>${post.categories.map(cat =>
    ` <span> ${cat}</span>`
  )}
        </em> 
        | Posted on: ${post.createdat}</p>
      </div>
      
      <p class="post-snippet">${post.content.length > 100 ? `
        ${post.content.slice(0, 76)}
        <button onclick="popPost(event, '${post.id}')">Read More...
        </button>
        `
      : post.content}
      </p>
      <div class="post-details">
        <button class="btn like-btn" onclick="interact(event, '${post.id}', null, 'like')"><i class="fa fa-thumbs-o-up" style="font-size:18px"></i> Like
          (<span>${post.likes_count}</span>)</button>
        <button class="btn dislike-btn" onclick="interact(event, '${post.id}', null, 'dislike')"><i class="fa fa-thumbs-o-down" style="font-size:18px"></i> Dislike
          ${(post.dislikes_count)}</button>
        <button class="btn comment-btn" onclick="displayComment(event)">💬 Comment</button>
      </div>
      <!-- Comments Section (Initially Hidden) -->
      <div class="container-comment hidden">
        <h2><span>${post.comments_count}</span> Comments</h2>
         ${loadComments(post.id, comments)}
         <div id="Reply-section" class="reply-section">
              <h3>Reply</h3>
              <div class="editor">
                <textarea class="reply-input" placeholder="Add as many details as possible..."></textarea>
              </div>
              <button class="btn send-btn" onclick="postComment(event, '${post.id}')">Send</button>
            </div>
      </div>
    </article>`
}

const loadComments = (postID, comments) => comments.map(com => Comment(postID, com))
// function loadComments(comments) {
//   console.log(comments)
//   return comments.map(com => Comment(com))
// } 