window.onload = function() {

    // Get references to elements on the page.
    var messageField = $('#message');
    var messagesList = $('#messages');
    var socketStatus = $('#status');

    // Create a new WebSocket
    var socket = new WebSocket('ws://localhost:8080');

    // Show a connected message when the WebSocket is opened.
    socket.onopen = function(e) {
        socketStatus.html('Connected to: ' + e.currentTarget.url);
        socketStatus.addClass('open');
    };

    // Handle any errors that occur.
    socket.onerror = function(error) {
        console.log('WebSocket Error: ' + error);
    };

    $(document).on('submit', '#message-form', function (e) {
        e.preventDefault();

        var message = {message: messageField.val(), from: 'Petter'};

        socket.send(JSON.stringify(message));

        messagesList.append('<li class="sent"><span>Me: </span>' + message['message'] + '</li>');

        messageField.val('');

        return false;
    });

    // Handle messages sent by the server.
    socket.onmessage = function(e) {
        var data = JSON.parse(e.data);
        var sender = data['from'];
        var message = data['message'];
        messagesList.append('<li class="received"><span>'+ sender +': </span>' +
            message + '</li>');
    };

    // Show a disconnected message when the WebSocket is closed.
    socket.onclose = function(event) {
        socketStatus.html('Disconnected from WebSocket.');
        socketStatus.removeClass('open').addClass('closed');
    };

    $(document).on('click', '#close', function (e) {
        e.preventDefault();

        socket.close();

        return false;
    })
};