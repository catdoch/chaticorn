$(document).ready(function() {

    function getRandomColor() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    emojify.setConfig({
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

    socket.on('connect', function() {
        prompt;
        // call the server-side function 'adduser' and send one parameter (value of prompt)
        $('.confirm').click(function() {
            var value = $('.sweet-alert input').val();
            if (value === "") {
                value = 'Anonymous';
            }
            socket.emit('adduser', value, getRandomColor());
        });
    });

    socket.on('updatechat', function(username, data, colour) {
        $('#conversation').append('<li style="background-color:' + colour + '"><b>' + username + ':</b><p> ' + data + '</p></li>');
        $("#conversation").scrollTop($("#conversation")[0].scrollHeight);
        emojify.run();
        var myNotification = new NotificationWrapper(
            '#', // image icon path goes here
            'node-webkit is awesome',
            'Especially now that I can use my own sounds',
            '/sounds/notif.wav'
        );

        myNotification.addEventListener('click', function() {
            console.log('You clicked the notification.');
        });
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

    var nullDiv = $('#users div');

    $.each(nullDiv, function(index, value) {
        if (value.innerText === 'null') {
            $(this).hide();
        }
    });

    $('#datasend').click(function() {
        var message = $('#data').val();
        if (message.length) {
            $('#data').val('');
            // tell server to execute 'sendchat' and send along one parameter
            socket.emit('sendchat', message);
        }
    });

    // when the client hits ENTER on their keyboard
    $('#data').keypress(function(e) {
        if (e.which == 13) {
            $(this).blur();
            $('#datasend').focus().click();
            $('#data').focus();
        }
    });
});

/**
 * Use composition to expand capabilities of Notifications feature.
 */
function NotificationWrapper(appIcon, title, description, soundFile) {

    /**
     * A path to a sound file, like /sounds/notification.wav
     */
    function playSound(soundFile) {
        if (soundFile === undefined) return;
        var audio = document.createElement('audio');
        audio.src = soundFile;
        audio.play();
        audio = undefined;
    }

    /**
     * Show the notification here.
     */
    var notification = new window.Notification(title, {
        body: description,
        icon: appIcon
    });

    /**
     * Play the sound.
     */
    playSound(soundFile);

    /**
     * Return notification object to controller so we can bind click events.
     */
    return notification;
}
