/*
 * content_div - id of the element where the cotent is to be attached
 * get_url - url of the link where the GET request is to made
*/
function loadContent(content_div, get_url) {

    let completeURL = get_url;
    let nextPageURL = null;
    let replyNextpageURL = null;

    if (currentURL.search.length > 8) {
        console.log(currentURL.search);
        completeURL += currentURL.search;
    }

    console.log("completeURL: ", completeURL);


    /* ################################# RETURN TWEET OR RETWEET IN CORRECT FORMAT ########################## */
   function tweetFormat(data) {
       let tweetData = data.tweet;
       let retweetData = null;
       if (data.retweet != null) {
           tweetData = data.retweet.parent_tweet;
           retweetData = data.retweet;
       }

       const tweetId = tweetData.id;
       const tweet = tweetData.content;
       const tweetUser = tweetData.user;
       const tweetTime = tweetData.date_display;
       const tweetLikes = tweetData.likes;
       const tweetLikesCount = tweetLikes.length;
       const tweetRetweetsCount = tweetData.retweets;

       let likeText = "Like";
       for (const val of tweetLikes) {
           if (val == loggedUserID) {
               likeText = "Unlike";
               break;
           }
       }

       const tweetUserSpan = `<a class="text-dark font-weight-bold" href="/${tweetUser.username}/">${tweetUser.get_full_name}</a> <span class="text-muted">@${tweetUser.username}</span>`;
       const tweetTimeSpan = `<span class="text-muted">${tweetTime}</span>`;
       const tweetContentP = `<p class="tweet-content">${tweet}</p>`;
       const tweetViewLink = `<a class="tweet-detail-link" href="">View</a>`;
       const tweetRetweetLink = `<a class="tweet-retweet-link" href="/retweet/">Retweet</a>`;
       const tweetRetweetsCountSpan = `<small class="text-muted"><b>${tweetRetweetsCount}</b></small>`;
       const tweetLikeLink =  `<a class="tweet-like-link" href="/like/">${likeText}</a>`;
       const tweetLikesCountSpan = `<small class="text-muted"><b>${tweetLikesCount}</b></small>`;
       const tweetDeleteLink = `<a class="content-delete-link float-right text-danger" href="/delete/">Delete</a>`;
       let mediaBody = null;

       if (data.retweet != null) {
           const retweetID = retweetData.id;
           const retweetUser = retweetData.user;
           const retweetTime = retweetData.date_display;
           const retweetUserSpan = `<small class="text-muted"><a class="text-muted text-uppercase" href="/${retweetUser.username}/">${retweetUser.get_full_name}</a> Retweeted</small>`;
           const retweetTimeSpan = `<small class="text-muted">${retweetTime}</small>`;
           mediaBody = `
            <div class="media-body" data-type="retweet" data-id="${tweetId}" data-reId="${retweetID}">
              <span class="text-muted">${retweetUserSpan} &middot; ${retweetTimeSpan}</span><br>
              <span class="text-muted">${tweetUserSpan} &middot ${tweetTimeSpan}</span>
              ${tweetContentP}
              ${tweetViewLink} &middot; ${tweetRetweetLink} ${tweetRetweetsCountSpan} &middot; ${tweetLikeLink} ${tweetLikesCountSpan} ${tweetDeleteLink}
            </div>`;
       } else {
           mediaBody = `
           <div class="media-body" data-type="tweet" data-id="${tweetId}">
             <span class="text-muted">${tweetUserSpan} &middot ${tweetTimeSpan}</span>
             ${tweetContentP}
             ${tweetViewLink} &middot; ${tweetRetweetLink} ${tweetRetweetsCountSpan}  &middot ${tweetLikeLink} ${tweetLikesCountSpan} ${tweetDeleteLink}
           </div>`;
       }

       const mediaDiv = `<div class="media">${mediaBody}</div>`;
       return mediaDiv;

   }


    /* ############################ FORMAT OF THE REPLY ##################################### */
   function replyFormat(data) {
       const replyId = data.id;
       const replyUser = data.user;
       const replyContent = data.content;
       const replyTime = data.date_display;
       const replyDeleteLink = `<a class="content-delete-link float-right text-danger" href="/delete/">Delete</a>`;

       const replyUserSpan = `<a class="text-dark font-weight-bold" href="/${replyUser.username}/">${replyUser.get_full_name}</a> <span class="text-muted">@${replyUser.username}</span>`;
       const replyTimeSpan = `<span class="text-muted">${replyTime}</span>`;
       const replyContentP = `<p class="reply-content">${replyContent}</p>`;
       const mediaBody = `
                  <div class="media-body" data-type="reply" data-id="${replyId}">
                    <span class="text-muted">${replyUserSpan} &middot; ${replyTimeSpan}</span>
                    
                    ${replyContentP}
                    ${replyDeleteLink}
                  </div>`;

       const mediaDiv = `<div class="media">${mediaBody}</div><hr style="margin-top: -5px; margin-bottom: 10px;">`;
       return mediaDiv;

   }


    /* ############################ ATTACH CONTENT TO THE CONTAINER ##################################### */
    function attachContent(data, attachLoc=null, isReply=false, prepend=false) {
        let attachLocation = $(content_div);

        if (attachLoc) {
            attachLocation = $(attachLoc);
        }
        let contentHTML = null;

        data.forEach(function(d) {

            if (!isReply){
                contentHTML = tweetFormat(d) + `<hr>`;
            } else {
                contentHTML = replyFormat(d);
            }

            if (prepend) {
                attachLocation.prepend(contentHTML);
            } else {
                attachLocation.append(contentHTML);
            }
        });

        if (isReply && replyNextpageURL) {
            attachLocation.append(`<p><a class="loadmore" href="#loadmore" data-type="reply">Load more</a></p>`);
        }
    }


    /* ########################### GET CONTENT FROM API ############################### */
    $.ajax({
        url: completeURL,
        method: "GET",
        success: function(data) {
            console.log("Fetched ", data.results.length);
            if (data.results.length > 0) {
                if (data.next) {
                    nextPageURL = data.next;
                } else {
                    $(".loadmore").remove();
                }
            } else {
                $(".loadmore").remove();
                $(content_div).html("<p>No content to show</p>");
            }
            attachContent(data.results);
        },
        error: function(err) {
            console.log("errrr");
            console.log(err);
        }
    });


    /* ################################ LOAD MORE ################################## */
    // AJAX to handle loadmore click
    $(document.body).on("click", ".loadmore", function(event) {
        event.preventDefault();

       let loadURL = nextPageURL;
       let isReply = null;
       const this_ = $(this);

       if (this_.attr("data-type") == "reply") {
           isReply = true;
           loadURL = replyNextpageURL;
       }
        console.log("loading more ", this_.attr("data-type"));

       $.ajax(loadURL, {
           method: "GET",
           success: function(data) {
               if (isReply) {
                   this_.remove();
                   replyNextpageURL = data.next;
                   attachContent(data.results, ".modal-detail .modal-footer", true);
               } else {
                   nextPageURL = data.next;
                   attachContent(data.results);
               }
               if (!nextPageURL) {
                   this_.remove();
               }
           },
           error: function(err) {
               console.log("Errrr in loadmore");
               console.log(err);
           }
       })
    });


    /* ###################################### TWEET FORM SUBMIT #################################### */
    $("#tweet-form").submit(function(e) {
        e.preventDefault();
        const this_ = $(this);
        completeURL = get_url + "model/tweet/";

        $.ajax({
            url: completeURL,
            data: this_.serialize(),
            method: "POST",
            success: function(data) {
                console.log("Tweeted");
                attachContent([{"tweet": data}], null, false, true);
                this_.find("textarea").val("");
                this_.children(".tweet-characterCount").text(140);
            },
            error: function(err) {
                console.log("errrr in tweeting");
                console.log(err);
            }
        })
    });


    /* ################################### ALL REPLIES FOR THE TWEET ################################ */
    function getReplies(tweetID) {
        console.log("Getting replies for ", tweetID);
        completeURL = get_url + "model/reply/";

        $.ajax({
            url: completeURL,
            method: "GET",
            data: {"tweet_id": tweetID},
            success: function(data) {
                console.log("Fetched ", data.results.length, " replies");
                const attachLoc = ".modal-detail .modal-footer";
                $(attachLoc).empty();
                replyNextpageURL = data.next;
                attachContent(data.results, attachLoc, true,);
            },
            error: function(err) {
                console.log("Err in fetching replies");
                console.log(err);
            }
        });
    }


    /* ################################### TWEET DETAIL VIEW LINK ###################################### */
    $(document.body).on("click", "a.tweet-detail-link", function(event) {
        event.preventDefault();
        const this_ = $(this);
        const tweetID = this_.parent().attr("data-id");
        completeURL = get_url + "model/tweet/" + tweetID + "/";


        $.ajax({
            url: completeURL,
            method: "GET",
            success: function(data) {
                contentID = tweetID;
                getReplies(tweetID);

                console.log("Fetched single tweet");
                const contentUser = data.user;
                const content = data.content;
                const time = data.created_on;
                const tweetLikesCount = data.likes.length;
                const retweetsCount = data.retweets;

                const modalDetail = $(".modal-detail");

                modalDetail.find(".modal-title").html(`<span class="text-dark">${contentUser.get_full_name}</span><br>
<small class="text-muted font-weight-light">@${contentUser.username}</small><br><span class="font-weight-bold">
${content}</span><br><small class="text-muted">${time}</small>`);

                modalDetail.find("#tweet-retweets").text(retweetsCount);
                modalDetail.find("#tweet-likes").text(tweetLikesCount);
                modalDetail.find("textarea").val("");
                modalDetail.find("span.tweet-characterCount").text(140)

                modalDetail.modal();
            },
            error: function(err) {
                console.log("Err in single tweet");
                console.log(err);
            }
        })
    });


    /* ############################### CONTENT DELETE CLICK ############################### */
    // Handle the tweet delete click
    $(document.body).on("click", "a.content-delete-link", function(event) {
        event.preventDefault();

        const this_ = $(this);
        const thisParent = this_.parent();

        let thisType = thisParent.attr("data-type");
        let thisID = thisParent.attr("data-id");
        contentID = thisID;
        contentType = thisType;

        if (thisType == "retweet") {
            thisID = thisParent.attr("data-reID");
            contentID = thisID;
            thisType = "tweet";
        }

        const thisContent = thisParent.find(`.${thisType}-content`).text();

        const deleteModal = $(".modal-delete");
        const deleteForm = deleteModal.find("form");


        console.log("Delete the ", contentType, contentID, "????");

        deleteModal.find("h5.modal-title").html(`<span class="text-danger font-weight-bold">Delete:</span> <span class="font-weight-bold">${thisContent}</span>`);
        deleteModal.find("button[type=submit]").removeClass("btn-primary").addClass("btn-danger").text("Delete");

        deleteForm.removeClass("retweet");
        deleteForm.addClass("delete");

        deleteModal.modal();
        contentArea = [thisParent.parent(), thisParent.parent().next()];
    });


    /* ################################## DELETE FORM SUBMIT ############################## */
    $(document.body).on("submit", ".modal-delete form.delete", function(e) {
        e.preventDefault();
        const csrf = $(this).children("input").attr("value");
        completeURL = get_url + `model/${contentType}/${contentID}/`;

        $.ajax(completeURL, {
            method: "DELETE",
            headers: {"X-CSRFToken": csrf},
            content: "application/json",
            success: function(data) {
                console.log("Deletion successfull: ", contentID);
                $(".modal-delete").modal("hide");
                contentArea.forEach(function(ele) {
                    ele.remove();
                });
            },
            error: function(err) {
                console.log("Err in deletion");
                console.log(err);
            }
        })
    });


    /* ################################## TWEET RETWEET ############################## */
    $(document.body).on("click", "a.tweet-retweet-link", function(e) {
        e.preventDefault();
        const this_ = $(this);
        const thisParent = this_.parent();
        const thisContent = this_.prev().prev().text();
        const retweetModal = $(".modal-retweet");

        contentID = thisParent.attr("data-id");
        console.log("Retweet " + contentID + "???");

        retweetModal.find("h5.modal-title").html(`<span class="text-primary font-weight-bold">Retweet: </span> <span class="font-weight-bold">${thisContent}</span>`);
        retweetModal.find("button[type=submit]").removeClass("btn-danger").addClass("btn-primary").text("Retweet");
        retweetModal.find("form").removeClass("delete").addClass("retweet");

        retweetModal.modal();
        contentArea = [this_.parent().parent(), this_.parent().parent().next()];
    });


    /* ############################ CONFIRMATION OF RETWEET ##################################### */
    $(document.body).on("submit", ".modal-retweet form.retweet", function(e) {
        e.preventDefault();
        const parent_tweet = contentID;
        const csrf = $(this).children("input").attr("value");
        completeURL = get_url + "model/retweet/";
        $.ajax(completeURL, {
            method: "POST",
            data: $(this).serialize() + "&parent_tweet=" + parent_tweet,
            // headers: {"X-CSRFToken": csrf},
            success: function(data) {
                console.log("Retweeted successfuly");
                attachContent([{"retweet": data}], null, false, true);
                $(".modal-retweet").modal("hide");
            },
            error: function(err) {
                $(".modal-retweet").modal("hide");
                console.log("Err in retweet");
                alert(err.responseJSON);
            }
        })
    });


    /* ################################## TWEET LIKE ############################## */
    $(document.body).on("click", "a.tweet-like-link", function(e) {
        e.preventDefault();
        const this_ = $(this);
        const thisParent = this_.parent();
        const tweetID = thisParent.attr("data-id");
        console.log("Like", tweetID);
        this_.text("Liked");
        completeURL = get_url + `like/${tweetID}/`;
        const likeCount = Number(this_.next().text());

        $.ajax(completeURL, {
            method: "GET",
            success: function(data) {
                if (data.liked) {
                    this_.text("Liked");
                    this_.next().text(likeCount + 1);
                } else {
                    this_.text("Unliked");
                    this_.next().text(likeCount - 1);
                }
            },
            error: function(err) {
                console.log("errr in liking");
                console.log(err);
            }
        })
    });


    /* ################################## REPLY TO A TWEET ############################## */
    $(".modal-detail form").submit(function(e) {
        e.preventDefault();
        console.log("Replying to ", contentID, " tweet");
        completeURL = get_url + "model/reply/";
        const this_ = $(this);
        $.ajax({
            url: completeURL,
            method: "POST",
            data: this_.serialize() + `&tweet_id=${contentID}`,
            success: function(data) {
                console.log("replied successfully");
                attachContent([data], ".modal-detail .modal-footer", true, true);
                this_.children("textarea").val("");
                this_.children("span.tweet-characterCount").text("140")
            },
            error: function(err) {
                console.log("errrrr in reply");
                console.log(err);
            }
        })
    })
}
