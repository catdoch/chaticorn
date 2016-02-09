document.addEventListener('DOMContentLoaded', function() {
    onEnter();

    
    /**
     * [description]
     * @param  {[type]} e) {                   if (e.which [description]
     * @return {[type]}    [description]
     */
    function onEnter() {
        var keyPress = document.getElementById('data');
        var dataSend = document.getElementById('datasend');

        keyPress.onkeypress = function(e) {
            if (e.which === 13) {
                this.blur();
                dataSend.onfocus = function() {
                    dataSend.click();
                };

                keyPress.addEventListener("focus");
            }
        };
    }


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


    /**
     * Get Random colour for user session
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
     * [description]
     * @param  {[type]} ) {                   prompt;                $('.confirm').click(function() {            var value [description]
     * @return {[type]}   [description]
     */
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


    /**
     * [description]
     * @param  {[type]} username [description]
     * @param  {[type]} data     [description]
     * @param  {String} colour)  {                   $('#conversation').append('<li style [description]
     * @return {[type]}          [description]
     */
    socket.on('updatechat', function(username, data, colour) {
        $('#conversation').append('<li style="background-color:' + colour + '"><b>' + username + ':</b><p> ' + data + '</p></li>');
        $("#conversation").scrollTop($("#conversation")[0].scrollHeight);
        emojify.run();
    });


    /**
     * [description]
     * @param  {[type]} data) {                   $('#users').empty();        $.each(data, function(key, value) {            $('#users').append('<div>' + key + '</div>');        });    } [description]
     * @return {[type]}       [description]
     */
    socket.on('updateusers', function(data) {
        $('#users').empty();
        $.each(data, function(key, value) {
            $('#users').append('<div>' + key + '</div>');
        });
    });


    /**
     * [description]
     * @param  {[type]} data) {                   log_chat_message(data.message);    } [description]
     * @return {[type]}       [description]
     */
    socket.on('exit', function(data) {
        log_chat_message(data.message);
    });


    /**
     * [clearDivs description]
     * @return {[type]} [description]
     */
    function clearDivs() {
        var nullDiv = $('#users div');

        $.each(nullDiv, function(index, value) {
            if (value.innerText === 'null') {
                $(this).hide();
            }
        });
    }


    /**
     * [description]
     * @param  {[type]} ) {                   var message [description]
     * @return {[type]}   [description]
     */
    $('#datasend').click(function() {
        var message = $('#data').val();
        $('#data').val('');
        // tell server to execute 'sendchat' and send along one parameter
        socket.emit('sendchat', message);
    });


});
