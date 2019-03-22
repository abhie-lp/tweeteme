/*
 * content_div - id of the element where the cotent is to be attached
 * get_url - url of the link where the GET request is to made
*/
function loadContent(content_div, get_url) {

    let completeURL = get_url;
    let nextPageURL = null;

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

       const tweetUserSpan = `<a class="text-dark font-weight-bold" href="/${tweetUser.username}/">${tweetUser.get_full_name}</a> <span class="text-muted">@${tweetUser.username}</span>`;
       const tweetTimeSpan = `<span class="text-muted">${tweetTime}</span>`;
       const tweetContentP = `<p class="tweet-content">${tweet}</p>`;
       const tweetViewLink = `<a class="tweet-detail-link" href="">View</a>`;
       const tweetRetweetLink = `<a class="tweet-retweet-link" href="/retweet/">Retweet</a>`;
       const tweetDeleteLink = `<a class="tweet-delete-link float-right text-danger" href="/delete/">Delete</a>`;
       let mediaBody = null;

       if (data.retweet != null) {
           const retweetID = retweetData.id;
           const retweetUser = retweetData.user;
           const retweetTime = retweetData.date_display;
           const retweetUserSpan = `<small class="text-muted"><a class="text-muted text-uppercase" href="/${retweetUser.username}/">${retweetUser.get_full_name}</a> Retweeted</small>`;
           const retweetTimeSpan = `<small class="text-muted">${retweetTime}</small>`;
           mediaBody = `
            <div class="media-body" data-tweet="${tweetId}" data-retweet="${retweetID}">
              <span class="text-muted">${retweetUserSpan} &middot; ${retweetTimeSpan}</span><br>
              <span class="text-muted">${tweetUserSpan} &middot ${tweetTimeSpan}</span>
              ${tweetContentP}
              ${tweetViewLink} &middot; ${tweetRetweetLink} ${tweetDeleteLink}
            </div>`;
       } else {
           mediaBody = `
           <div class="media-body" data-tweet="${tweetId}">
             <span class="text-muted">${tweetUserSpan} &middot ${tweetTimeSpan}</span>
             ${tweetContentP}
             ${tweetViewLink} &middot; ${tweetRetweetLink} ${tweetDeleteLink}
           </div>`;
       }

       const mediaDiv = `<div class="media">${mediaBody}</div>`;
       return mediaDiv;

   }


    /* ############################ ATTACH CONTENT TO THE CONTAINER ##################################### */
    function attachContent(data, prepend=false) {
        data.forEach(function(d) {

            let contentHTML = tweetFormat(d) + `<hr>`;
            if (prepend) {
                $(content_div).prepend(contentHTML);
            } else {
                $(content_div).append(contentHTML);
            }
        });
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
    $(".loadmore").click(function(event) {
        event.preventDefault();
       console.log("loading more");

       $.ajax(nextPageURL, {
           method: "GET",
           success: function(data) {
               attachContent(data.results);
               nextPageURL = data.next;
               if (!nextPageURL) {
                   $(".loadmore").remove();
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
                attachContent([{"tweet": data}], true);
                this_.find("textarea").val("");
                this_.children(".tweet-characterCount").text(140);
            },
            error: function(err) {
                console.log("errrr in tweeting");
                console.log(err);
            }
        })
    });


    /* ################################### TWEET DETAIL VIEW LINK ###################################### */
    $(document.body).on("click", "a.tweet-detail-link", function(event) {
        event.preventDefault();
        const this_ = $(this);
        completeURL = get_url + "model/tweet/" + this_.parent().attr("data-tweet") + "/";

        $.ajax({
            url: completeURL,
            method: "GET",
            success: function(data) {
                console.log("Fetched single tweet");
                const contentUser = data.user;
                const content = data.content;
                const time = data.created_on;

                $(".modal-detail .modal-title").html(`<span class="text-dark">${contentUser.get_full_name}</span><br>
<small class="text-muted font-weight-light">@${contentUser.username}</small><br><span class="font-weight-bold">
${content}</span><br><small class="text-muted">${time}</small>`);

                $(".modal-detail").modal();
            },
            error: function(err) {
                console.log("Err in single tweet");
                console.log(err);
            }
        })
    });


    /* ############################### CONTENT DELETE CLICK ############################### */
    // Handle the tweet delete click
    $(document.body).on("click", "a.tweet-delete-link", function(event) {
        event.preventDefault();
        const this_ = $(this);
        const thisParent = this_.parent();
        const thisContent = thisParent.find(".tweet-content").text();
        const deleteModal = $(".modal-delete");
        const deleteForm = deleteModal.find("form");

        contentID = this_.parent().attr("data-tweet");
        let isRetweet = false;

        if (thisParent.attr("data-retweet")) {
            contentID = thisParent.attr("data-retweet");
            isRetweet = true
        }
        console.log("Delete the tweet ", contentID, "????");

        deleteModal.find("h5.modal-title").html(`<span class="text-danger font-weight-bold">Delete:</span> <span class="font-weight-bold">${thisContent}</span>`);
        deleteModal.find("button[type=submit]").removeClass("btn-primary").addClass("btn-danger").text("Delete");

        deleteForm.removeClass("retweet");
        deleteForm.addClass("delete");
        if (isRetweet) {
            deleteForm.attr("action", "retweet");
        } else {
            deleteForm.attr("action", "tweet")
        }

        deleteModal.modal();
        contentArea = [thisParent.parent(), thisParent.parent().next()];
    });


    /* ################################## DELETE FORM SUBMIT ############################## */
    $(document.body).on("submit", ".modal-delete form.delete", function(e) {
        e.preventDefault();
        const csrf = $(this).children("input").attr("value");
        const actionVal = $(this).attr("action");
        console.log(csrf);
        completeURL = get_url + `model/${actionVal}/${contentID}/`;

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

        contentID = thisParent.attr("data-tweet");
        console.log("Retweet " + contentID + "???");

        retweetModal.find("h5.modal-title").html(`<span class="text-primary font-weight-bold">Retweet: </span> <span class="font-weight-bold">${thisContent}</span>`);
        retweetModal.find("button[type=submit]").removeClass("btn-danger").addClass("btn-primary").text("Retweet");
        retweetModal.find("form").removeClass("delete").addClass("retweet");

        retweetModal.modal();
        contentArea = [this_.parent().parent(), this_.parent().parent().next()];
    });


    $(document.body).on("submit", ".modal-retweet form.retweet", function(e) {
        e.preventDefault();
        const parent_tweet = contentID;
        console.log(parent_tweet);
        const csrf = $(this).children("input").attr("value");
        completeURL = get_url + "model/retweet/";
        $.ajax(completeURL, {
            method: "POST",
            data: $(this).serialize() + "&parent_tweet=" + parent_tweet,
            // headers: {"X-CSRFToken": csrf},
            success: function(data) {
                console.log("Retweeted successfuly");
                attachContent([{"retweet": data}], true);
                $(".modal-retweet").modal("hide");
            },
            error: function(err) {
                console.log("Err in retweet");
                console.log(err);
            }
        })
    });
}
