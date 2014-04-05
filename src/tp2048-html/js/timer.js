function Timer() {
}

Timer.prototype.timerCurrent = 0;

function analyzeMilliseconds(ms) {
  var d, h, m, s;
  s = Math.floor(ms / 1000);
  m = Math.floor(s / 60);
  s = s % 60;
  h = Math.floor(m / 60);
  m = m % 60;
  d = Math.floor(h / 24);
  h = h % 24;
  return { days: d, hours: h, mins: m, secs: s };
}

function millisecondsToHumanReadableTime(ms) {
	var timeObj = analyzeMilliseconds(ms);
	timeObj.days = timeObj.days > 0 ? timeObj.days + ":" : "";
	timeObj.hours = timeObj.hours > 0 ? (timeObj.hours < 10 ? "0" : "") + timeObj.hours + ":" : "";
	timeObj.mins = (timeObj.mins < 10 ? "0" : "") + timeObj.mins + ":";
	timeObj.secs = (timeObj.secs < 10 ? "0" : "") + timeObj.secs;
	return timeObj.days + timeObj.hours + timeObj.mins + timeObj.secs;
}

Timer.prototype.setTime = function(ms) {
	var timeStr = millisecondsToHumanReadableTime(ms);
	
	$("div.time-container").text(timeStr);
};

Timer.prototype.resetTimer = function() {
	this.timerCurrent = 0;
};

Timer.prototype.stopTimer = function() {
	if (this.timerHandle == null)
		return;
	clearInterval(this.timerHandle);
	this.timerHandle = null;
	$("div.time-container").fadeOut("fast");
};

Timer.prototype.startTimer = function() {
	if (this.timerHandle != null)
		return;
	this.timerHandle = setInterval(this.increaseTime, 1000);
	$("div.time-container").fadeIn("fast");
};

Timer.prototype.increaseTime = function() {
	if (this.timerCurrent == null)
		this.timerCurrent = 0;
	this.timerCurrent += 1000;
	var timeStr = millisecondsToHumanReadableTime(this.timerCurrent);
	
	$("div.time-container").text(timeStr);
};