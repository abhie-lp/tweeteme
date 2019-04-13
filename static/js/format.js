/* ################################# RETURN TWEET OR RETWEET IN CORRECT FORMAT ########################## */
  function tweetFormat(data) {
    let tweetData = data.tweet;
    let retweetData = null;
    if (data.retweet != null) {
      tweetData = data.retweet.parent_tweet;
      retweetData = data.retweet;
    }
    
    const tweetId = tweetData.id;
    let tweet = tweetData.content;
    let tweetUser = tweetData.user;
    const tweetTime = tweetData.date_display;
    const tweetLikes = tweetData.likes;
    const tweetLikesCount = tweetLikes.length;
    const tweetRetweetsCount = tweetData.retweets;
    
    // Update the # or @ words if any
    tweet = updateHashLinks(tweet);
    
    let likeText = userHasLiked(tweetLikes);
    
    const tweetUserSpan = `<a class="text-dark font-weight-bold" href="/user/${tweetUser.username}/">${tweetUser.get_full_name}</a> <span class="text-muted">@${tweetUser.username}</span>`;
    const tweetUserImg = `<img class="mr-3 rounded-circle" width=80px src="${tweetUser.profile_thumb}" alt="User profile pic">`;
    const tweetTimeSpan = `<span class="text-muted">${tweetTime}</span>`;
    let tweetContentP = `<p class="tweet-content">${tweet}</p>`;
    const tweetViewLink = `<a class="tweet-detail-link" href="">View</a>`;
    let tweetRetweetLink = `<a class="tweet-retweet-link" href="/retweet/">Retweet</a>`;
    const tweetRetweetsCountSpan = `<small class="text-muted"><b>${tweetRetweetsCount}</b></small>`;
    let tweetLikeLink =  `<a class="content-like-link" href="/like/">${likeText}</a>`;
    const tweetLikesCountSpan = `<small class="text-muted"><b>${tweetLikesCount}</b></small>`;
    let tweetDeleteLink = `<a class="content-delete-link float-right text-danger" href="/delete/">Delete</a>`;
    let mediaBody = null;
    
    if (!loggedUser) {
      const login_url = "/user/login/";
      tweetRetweetLink = tweetRetweetLink.replace("tweet-retweet-link", "login-to-retweet");
      tweetRetweetLink = tweetRetweetLink.replace("/retweet/", login_url);
      tweetLikeLink = tweetLikeLink.replace("content-like-link", "login-to-like");
      tweetLikeLink = tweetLikeLink.replace("/like/", login_url);
    }
    
    if (data.retweet != null) {
      const retweetID = retweetData.id;
      const retweetUser = retweetData.user;
      const retweetTime = retweetData.date_display;
      const retweetUserSpan = `<small class="text-muted"><a class="text-muted text-uppercase" href="/user/${retweetUser.username}/">${retweetUser.get_full_name}</a> Retweeted</small>`;
      const retweetTimeSpan = `<small class="text-muted">${retweetTime}</small>`;
      
      if (retweetUser.username != loggedUser) {
        tweetDeleteLink = "";
      }
      
      mediaBody = `
            <div class="media-body" data-type="retweet" data-id="${tweetId}" data-reId="${retweetID}">
              <span class="text-muted">${retweetUserSpan} &middot; ${retweetTimeSpan}</span><br>
              <span class="text-muted">${tweetUserSpan} &middot ${tweetTimeSpan}</span>
              ${tweetContentP}
              ${tweetViewLink} &middot; ${tweetRetweetLink} ${tweetRetweetsCountSpan} &middot; ${tweetLikeLink} ${tweetLikesCountSpan} ${tweetDeleteLink}
            </div>`;
    } else {
      
      if (tweetUser.username != loggedUser) {
        tweetDeleteLink = "";
      }
      
      mediaBody = `
           <div class="media-body" data-type="tweet" data-id="${tweetId}">
             <span class="text-muted">${tweetUserSpan} &middot ${tweetTimeSpan}</span>
             ${tweetContentP}
             ${tweetViewLink} &middot; ${tweetRetweetLink} ${tweetRetweetsCountSpan}  &middot ${tweetLikeLink} ${tweetLikesCountSpan} ${tweetDeleteLink}
           </div>`;
    }
    
    const mediaDiv = `<div class="media">${tweetUserImg} ${mediaBody}</div>`;
    return mediaDiv;
    
  }
  
  
  /* ############################ FORMAT OF THE REPLY ##################################### */
  function replyFormat(data) {
    const replyId = data.id;
    const replyUser = data.user;
    let replyContent = data.content;
    const replyTime = data.date_display;
    const replyLikes = data.likes;
    const replyLikesCount = replyLikes.length;
    
    let likeText = userHasLiked(replyLikes);
    
    // Update the # or @ words if any
    replyContent = updateHashLinks(replyContent);
    
    let replyDeleteLink = `<a class="content-delete-link float-right text-danger mb-2 mt-n3" href="/delete/">Delete</a>`;
    let replyLikeLink = `<a class="content-like-link float-left mb-1 mt-n3" href="/like/">${likeText}</a>`;
    const replyLikesCountSpan = `<small class="text-muted float-left mb-1 mt-n3 ml-1"><b>${replyLikesCount}</b></small>`;
    
    const replyUserSpan = `<a class="text-dark font-weight-bold" href="/user/${replyUser.username}/">${replyUser.get_full_name}</a> <span class="text-muted">@${replyUser.username}</span>`;
    const replyUserImg = `<img class="mr-3 rounded-circle" width=80px src="${replyUser.profile_thumb}" alt="User profile pic">`;
    const replyTimeSpan = `<span class="text-muted">${replyTime}</span>`;
    const replyContentP = `<p class="reply-content">${replyContent}</p>`;
    
    if (loggedUser != replyUser.username) {
      replyDeleteLink = "";
    }
    
    if (!loggedUser) {
      replyLikeLink = replyLikeLink.replace("content-like-link", "login-to-like");
      replyLikeLink = replyLikeLink.replace("/like/", "/user/login/");
      
    }
    
    const mediaBody = `
                  <div class="media-body" data-type="reply" data-id="${replyId}">
                    <span class="text-muted">${replyUserSpan} &middot; ${replyTimeSpan}</span>
                    
                    ${replyContentP}
                    ${replyLikeLink} ${replyLikesCountSpan} ${replyDeleteLink}
                  </div>`;
    
    const mediaDiv = `<div class="media">${replyUserImg} ${mediaBody}</div><hr style="margin-top: -5px; margin-bottom: 10px;">`;
    return mediaDiv;
    
  }
