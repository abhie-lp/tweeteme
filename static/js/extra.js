
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
        window.location = address.origin + "/tweet/";
    }
});
