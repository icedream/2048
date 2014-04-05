function KeyLogManager() {
}

KeyLogManager.prototype.directionString =  [ "Up &#8593;", "Right &#8594;", "Down &#8595;", "Left &#8592;" ];
KeyLogManager.prototype.scoreTable = {};

KeyLogManager.prototype.resetScores = function() {
	this.scoreTable = {};
}

KeyLogManager.prototype.addScore = function(username, score) {
	if (this.scoreTable[username] == null)
	{
		this.scoreTable[username] = score;
	} else {
		this.scoreTable[username] += score;
	}
};

KeyLogManager.prototype.getScores = function() {
	var sortable = [];
	for (var username in this.scoreTable)
		sortable.push([username, this.scoreTable[username]])
	sortable.sort(function(a, b) {return b[1] - a[1]});
	return sortable;
};

KeyLogManager.prototype.log = function(issuer, direction, valid, merges) {
	$logEntry = $("<div></div>", { class: valid ? "input-item" : "input-item input-item-invalid" });
	$logEntry.append($logUsername = $("<div></div>", { class: "input-username" }));
	$logEntry.append($logKey = $("<div></div>", { class: "input-key" }));
	
	$logUsername.text(issuer);
	$logKey.html(this.directionString[direction]);
	
	$logEntry.hide();
	
	if (merges != null)
	{
		var score = 0;
		
		merges = merges.sort(function(a,b){return b-a}); // descending sort
		
		for (var i = 0; i < merges.length; i++)
		{
			var mergeVal = merges[i];
			score += mergeVal;
			
			if ($logUsername.children(".input-badge-" + mergeVal).length == 0)
			{
				$logBadge = $("<span></span>", { class: "input-badge input-badge-" + mergeVal });
				$logBadge.append("<span></span>");
				$logBadge.append("<span></span>");
				$logBadgeValue = $logBadge.children("span").first();
				$logBadgeValue.text(mergeVal);
				$logUsername.append($logBadge);
			} else {
				$logBadge = $logUsername.find(".input-badge-" + mergeVal);
				$logBadgeMultiplier = $logBadge.children("span").last();
				var counter = 2;
				if ($logBadgeMultiplier.text().length > 0)
				{
					counter = int($logBadgeMultiplier.text().substr(1)) + 1;
				}
				$logBadgeMultiplier.text("x" + counter);
			}
			
		}
		
		this.addScore(issuer, score);
	}
	
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