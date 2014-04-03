function KeyLogManager() {
	this.directionString = [ "Up", "Right", "Down", "Left" ];
}

KeyLogManager.prototype.log = function(issuer, direction, valid) {
	$logEntry = $("<div></div>", { class: valid ? "input-item" : "input-item input-item-invalid" });
	$logEntry.append($logUsername = $("<div></div>", { class: "input-username" }));
	$logEntry.append($logKey = $("<div></div>", { class: "input-key" }));
	
	$logUsername.text(issuer);
	$logKey.text(this.directionString[direction]);
	
	$logEntry.hide();
	
	$(".input-container").prepend($logEntry);
	//$logEntry.slideDown("fast");
	$logEntry.show(100);
}

function log_hide_last() {
	$items = $(".input-container > div");
	if ($items.length >= 9) {
		$items.last().hide(100, function() { $(this).remove(); log_hide_last() });
		return;
	}
	
	setTimeout(log_hide_last, 50);
}

$(log_hide_last);

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