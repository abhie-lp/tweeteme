function loadContent(content_div, get_url) {

    const apiURL = get_url + currentURL.pathname;
    let nextPageURL = null;
    console.log("apiURL: ", apiURL);

    /* ############################ ATTACH CONTENT TO THE CONTAINER ##################################### */
    function attachContent(data, prepend=false) {
        data.forEach(function(d) {
            const contentId = d.id;
            const content = d.content;
            const contentUser = d.user;
            const time = d.date_display;
            let contentHTML = `
                        <div class="media">
                          <div class="media-body">
                           <a class="text-dark font-weight-bold" href="#user">${contentUser.get_full_name}</a> <span 
                           class="text-muted"> 
                            @${contentUser.username} &middot; ${time}</span>
                          <p class="tweet-content" data-id="${contentId}">${content}</p>
                          <a class="tweet-detail-link" href="#">View</a> | <a class="tweet-delete-link float-right text-danger" href="">Delete</a>
                          </div>
                        </div><hr>
                        `;
            if (prepend) {
                $(content_div).prepend(contentHTML);
            } else {
                $(content_div).append(contentHTML);
            }
        });
    }


    /* ########################### GET CONTENT FROM API ############################### */
    $.ajax({
        url: apiURL,
        method: "GET",
        success: function(data) {
            console.log("Fetched ", data.results.length);
            attachContent(data.results)
            if (data.next) {
                nextPageURL = data.next;
            } else {
                $(".loadmore").remove();
            }
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

        $.ajax({
            url: apiURL,
            data: this_.serialize(),
            method: "POST",
            success: function(data) {
                console.log("Tweeted");
                attachContent([data], true);
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

        $.ajax({
            url: apiURL + this_.prev().attr("data-id") + "/",
            method: "GET",
            success: function(data) {
                console.log("Fetched single tweet");
                const contentUser = data.user;
                const content = data.content;
                const time = data.created_on;

                $(".modal .modal-title").html(`<span class="text-dark">${contentUser.get_full_name}</span><br>
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
        contentID = this_.parent().children("p.tweet-content").attr("data-id");
        console.log("Delete the tweet ", contentID, "????");
        const thisContent = this_.parent().find(".tweet-content").text();
        const deleteModal = $(".modal-delete");
        deleteModal.find("h5.modal-title").html(`<span class="text-danger font-weight-bold">Delete:</span> <span class="font-weight-bold">${thisContent}</span>`);
        deleteModal.modal();
        contentArea = [this_.parent().parent(), this_.parent().parent().next()];
    });


    /* ################################## DELETE FORM SUBMIT ############################## */
    $(".modal-delete form").submit(function(event) {
        event.preventDefault();
        const csrf = $(this).children("input").attr("value");

        $.ajax(apiURL + contentID, {
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
    })
}
