
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
