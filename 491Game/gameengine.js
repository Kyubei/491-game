// This game shell was happily copied from Googler Seth Ladd's "Bad Aliens" game and his Google IO talk in 2011

window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (/* function */ callback, /* DOMElement */ element) {
                window.setTimeout(callback, 1000 / 60);
            };
})();

function Timer() {
    this.gameTime = 0;
    this.maxStep = 0.05;
    this.wallLastTimestamp = 0;
}

Timer.prototype.tick = function () {
    var wallCurrent = Date.now();
    var wallDelta = (wallCurrent - this.wallLastTimestamp) / 1000;
    this.wallLastTimestamp = wallCurrent;

    var gameDelta = Math.min(wallDelta, this.maxStep);
    this.gameTime += gameDelta;
    return gameDelta;
};

function GameEngine() {
    this.entities = [];
    this.showOutlines = false;
    this.ctx = null;
}

GameEngine.prototype.init = function (ctx) {
    this.ctx = ctx;
    this.surfaceWidth = this.ctx.canvas.width;
    this.surfaceHeight = this.ctx.canvas.height;
    this.startInput();
    this.timer = new Timer();
    this.player1 = null;
	this.player1AttackIndex = 0; //the actual skill being used
	this.player1AttackInput = 0; //the raw attack input
	this.player1LastLightAttack = 0;
	this.currentBoss = null;
    this.currentMap = null;
    this.UI = null;
    console.log("Game initialized");
};

GameEngine.prototype.start = function () {
    console.log("Starting game");
    var that = this;
    (function gameLoop() {
        that.loop();
        requestAnimFrame(gameLoop, that.ctx.canvas);
    })();
};

GameEngine.prototype.startInput = function () {
    console.log("Starting input");
    var that = this;

    this.ctx.canvas.addEventListener("keydown", function (e) {		
		if (String.fromCharCode(e.which) === 'D') { 
			that.player1.rightDown = true;
		} else if (String.fromCharCode(e.which) === 'A') {
			that.player1.leftDown = true;
		} else if (String.fromCharCode(e.which) === 'W') {
			that.player1.jumpDown = true;
		} else if (String.fromCharCode(e.which) === 'Y') {
			that.player1.attackInput = 1;
		} else if (String.fromCharCode(e.which) === 'U') {
			that.player1.attackInput = 2;
		}
        if (String.fromCharCode(e.which) === 'R') {
			that.r = true;
		}
        e.preventDefault();
    }, false);
    this.ctx.canvas.addEventListener("keyup", function (e) {
        if (String.fromCharCode(e.which) === 'D') {
			that.player1.rightDown = false;
		}
        if (String.fromCharCode(e.which) === 'A') {
			that.player1.leftDown = false;
		}
        if (String.fromCharCode(e.which) === 'W') {
			that.player1.jumpDown = false;
		}
        if (String.fromCharCode(e.which) === 'Y' || String.fromCharCode(e.which) === 'U') {
			that.player1.attackInput = 0;
		}
        e.preventDefault();
    }, false);
    console.log('Input started');
};

GameEngine.prototype.addEntity = function (entity) {
    console.log('Added Entity');
    this.entities.push(entity);
};

GameEngine.prototype.setPlayer1 = function (entity) {
    this.player1 = entity;
};

GameEngine.prototype.setBoss = function (entity) {
    this.currentBoss = entity;
};

GameEngine.prototype.setMap = function (entity) {
    this.currentMap = entity;
};

GameEngine.prototype.setUI = function (entity) {
    this.UI = entity;
};

GameEngine.prototype.draw = function () {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctx.save();
    for (var i = 0; i < this.entities.length; i++) {
        this.entities[i].draw(this.ctx);
    }
    this.ctx.restore();
};

GameEngine.prototype.update = function () {
    var entitiesCount = this.entities.length;
    for (var i = 0; i < entitiesCount; i++) {
        var entity = this.entities[i];
        if (!entity.removeFromWorld) {
            entity.update();
        }
    }
    for (var i = this.entities.length - 1; i >= 0; --i) {
        if (this.entities[i].removeFromWorld) {
            this.entities.splice(i, 1);
        }
    }
};

GameEngine.prototype.loop = function () {
    this.clockTick = this.timer.tick();
    this.update();
    this.draw();
    this.space = null;
	this.r = null;
};

function Entity(game, x, y) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.removeFromWorld = false;
}

Entity.prototype.update = function () {
};

Entity.prototype.draw = function (ctx) {
    if (this.game.showOutlines && this.radius) {
        this.game.ctx.beginPath();
        this.game.ctx.strokeStyle = "green";
        this.game.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.game.ctx.stroke();
        this.game.ctx.closePath();
    }
};

Entity.prototype.rotateAndCache = function (image, angle) {
    var offscreenCanvas = document.createElement('canvas');
    var size = Math.max(image.width, image.height);
    offscreenCanvas.width = size;
    offscreenCanvas.height = size;
    var offscreenCtx = offscreenCanvas.getContext('2d');
    offscreenCtx.save();
    offscreenCtx.translate(size / 2, size / 2);
    offscreenCtx.rotate(angle);
    offscreenCtx.translate(0, 0);
    offscreenCtx.drawImage(image, -(image.width / 2), -(image.height / 2));
    offscreenCtx.restore();
    //offscreenCtx.strokeStyle = "red";
    //offscreenCtx.strokeRect(0,0,size,size);
    return offscreenCanvas;
};
