var sweetAlert = require('sweetalert');
var $ = require('jquery');
var moment = require('moment');


$(document).ready(function() {

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
     * @return {[type]}
     */
    function getRandomColor() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }


    /**
     * [only_crawl_id description]
     * @type {[type]}
     */
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


    /**
     * @param  {[type]}
     * @return {[type]}
     */
    socket.on('connect', function() {
        prompt;
        // call the server-side function 'adduser' 
        //and send one parameter (value of prompt)

        $('.confirm').click(function() {
            var value = $('.sweet-alert input').val();
            if (value === "") {
                value = 'Anonymous';
            }
            socket.emit('adduser', value, getRandomColor());
        });
    });


    /**
     * @param  {[type]}
     * @param  {[type]}
     * @param  {Date}
     * @return {[type]}
     */
    socket.on('updatechat', function(username, data, colour) {
        var date = new Date();
        var prettyDate = moment(date).format('kk:mm');

        $('#conversation').append('<li style="background-color:' + colour + '"><p><b>' + username + ':</b><p> ' + data + '</p><p class="date">'+ prettyDate +'</p></li>');
        $("#conversation").scrollTop($("#conversation")[0].scrollHeight);
        emojify.run();
    });


    /**
     * @param  {[type]}
     * @return {[type]}
     */
    socket.on('updateusers', function(data) {
        $('#users').empty();
        $.each(data, function(key, value) {
            $('#users').append('<div>' + key + '</div>');
        });
    });


    /**
     * @param  {[type]}
     * @return {[type]}
     */
    socket.on('exit', function(data) {
        log_chat_message(data.message);
    });


    /**
     * [nullDiv description]
     * @type {[type]}
     */
    var nullDiv = $('#users div');

    $.each(nullDiv, function(index, value) {
        if (value.innerText === 'null') {
            $(this).hide();
        }
    });


    /**
     * @param  {[type]}
     * @return {[type]}
     */
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