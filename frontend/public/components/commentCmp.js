export default function Comment(postID, { id, author, createdat, content, replycount, likescount, dislikescount }) {
  return `
    <section class="comments">
            <div class="comment">
              <div class="comment-header">
                <img src="./Unknown_person.jpg" alt="User Avatar" class="user-avatar">
                <div class="comment-details">
                  <p><strong>${author}</strong> <span class="user-role">New Member</span> • ${replycount} replies</p>
                  <p class="comment-time">${createdat}</p>
                </div>
              </div>
              <div class="comment-body">
                <p>${content}</p>
              </div>
              <div id="Comment-footer" class="comment-footer">
                <p>${likescount} person likes this</p>
                <button id="Like"  onclick="interact(event,'${postID}', '${id}', 'like')" class="btn">
                <i class="fa fa-thumbs-o-up" style="font-size:18px"></i> Like
          (<span>${likescount}</span>)
                </button>
                <button id="DisLike " onclick="interact(event,'${postID}','${id}', 'dislike')" class="btn dislike-btn">
                <i class="fa fa-thumbs-o-down" style="font-size:18px"></i> Dislike
                  (<span>${dislikescount}</span>)
                  </button>
              </div>
            </div>
            <!-- Reply Section -->
            
          </section>
  `
}