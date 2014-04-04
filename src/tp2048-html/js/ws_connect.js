$(init_ws);

var ws_keepalive = null;

function init_ws() {
	var sock = new WebSocket("ws://localhost:57123/");
	sock.onopen = function ()
	{
		$(".server-disconnected-container").fadeOut("fast", function() {
			$(".container").fadeIn("fast");
		});
	};
	sock.onmessage = function (evt) 
	{ 
        var msg = $.parseJSON(evt.data);
		switch(msg.type)
		{
			case "input":
				if (game != null)
					game.moveRemote(msg.issuer, msg.direction);
				break;
			case "disconnected":
				$(".container").fadeOut("fast", function() {
					$(".chat-disconnected-container").fadeIn("fast");
				});
				break;
			case "connected":
				$(".chat-disconnected-container").fadeOut("fast", function() {
					$(".container").fadeIn("fast");
				});
				break;
		}
	};
	sock.onclose = function ()
	{
		if (ws_keepalive != null)
		{
			clearInterval(ws_keepalive);
			ws_keepalive = null;
		}
		$(".container").fadeOut("fast", function() {
			$(".server-disconnected-container").fadeIn("fast");
		});
		setTimeout(init_ws, 5000);
	};
	ws_keepalive = setInterval(function(){sock.send("{}")}, 5000);
}