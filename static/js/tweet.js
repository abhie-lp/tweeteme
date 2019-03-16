function loadContent(content_div, get_url) {

    const apiURL = get_url + currentURL.pathname;
    console.log("apiURL: ", apiURL);

    // function to attach the content to the content div
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
                            @${contentUser.username} &middot; 
${time}</span>
                          <p class="tweet-content" data-id="${contentId}">${content}</p>
                          <a class="tweet-detail-link" href="#">View</a> |
                          </div>
                        </div><hr>
                        `;
            if (prepend) {
                $(content_div).prepend(contentHTML);
            } else {
                $(content_div).append(contentHTML);
            }
        })
    }


    // AJAX call to get all the content from the api call

    $.ajax({
        url: apiURL,
        method: "GET",
        success: function(data) {
            console.log("Fetching data successfull");
            console.log(data);
            attachContent(data)
        },
        error: function(err) {
            console.log("errrr");
            console.log(err);
        }
    });


    // AJAX call for tweet-form
    $("#tweet-form").submit(function(e) {
        e.preventDefault();
        const this_ = $(this);
        console.log("Tweeting");

        $.ajax({
            url: apiURL,
            data: this_.serialize(),
            method: "POST",
            success: function(data) {
                console.log("Tweeted");
                attachContent([data], true);
                this_.find("textarea").val("");
            },
            error: function(err) {
                console.log("errrr in tweeting");
                console.log(err);
            }
        })
    });


    // Handle the view click of tweet
    $(document.body).on("click", "a.tweet-detail-link", function(event) {
        event.preventDefault();
        const this_ = $(this);
        console.log("View tweet");

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

                $(".modal").modal();
            },
            error: function(err) {
                console.log("Err in single tweet");
                console.log(err);
            }
        })
    })
}
