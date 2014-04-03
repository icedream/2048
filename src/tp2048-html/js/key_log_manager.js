function KeyLogManager() {
	this.directionString = [ "Up &#8593;", "Right &#8594;", "Down &#8595;", "Left &#8592;" ];
}

KeyLogManager.prototype.log = function(issuer, direction, valid) {
	$logEntry = $("<div></div>", { class: valid ? "input-item" : "input-item input-item-invalid" });
	$logEntry.append($logUsername = $("<div></div>", { class: "input-username" }));
	$logEntry.append($logKey = $("<div></div>", { class: "input-key" }));
	
	$logUsername.text(issuer);
	$logKey.html(this.directionString[direction]);
	
	$logEntry.hide();
	
	$(".input-container").prepend($logEntry);
	log_hide_last();
	//$logEntry.slideDown("fast");
	$logEntry.slideDown(150);
	//$logEntry.show();
	
}

function log_hide_last() {
	$items = $(".input-container > div");
	if ($items.length == 14) {
		$items.last().slideUp(150, function() { $(this).remove(); log_hide_last() });
		return;
	} else if ($items.length > 14) {
		$items.last().hide(0, function() { $(this).remove(); log_hide_last(); });
		return;
	}
	
	setTimeout(log_hide_last, 50);
}

$(log_hide_last);