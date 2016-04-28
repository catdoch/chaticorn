/**
 * Set requires for this file
 */
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
     * Get random colour
     * to assign to user
     * @return colour
     */
    function getRandomColour() {
        var letters = '0123456789ABCDEF'.split('');
        var colour = '#';
        for (var i = 0; i < 6; i++) {
            colour += letters[Math.floor(Math.random() * 16)];
        }
        return colour;
    }


    /**
     * Set config for emojis
     * including img dir
     */
    emojify.setConfig({
        only_crawl_id: null, // Use to restrict where emojify.js applies
        img_dir: 'https://github.global.ssl.fastly.net/images/icons/emoji/',
        ignored_tags: { // Ignore the following tags
            'SCRIPT': 1,
            'TEXTAREA': 1,
            'A': 1,
            'PRE': 1,
            'CODE': 1
        }
    });


    /**
     * On socket connect launch
     * alert box for username
     * Emit add user to chat and assign
     * colour
     */
    socket.on('connect', function() {
        prompt;
        // call the server-side function 'adduser' 
        $('.confirm').click(function() {
            var value = $('.sweet-alert input').val();
            if (value === "") {
                value = 'Anonymous';
            }
            socket.emit('adduser', value, getRandomColour());
        });
    });


    /**
     * @param  {username}
     * @param  {data} - text value
     * @param  {colour} - user colour
     * @return append of html
     */
    socket.on('updatechat', function(username, data, colour) {
        var date = new Date();
        var prettyDate = moment(date).format('kk:mm');

        $('#conversation').append('<li style="background-color:' + colour + '"><p><b>' + username + ':</b><p> ' + data + '</p><p class="date">'+ prettyDate +'</p></li>');
        $("#conversation").scrollTop($("#conversation")[0].scrollHeight);
        emojify.run();
    });


    /**
     * Update users and add to html
     * @param  {data}
     * @return append user to html
     */
    socket.on('updateusers', function(data) {
        $('#users').empty();
        $.each(data, function(key, value) {
            $('#users').append('<div>' + key + '</div>');
        });
    });


    /**
     * On socket disconnect log
     * message to chat
     * @param  {data}
     * @return log message
     */
    socket.on('exit', function(data) {
        log_chat_message(data.message);
    });


    /**
     * If user div is empty
     * hide from list
     */
    var nullDiv = $('#users div');

    $.each(nullDiv, function(index, value) {
        if (value.innerText === 'null') {
            $(this).hide();
        }
    });


    /**
     * On button click send data
     * and emit message
     */
    $('#datasend').click(function() {
        var message = $('#data').val();
        if (message.length) {
            $('#data').val('');
            // tell server to execute 'sendchat' and
            // send along one parameter
            socket.emit('sendchat', message);
        }
    });


    /**
     * On enter send data
     * and emit message and 
     * refocus
     */
    $('#data').keypress(function(e) {
        if (e.which == 13) {
            $(this).blur();
            $('#datasend').focus().click();
            $('#data').focus();
        }
    });
});