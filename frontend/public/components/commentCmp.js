export default function Comment({author, date, content, dislikes}){
return    `
    <section class="comments">
            <div class="comment">
              <div class="comment-header">
                <img src="./Unknown_person.jpg" alt="User Avatar" class="user-avatar">
                <div class="comment-details">
                  <p><strong>${author}</strong> <span class="user-role">New Member</span> • 4 replies</p>
                  <p class="comment-time">${date}</p>
                </div>
              </div>
              <div class="comment-body">
                <p>${content}</p>
              </div>
              <div id="Comment-footer" class="comment-footer">
                <p>1 person likes this</p>
                <button id="Like" class="btn"><i class="fa fa-thumbs-o-up" style="font-size:18px"></i> Like</button>
                <button id="DisLike" class="btn"><i class="fa fa-thumbs-o-down" style="font-size:18px"></i> Dislike
                  (${dislikes})</button>
              </div>
            </div>
            <!-- Reply Section -->
            
          </section>
  `
}