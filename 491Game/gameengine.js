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
	this.cameraShakeAmount = 0;
	this.cameraShakeTime = 0;
	this.cameraShakeDecay = 0;
    this.ctx = ctx;
    this.surfaceWidth = this.ctx.canvas.width;
    this.surfaceHeight = this.ctx.canvas.height;
    this.startInput();
    this.timer = new Timer();
    this.player1 = null;
	this.player1AttackIndex = 0; //the actual skill being used
	this.player1AttackInput = 0; //the raw attack input
	this.player1LastLightAttack = 0;
	this.currentPhase = 0;
	this.currentBoss = null;
    this.currentMap = null;
    this.UI = null;
    this.textSpeed = 8;
    this.step = 0;
    this.cameraLock = true;
    this.cameraSpeed = 5;
    this.camera = { //where the camera wants to be
    	x: 0,
    	y: 0,
    	minX: 0,
    	maxX: 0,
    	minY: 0,
    	maxY: 0,
    	width: 800,
    	height: 600
    };
    this.liveCamera = { //where the camera actually is
    	x: 0,
    	y: 0,
    	width: 800,
    	height: 600
    };
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
		} else if (String.fromCharCode(e.which) === 'S') {
			that.player1.downDown = true;
		} else if (String.fromCharCode(e.which) === 'Y') {
			that.player1.attackInput = 1;
		} else if (String.fromCharCode(e.which) === 'U') {
			that.player1.attackInput = 2;
		} else if (String.fromCharCode(e.which) === ' ') {
            that.textSpeed = 3;
        } else if (String.fromCharCode(e.which) === 'À') {
            that.player1.autoDamage = 700;
            that.player1.qDamage = 700;
            that.player1.wDamage = 700;
        }
        if (String.fromCharCode(e.which) === 'T') {
			
        	that.player1.yVelocity = 15;
        	that.player1.bounceTimer = 30;
        	that.player1.jumpSpeed = 0;
            that.player1.jumping = true;
		}
        if (String.fromCharCode(e.which) === 'R') {
			that.r = true;
			console.log("Camera coords: (" + that.camera.x+", "+that.camera.y+")");
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
        if (String.fromCharCode(e.which) === 'S') {
			that.player1.downDown = false;
		}
        if (String.fromCharCode(e.which) === 'Y' || String.fromCharCode(e.which) === 'U') {
			that.player1.attackInput = 0;
		}
        if (String.fromCharCode(e.which) === ' ') {
            that.textSpeed = 8;
        }
        e.preventDefault();
    }, false);
    console.log('Input started');
};

GameEngine.prototype.addEntity = function (entity) {
    //console.log('Added Entity');
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
    this.ctx.translate(-this.liveCamera.x, -this.liveCamera.y);
    for (var i = 0; i < this.entities.length; i++) {
        this.entities[i].draw(this.ctx);
    }
    this.ctx.restore();
};

GameEngine.prototype.cameraShake = function(amount, time) {
	this.cameraShakeAmount = amount;
	this.cameraShakeTime = time;
}

GameEngine.prototype.update = function () {
	this.step++;
	if (this.currentPhase === 6) {
		if (this.step == 100) {
			this.currentPhase = 7;
		}
	}
	if (!this.cameraLock) {
		this.camera.x = this.player1.x - 200;
		this.camera.y = this.player1.y;
		//console.log("Updating camera coords to (" + this.camera.x+", "+this.camera.y+")");
		if (this.camera.x < this.camera.minX) {
			this.camera.x = this.camera.minX;
		}
		if (this.camera.y < this.camera.minY) {
			this.camera.y = this.camera.minY;
		}
		if (this.camera.x > this.camera.maxX) {
			this.camera.x = this.camera.maxX;
		}
		if (this.camera.y > this.camera.maxY) {
			this.camera.y = this.camera.maxY;
		}
		if (this.currentPhase === 10) {
			if (this.step >= 100) {
				this.camera.y = 0 - (this.step - 100) / 2;
			}
		}
		if (this.currentPhase === 17) {
			this.camera.y = -1700 - (this.step - 100) / 2;
		}
	    if (this.liveCamera.x != this.camera.x) {
	    	if (this.liveCamera.x < this.camera.x) {
	    		this.liveCamera.x = Math.min(this.camera.x, this.liveCamera.x + this.cameraSpeed);
	    	} else {
	    		this.liveCamera.x = Math.max(this.camera.x, this.liveCamera.x - this.cameraSpeed);	    		
	    	}
	    }
	    if (this.liveCamera.y != this.camera.y) {
	    	if (this.liveCamera.y < this.camera.y) {
	    		this.liveCamera.y = Math.min(this.camera.y, this.liveCamera.y + this.cameraSpeed);
	    	} else {
	    		this.liveCamera.y = Math.max(this.camera.y, this.liveCamera.y - this.cameraSpeed);	    		
	    	}
	    }
        if (this.currentPhase === 10 && this.camera.y <= -1700) {
            this.currentPhase = 11;
            this.camera.x = 800;
            this.camera.y = -1700;
            this.liveCamera.x = 800;
            this.liveCamera.y = -1700;
            this.cameraLock = true;
        }
        if (this.currentPhase === 17 && this.camera.y <= -5175) {
            this.currentPhase = 18;
            this.camera.x = 800;
            this.camera.y = -5175;
            this.camera.minY = this.camera.y;
            this.camera.maxY = this.camera.y + this.camera.height;
            this.liveCamera.x = 800;
            this.liveCamera.y = -5175;
            this.cameraLock = true;
        }
	}
	//CAMERA SHAKE
	if ((this.currentPhase >= 6 && this.currentPhase <= 10) || this.currentPhase === 17) {
		this.liveCamera.x += -5 + Math.random() * 10;
		this.liveCamera.y += -5 + Math.random() * 10;
	}
	if (this.cameraShakeTime > 0) {
		this.cameraShakeTime--;
		this.cameraShakeAmount -= this.cameraShakeDecay;
		this.liveCamera.x = this.camera.minX -this.cameraShakeAmount / 2 + Math.random() * this.cameraShakeAmount / 2;
		this.liveCamera.y = this.camera.minY + this.cameraShakeAmount / 2 + Math.random() * this.cameraShakeAmount / 2;
		if (this.cameraShakeAmount <= 0) {
			this.cameraShakeTime = 0;
            this.liveCamera.x = this.camera.x;
            this.liveCamera.y = this.camera.y;
		}
	}
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
	/*
    if (this.game.showOutlines && this.radius) {
        this.game.ctx.beginPath();
        this.game.ctx.strokeStyle = "green";
        this.game.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.game.ctx.stroke();
        this.game.ctx.closePath();
    }*/
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
