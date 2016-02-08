function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

function getInput() {
    var textInput = document.getElementsByClassName("sweet-alert input");
    console.log(textInput);
    var inputValue = textInput[0].value;

    if (inputValue === "") {
        inputValue = 'Anonymous';
    }
    return inputValue;
};


emojify.setConfig({ // Only run emojify.js on this element
    only_crawl_id: null, // Use to restrict where emojify.js applies
    img_dir: 'https://github.global.ssl.fastly.net/images/icons/emoji/', // Directory for emoji images
    ignored_tags: { // Ignore the following tags
        'SCRIPT': 1,
        'TEXTAREA': 1,
        'A': 1,
        'PRE': 1,
        'CODE': 1
    }
});


var socket = io.connect();
var prompt = swal({
    title: "Username please",
    text: "What's your name?",
    type: "input",
    showCancelButton: false,
    closeOnConfirm: true,
    animation: "slide-from-top",
    inputPlaceholder: "What's your name?"
});

/**
 *
 * 
 */

socket.on('connect', function() {
    prompt;
    // call the server-side function 'adduser' and send one parameter (value of prompt)
    var confirm = document.getElementsByClassName("confirm");

    confirm[0].addEventListener('click', getInput);

    socket.emit('adduser', value, getRandomColor());
});


/**
 *
 * 
 */

socket.on('updatechat', function(username, data, colour) {
    $('#conversation').append('<li style="background-color:' + colour + '"><b>' + username + ':</b><p> ' + data + '</p></li>');
    $("#conversation").scrollTop($("#conversation")[0].scrollHeight);
    emojify.run();
});

socket.on('updateusers', function(data) {
    $('#users').empty();
    $.each(data, function(key, value) {
        $('#users').append('<div>' + key + '</div>');
    });
});

socket.on('exit', function(data) {
    log_chat_message(data.message);
});

var nullDiv = $('#users div')

$.each(nullDiv, function(index, value) {
    if (value.innerText === 'null') {
        $(this).hide();
    }
});

$('#datasend').click(function() {
    var message = $('#data').val();
    $('#data').val('');
    // tell server to execute 'sendchat' and send along one parameter
    socket.emit('sendchat', message);
});

// when the client hits ENTER on their keyboard
$('#data').keypress(function(e) {
    if (e.which == 13) {
        $(this).blur();
        $('#datasend').focus().click();
        $('#data').focus();
    }
});