var dogeMultipliers = ['such','very','much','so','dat'];
var dogeWords = ['swag','live','delux','intelligence','math','skillz','skills','skill','gud','good','wow','pro','pr0','w0w','1337','leet','l33t','amazing','amaze','points','unstoppable','think','thinkz','thinking','merge','pattern','good jorb','gud jorb','playing','hax','gaming','player','concern','bewildered','game','scores','scoring','#hot','hot','hot right now','matching','matched','fite','neat','wow','#wow',,'natural'];
var dogeWordsLoss = ['#get lost','game over','#game over','#not so wow','#very uncomfortable','idiot','shite','shit','lose','go fuck yourself','cry','gg','GG','lol','rofl','XD'];
var dogeWordsWin = ['swag','pr0','#WOOOOOOW','win','winner','congratz','gg','GG','congratulashuns','shibe leader'];

function display_doge(words)
{
	if (words == null)
		words = dogeWords;
		
	var multiplier = dogeMultipliers[Math.floor(Math.random() * dogeMultipliers.length)];
	var word = words[Math.floor(Math.random() * words.length)];
	
	if (word.substring(0, 1) == '#') {
		word = word.substr(1);
		multiplier = '';
	}
	
	var dogeText = (multiplier.length > 0 ? multiplier + " " : "") + word;
	
	var $doge = $("<span></span>");
	$doge.text(dogeText);
	$doge.css("position", "absolute");
	$doge.css("font-family", "'Comic Sans','Comic Sans MS'");
	$doge.css("font-size", Math.floor(12 + Math.random() * 88) + "px");
	$doge.css("white-space", "nowrap");
	$doge.css("color", "rgb(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + ")");
	$doge.css("text-shadow", "0 0 10px #FFFFFF,0 0 20px #FFFFFF,0 0 30px #FFFFFF");
	$doge.css("z-index", "99999");
	$doge.hide();
	$("body").append($doge);
	$doge.show();
	$doge.css("left", (Math.random() * ($("body").width() - $doge.width())) + "px");
	$doge.css("top", Math.floor(Math.random() * ($("body").height() - $doge.height())) + "px");
	setTimeout(function() { $doge.fadeOut("slow", function() { $(this).remove() }) }, 500);
}

function spam_doge_loss()
{
	for (var i = 0; i < 160; i++)
	{
		setTimeout(function() { display_doge(dogeWordsLoss) }, i * 100 + Math.random() * 200);
	}
}

function spam_doge_win()
{
	for (var i = 0; i < 160; i++)
	{
		setTimeout(function() { display_doge(dogeWordsWin) }, i * 100 + Math.random() * 200);
	}
}