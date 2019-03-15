function loadContent(content_div, get_url) {


    // function to attach the content to the content div
    function attachContent(data) {
        data.forEach(function(d) {
            const contentId = d.id;
            const content = d.content;
            const contentUser = d.user;
            const time = d.created_on;

            $(content_div).append(`
            <div class="media">
              <div class="media-body">
              <strong>${content}</strong><br>
              <a href="#">View</a> | <a href="#user">${contentUser}</a> | ${time}
              </div>
            </div><hr>
            `)
        })
    }


    // AJAX call to get all the content from the api call
    console.log("API: ", get_url);
    console.log("URL: ", currentURL.pathname);
    $.ajax({
        url: get_url + currentURL.pathname,
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
    })
}