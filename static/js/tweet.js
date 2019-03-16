function loadContent(content_div, get_url) {

    const apiURL = get_url + currentURL.pathname;
    console.log("apiURL: ", apiURL);

    // function to attach the content to the content div
    function attachContent(data, prepend=false) {
        data.forEach(function(d) {
            const contentId = d.id;
            const content = d.content;
            const contentUser = d.user;
            const time = d.created_on;
            let contentHTML = `
                        <div class="media">
                          <div class="media-body">
                          <strong>${content}</strong><br>
                          <a href="#">View</a> | <a href="#user">${contentUser}</a> | ${time}
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
}
