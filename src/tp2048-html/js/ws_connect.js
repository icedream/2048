$(function() {
	var sock = new WebSocket("ws://localhost:19661/");
	sock.onmessage = function (evt) 
	{ 
        var msg = $.parseJSON(evt.data);
		if (game != null)
			game.moveRemote(msg.issuer, msg.direction);
	};
	setInterval(function(){sock.send("{}")}, 5000);
});