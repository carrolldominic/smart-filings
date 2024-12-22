console.log('deez nuts');
$(document).ready(function() {
    $('#viewFrame a').click(function(event) {
        $('#linkHistory').prepend('<li><a href="' + $(this).attr('href') + '">' + $(this).text() + '</a></li>');
    });
});