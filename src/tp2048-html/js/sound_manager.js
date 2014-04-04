function SoundManager(assetsPath) {
	if (assetsPath == undefined || assetsPath == null)
		assetsPath = "assets/";
	
	manifest = [
		{ id: "move", src: "move.ogg" },
		{ id: "move_invalid", src: "move_invalid.ogg" },
		{ id: "tileup_4", src: "tileup_4.ogg" },
		{ id: "tileup_8", src: "tileup_8.ogg" },
		{ id: "tileup_16", src: "tileup_16.ogg" },
		{ id: "tileup_32", src: "tileup_32.ogg" },
		{ id: "tileup_64", src: "tileup_64.ogg" },
		{ id: "tileup_128", src: "tileup_128.ogg" },
		{ id: "tileup_256", src: "tileup_256.ogg" },
		{ id: "tileup_512", src: "tileup_512.ogg" },
		{ id: "tileup_1024", src: "tileup_1024.ogg" },
		{ id: "insert_tile", src: "insert_tile.ogg" },
		{ id: "countdown_tick", src: "countdown_tick.ogg" },
		{ id: "restart", src: "restart.ogg" },
		{ id: "bgmusic", src: "bgmusic.ogg" }
	];
	
	preload = new createjs.LoadQueue(true, assetsPath);
	preload.installPlugin(createjs.Sound);
	preload.addEventListener("complete", this.doneLoading);
	preload.loadManifest(manifest);
}

SoundManager.prototype.doneLoading = function() {
	createjs.Sound.play("bgmusic", {interrupt:createjs.Sound.INTERRUPT_NONE, loop:-1, volume:0.3});
};

SoundManager.prototype.play = function(soundId) {
	createjs.Sound.play(soundId);
};
