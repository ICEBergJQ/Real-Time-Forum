export default function Comment({author, createdat, content, likes,replycount, likesCount, dislikes}){
return    `
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
                <p>${likesCount} person likes this</p>
                <button id="Like" class="btn"><i class="fa fa-thumbs-o-up" style="font-size:18px"></i> Like
                (${likes})</button>
                <button id="DisLike" class="btn"><i class="fa fa-thumbs-o-down" style="font-size:18px"></i> Dislike
                  (${dislikes})</button>
              </div>
            </div>
            <!-- Reply Section -->
            
          </section>
  `
}