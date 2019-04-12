
/* ###################################### COUNT CHARACTERS LEFT ###################################### */
function charsLeft(val) {
    const this_ = $(val);
    const maxChars = 140;
    let charsLeft = maxChars - this_.val().length;
    this_.closest("form").children(".tweet-characterCount").text(charsLeft);
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
        window.location = address.origin + "?" + this_.serialize();
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


/* ###################################### HANDLE THE FOLLOW CLICK ###################################### */
function followUser(inst, from_suggestion=false) {
    console.log("Follow request");
    const this_ = $(inst);
    const user = this_.prev().text().slice(1,);
    const followersCount = $("#followers-count");
    let completeURL = currentURL.pathname + "follow/";
    
    if (from_suggestion) {
        const thisHref = this_.parent().find("a").attr("href");
        completeURL = thisHref + "follow/";
        console.log(completeURL);
    }
    
    $.ajax({
        url: completeURL,
        method: "GET",
        success: function(data) {
            if (data.follow_status) {
                this_.text("Followed");
                followersCount.text(Number(followersCount.text()) + 1);
            } else {
                this_.text("Unfollowed");
                followersCount.text(Number(followersCount.text()) - 1);
            }
            console.log("Successfully followed", user);
        },
        error: function(err) {
            console.log("errrr in following");
            console.log(err)
        }
    })
}


/* ###################################### PARSE THE CONTENT WITH # and @ ###################################### */
function updateHashLinks(text){
  let hashtagRegex = /(^|\s+)#([\w\d-]+)/g;
  let usernameRegex = /(^|\s)@([\w\d-]+)/g;
  let newText;
  newText = text.replace(hashtagRegex, "$1<a href='/tag/$2/'>#$2</a>");
  newText = newText.replace(usernameRegex, "$1@<a href='/user/$2/'>$2</a>");
  return newText;
}
