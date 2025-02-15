$(document).ready(function() {
    $('#linkHistoryPane').hide();
    $('#viewFrame a').click(function(event) {
        $('#linkHistoryPane').show();
        $('#linkHistory').prepend('<li><a href="' + $(this).attr('href') + '">' + $(this).text() + '</a></li>');
    });
});