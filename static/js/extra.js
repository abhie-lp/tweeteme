
/* ###################################### COUNT CHARACTERS LEFT ###################################### */
function charsLeft(val) {
    const this_ = $(val);
    const maxChars = 140;
    let charsLeft = maxChars - this_.val().length;
    this_.parent().children(".tweet-characterCount").text(charsLeft);
}


/* ###################################### COLLAPSE NAVBAR ###################################### */
$(document).click(function(e) {
	if (!$(e.target).is('.container')) {
    	$('.collapse').collapse('hide');
    }
});


/* ###################################### HANDLE SEARCH FORM ###################################### */
$("#searchForm").submit(function(e) {
    e.preventDefault();
    const address = window.location;
    const this_ = $(this);
    if (this_.serialize().length > 7) {
        window.location = address.origin + address.pathname + "?" + this_.serialize();
    } else {
        window.location = address.origin + "/";
    }
});


/* ###################################### GET CSRF ###################################### */
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

csrftoken = getCookie('csrftoken');


function userHasLiked(likeArray) {
    let likeText = "Like";
    for (const val of likeArray) {
       if (val == loggedUserID) {
           likeText = "Unlike";
           break;
       }
   }

    return likeText
}
