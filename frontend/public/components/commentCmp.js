export default function Comment(postID, { id, author,reaction, createdat, content, likescount, dislikescount }) {
  return `
    <section class="comments">
            <div class="comment card-content">
              <div class="comment-header">
                <img src="./static/src/Unknown_person.jpg" alt="User Avatar" class="user-avatar">
                <div class="comment-details"><p><strong>${author}</strong> <span class="user-role"></span></p><p class="comment-time time">${createdat}</p>
                </div>
              </div>
              <div class="comment-body">
                <pre>${content}</pre>
              </div>
              <div id="Comment-footer" class="comment-footer">
                <button id="Like"  onclick="interact(event,'${postID}', '${id}', 'like')" class="btn ${reaction == "like"? 'liked' : ''}">
                <i class="fa fa-thumbs-o-up" style="font-size:18px"></i> Like
          (<span>${likescount}</span>)
                </button>
                <button id="DisLike " onclick="interact(event,'${postID}','${id}', 'dislike')" class="btn dislike-btn  ${reaction == "dislike" ? 'disliked' : ''}">
                <i class="fa fa-thumbs-o-down" style="font-size:18px"></i> Dislike
                  (<span>${dislikescount}</span>)
                  </button>
              </div>
            </div>
            <!-- Reply Section -->
            
          </section>
  `
}