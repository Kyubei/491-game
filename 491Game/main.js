function Animation(spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse, offsetX, offsetY) {
    this.spriteSheet = spriteSheet;
    this.startX = startX;
    this.startY = startY;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.reverse = reverse;
	this.offsetX = offsetX || 0;
	this.offsetY = offsetY || 0;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y, scaleBy, linger) {
	var linger = linger || false;
    var scale = scaleBy || 1;
    this.elapsedTime += tick;
    if (this.loop) {
        if (this.isDone()) {
            this.elapsedTime = 0;
        }
    } else if (this.isDone() && !linger) {
        return;
    }
    var index = this.reverse ? this.frames - this.currentFrame() - 1 : this.currentFrame();
    var vindex = 0;
    if (linger) { //stay on the last frame
        if (index >= this.frames)
        	index = this.frames - 1;
    }
    if ((index + 1) * this.frameWidth + this.startX > this.spriteSheet.width) {
        index -= Math.floor((this.spriteSheet.width - this.startX) / this.frameWidth);
        vindex++;
    }
    while ((index + 1) * this.frameWidth > this.spriteSheet.width) {
        index -= Math.floor(this.spriteSheet.width / this.frameWidth);
        vindex++;
    }

    var locX = x;
    var locY = y;
    var offset = vindex === 0 ? this.startX : 0;
    ctx.drawImage(this.spriteSheet,
                  index * this.frameWidth + offset, vindex * this.frameHeight + this.startY,  // source from sheet
                  this.frameWidth, this.frameHeight,
                  locX, locY,
                  this.frameWidth * scale,
                  this.frameHeight * scale);
};

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
};

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
};

function Background(game) {
    Entity.call(this, game, 0, 0);
}

Background.prototype = new Entity();
Background.prototype.constructor = Background;

Background.prototype.update = function () {
};

Background.prototype.draw = function (ctx) {
    ctx.drawImage(ASSET_MANAGER.getAsset("./img/Background.png"), 0, 0);
    Entity.prototype.draw.call(this);
};

function UI(game) {
	this.bottomX = 0;
	this.bottomY = 280;
	this.bottomWidth = 800;
	this.bottomHeight = 120;
	
	this.portraitX = 0;
	this.portraitY = 300;
	this.portraitWidth = 100;
	this.portraitHeight = 100;
	
	this.bar1X = this.portraitX + this.portraitWidth - 20;
	this.bar1Y = this.portraitY + 25;
	this.bar1Width = 150;
	this.bar1Height = 30;
	
	this.bar2X = this.portraitX + this.portraitWidth - 20;
	this.bar2Y = this.portraitY + 45;
	this.bar2Width = 150;
	this.bar2Height = 30;
	
	this.health1X = this.bar1X + 5;
	this.health1Y = this.bar1Y + 11;
	this.health1Width = this.bar1Width - 8;
	this.health1Height = this.bar1Height - 21;
	
	this.stamina1X = this.bar2X + 5;
	this.stamina1Y = this.bar2Y + 11;
	this.stamina1Width = this.bar2Width - 8;
	this.stamina1Height = this.bar2Height - 21;
	
	Entity.call(this, game, 0, 0);
}

UI.prototype = new Entity();
UI.prototype.constructor = UI;

UI.prototype.update = function () {
};

UI.prototype.draw = function (ctx) {
    ctx.drawImage(ASSET_MANAGER.getAsset("./img/UI/Bottom.png"), this.bottomX, this.bottomY, this.bottomWidth, this.bottomHeight);
    ctx.drawImage(ASSET_MANAGER.getAsset("./img/UI/BarBack.png"), this.bar1X, this.bar1Y, this.bar1Width, this.bar1Height);
    ctx.drawImage(ASSET_MANAGER.getAsset("./img/UI/HealthBar.png"), this.health1X, this.health1Y, this.health1Width * (this.game.player1Health / this.game.player1MaxHealth), this.health1Height);
    ctx.drawImage(ASSET_MANAGER.getAsset("./img/UI/BarBack.png"), this.bar2X, this.bar2Y, this.bar2Width, this.bar2Height);
    ctx.drawImage(ASSET_MANAGER.getAsset("./img/UI/StaminaBar.png"), this.stamina1X, this.stamina1Y, this.stamina1Width * (this.game.player1Stamina / this.game.player1MaxStamina), this.stamina1Height);
    ctx.drawImage(ASSET_MANAGER.getAsset("./img/Riven/RivenPortrait.png"), this.portraitX, this.portraitY, this.portraitWidth, this.portraitHeight);
    Entity.prototype.draw.call(this);	
};

var ARROW_PART_MAIN = 1;
var ARROW_PART_SECONDARY = 2;

function Particle(particleId, x, y, minHSpeed, maxHSpeed, minVSpeed, maxVSpeed,
	gravity, friction, width, maxLife, fadeIn, fadeOut, maxAlpha, alphaVariance, shrink, game, anim) {
	this.particleId = particleId;
	this.GRAVITY_CAP = 6;
	this.animation = anim;
	this.hSpeed = maxHSpeed - (Math.random() * (maxHSpeed - minHSpeed));
	this.vSpeed = maxVSpeed - (Math.random() * (maxVSpeed - minVSpeed));
	this.gravity = gravity;
	this.friction = friction; //horizontal friction only
	this.life = 0;
	this.maxLife = maxLife;
	this.fadeIn = fadeIn;
	this.fadeOut = fadeOut;
	this.shrink = shrink;
	this.sizeScale = 1;
	this.maxAlpha = maxAlpha + Math.random() * (alphaVariance * 2) - alphaVariance;
	if (fadeIn > 0)
		this.alpha = 0;
	else
		this.alpha = maxAlpha;
    Entity.call(this, game, x + Math.random() * (width * 2) - width, y + Math.random() * (width * 2) - width);
}

Particle.prototype = new Entity();
Particle.prototype.constructor = Particle;

Particle.prototype.update = function() {
	if (this.particleId === ARROW_PART_MAIN) {
		/*this.game.addEntity(new Particle(ARROW_PART_SECONDARY, this.x + 20, this.y + 20, 3, -3, 3, 0,
			0, 0, 0, 10, 10, 10, 1, 0, true, this.game,
		new Animation(ASSET_MANAGER.getAsset("./img/small_flare.png"), 0, 0, 12, 12, 1, 1, false, false, 0, 0)));*/
	}
	if (this.life < this.fadeIn) {
		this.alpha = this.life / this.fadeIn;
	}
	if (this.life > this.maxLife) {
		this.alpha = 1 - ((this.life - this.maxLife) / this.fadeOut);
	}
	if (this.life > this.maxLife + this.fadeOut) {
		this.removeFromWorld = true;	
	}
	if (this.shrink) {
		this.sizeScale = 1 - this.life / (this.maxLife + this.fadeOut);
	}
	if (this.hSpeed > 0) {
		this.hSpeed -= this.friction;
		if (this.hSpeed <= 0)
			this.hSpeed = 0;
	}
	if (this.hSpeed < 0) {
		this.hSpeed += this.friction;
		if (this.hSpeed >= 0)
			this.hSpeed = 0;
	}
	this.vSpeed += this.gravity;
	if (this.vSpeed > this.GRAVITY_CAP)
		this.vSpeed = this.GRAVITY_CAP;
	this.x += this.hSpeed;
	this.y += this.vSpeed;
	if (this.y >= 600)
		this.removeFromWorld = true;
	this.life++;
    Entity.prototype.update.call(this);
};

Particle.prototype.draw = function (ctx) {
	ctx.globalAlpha = this.alpha * this.maxAlpha;
    this.animation.drawFrame(this.game.clockTick, ctx, this.x + this.animation.offsetX,
		this.y + this.animation.offsetY, this.sizeScale, this.sizeScale);
    Entity.prototype.draw.call(this);
	ctx.globalAlpha = 1;
};


function Arrow(x, y, game) {
    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/arrow.png"), 0, 0, 184, 29, 0.1, 1, true, false, 0, 0);
    this.startAnimation = new Animation(ASSET_MANAGER.getAsset("./img/arrow_start.png"), 0, 0, 184, 29, 0.05, 10, false, false, 0, 0);
	this.starting = true;
	this.travelX = 0;
    Entity.call(this, game, x, y);
}

Arrow.prototype = new Entity();
Arrow.prototype.constructor = Arrow;

Arrow.prototype.update = function() {
	if (this.starting) {
        if (this.startAnimation.isDone()) {
            this.startAnimation.elapsedTime = 0;
            this.starting = false;
        }
	}
	
	this.game.addEntity(new Particle(ARROW_PART_MAIN, this.x + this.travelX, this.y - 10, 0.2, -0.2, 0.2, -0.2, 0, 0, 5, 5, 10, 50, 0.7, 0.2, true, this.game,
		new Animation(ASSET_MANAGER.getAsset("./img/pink_flare.png"), 0, 0, 64, 64, 0.03, 16, true, false, 0, 0)));
	if (!this.starting) {
		this.x += 12;
		this.travelX += 6;
	}
	if (this.x >= 850)
		this.removeFromWorld = true;
	
    Entity.prototype.update.call(this);
};

Arrow.prototype.draw = function (ctx) {
    if (this.starting) {
        this.startAnimation.drawFrame(this.game.clockTick, ctx, this.x + this.startAnimation.offsetX, this.y + this.startAnimation.offsetY);
    } else {
        this.animation.drawFrame(this.game.clockTick, ctx, this.x + this.animation.offsetX, this.y + this.animation.offsetY);
    }
    Entity.prototype.draw.call(this);
};

function Character(game) {
    this.idleRight = new Animation(ASSET_MANAGER.getAsset("./img/Riven/RivenIdleRight.png"), 0, 0, 55, 85, 0.1, 12, true, false, 0, 0);
    this.idleLeft = new Animation(ASSET_MANAGER.getAsset("./img/Riven/RivenIdleLeft.png"), 0, 0, 55, 85, 0.1, 12, true, false, 0, 0);
    this.runAnimationRight = new Animation(ASSET_MANAGER.getAsset("./img/Riven/RivenRunningRight.png"), 0, 0, 79, 80, 0.1, 13, true, false, 0, 5);
    this.runAnimationLeft = new Animation(ASSET_MANAGER.getAsset("./img/Riven/RivenRunningLeft.png"), 0, 0, 79, 80, 0.1, 13, true, false, 0, 5);
    
    this.jumpAnimation = null;
    this.jumpAnimationRight = new Animation(ASSET_MANAGER.getAsset("./img/Riven/RivenJumpRight.png"), 0, 0, 101, 105, 0.1, 3, false, false, -20, -10);
    this.jumpAnimationLeft = new Animation(ASSET_MANAGER.getAsset("./img/Riven/RivenJumpLeft.png"), 0, 0, 101, 105, 0.1, 3, false, false, -20, -10);

    this.attackAnimation = null;
    
    //light attack combo 1
    this.attackAnimation1Right = new Animation(ASSET_MANAGER.getAsset("./img/Riven/RivenQ1Right.png"), 0, 0, 92, 110, 0.1, 10, false, false, -18, -29);
    this.attackAnimation1Left = new Animation(ASSET_MANAGER.getAsset("./img/Riven/RivenQ1Left.png"), 0, 0, 92, 110, 0.1, 10, false, false, -18, -29);
    
    this.lockDirection = 0; //0 = right, 1 = left
	this.running = false;
    this.jumping = false;
	this.attacking = false;
	this.attackIndex = 0;
    this.radius = 0;
    this.ground = 200;
    Entity.call(this, game, 100, 200);
}

Character.prototype = new Entity();
Character.prototype.constructor = Character;

Character.prototype.update = function () {
    //if (this.game.space) this.jumping = true; //i don't have the jump animation! so we'll leave this out
	if (this.game.r) {
		if (!this.attacking) {
			this.attacking = true;
			this.running = false;
			this.game.addEntity(new Arrow(this.x, this.y + 40, this.game));
		}
	}
    if ((this.game.player1Right || this.game.player1Left) && !this.attacking) {
		this.running = true;
	}
	if (this.game.player1AttackIndex > 0) { //certain skills can break movement
		switch(this.game.player1AttackIndex) {
			case 1: //light attack
				if (!this.attacking && !this.jumping) { //no attacking in the air... for now
					this.attacking = true;
					this.running = false;
			    	if (this.game.player1LastDirection === "Right")
			    		this.attackAnimation = this.attackAnimation1Right;
			    	else
			    		this.attackAnimation = this.attackAnimation1Left;
					this.attackIndex = this.game.player1AttackIndex;
					this.lockDirection = this.game.player1LastDirection === "Right" ? 0 : 1;
				}
			break;
		}
	}
    if (this.game.player1Jump && !this.attacking && !this.jumping) { //todo - add a floor check. jumping currently does not work with collisions.
    	if (this.game.player1LastDirection === "Right")
    		this.jumpAnimation = this.jumpAnimationRight;
    	else
    		this.jumpAnimation = this.jumpAnimationLeft;
    	this.jumping = true;
	}
	if (this.game.player1RightUp && this.game.player1LeftUp) {
		this.running = false;
	}
		//console.log("Running: " + this.running + " | Right: " + this.game.right + " | Left: " + this.game.left + " | RightUp: " + this.game.rightUp + " | LeftUp: " + this.game.leftUp);
		
	if (this.running) {
		if (this.game.player1Right) {
			this.x += 3;
		} else if (this.game.player1Left) {
			this.x -= 3;
		}
	}
	if (this.attackIndex === 1 && this.attackAnimation.elapsedTime <= 0.5) { //q first part - has movement on first half
		if (this.lockDirection === 0) {
			this.x += 4;
		} else {
			this.x -= 4;
		}
	}
	if (this.attacking) {
        if (this.attackAnimation.isDone()) {
            this.attackAnimation.elapsedTime = 0;
            this.attacking = false;
            this.attackIndex = 0;
        }
	}
    if (this.jumping) {
    	console.log("jump = "+this.jumpAnimation.elapsedTime+" out of "+this.jumpAnimation.totalTime);
        //if (this.jumpAnimation.isDone()) {
    	if (this.jumpAnimation.elapsedTime >= this.jumpAnimation.totalTime * 2) {
            this.jumpAnimation.elapsedTime = 0;
            this.jumping = false;
        }
        var jumpDistance = this.jumpAnimation.elapsedTime / (this.jumpAnimation.totalTime * 2);
        var totalHeight = 50;

        if (jumpDistance > 0.5)
            jumpDistance = 1 - jumpDistance;

        //var height = jumpDistance * 2 * totalHeight;
        var height = totalHeight*(-4 * (jumpDistance * jumpDistance - jumpDistance));
        this.y = this.ground - height;
    }
    Entity.prototype.update.call(this);
};

Character.prototype.draw = function (ctx) {
	if (this.jumping) {
		this.jumpAnimation.drawFrame(this.game.clockTick, ctx, this.x + this.jumpAnimation.offsetX, this.y + this.jumpAnimation.offsetY, 1, true);
    } else if (this.attacking) {
        this.attackAnimation.drawFrame(this.game.clockTick, ctx, this.x + this.attackAnimation.offsetX, this.y + this.attackAnimation.offsetY);
    } else if (this.running) {
		if (this.game.player1Right) {			
			this.runAnimationRight.drawFrame(this.game.clockTick, ctx, this.x + this.runAnimationRight.offsetX, this.y + this.runAnimationRight.offsetY);		
		} else if (this.game.player1Left) {
			this.runAnimationLeft.drawFrame(this.game.clockTick, ctx, this.x + this.runAnimationLeft.offsetX, this.y + this.runAnimationLeft.offsetY);
		}
    } else { //idle
		if (this.game.player1LastDirection === "Right") {
			this.idleRight.drawFrame(this.game.clockTick, ctx, this.x + this.idleRight.offsetX, this.y + this.idleRight.offsetY);
		} else {
			this.idleLeft.drawFrame(this.game.clockTick, ctx, this.x + this.idleLeft.offsetX, this.y + this.idleLeft.offsetY);
		}
    }
    Entity.prototype.draw.call(this);
};

// the "main" code begins here

var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./img/arrow.png");
ASSET_MANAGER.queueDownload("./img/arrow_start.png");
ASSET_MANAGER.queueDownload("./img/pink_flare.png");
ASSET_MANAGER.queueDownload("./img/small_flare.png");
ASSET_MANAGER.queueDownload("./img/Riven/RivenIdleRight.png");
ASSET_MANAGER.queueDownload("./img/Riven/RivenIdleLeft.png");
ASSET_MANAGER.queueDownload("./img/Riven/RivenRunningRight.png");
ASSET_MANAGER.queueDownload("./img/Riven/RivenRunningLeft.png");
ASSET_MANAGER.queueDownload("./img/Riven/RivenQ1Left.png");
ASSET_MANAGER.queueDownload("./img/Riven/RivenQ1Right.png");
ASSET_MANAGER.queueDownload("./img/Riven/RivenJumpLeft.png");
ASSET_MANAGER.queueDownload("./img/Riven/RivenJumpRight.png");
ASSET_MANAGER.queueDownload("./img/Background.png");
ASSET_MANAGER.queueDownload("./img/UI/Bottom.png");
ASSET_MANAGER.queueDownload("./img/Riven/RivenPortrait.png");
ASSET_MANAGER.queueDownload("./img/UI/BarBack.png");
ASSET_MANAGER.queueDownload("./img/UI/HealthBar.png");
ASSET_MANAGER.queueDownload("./img/UI/StaminaBar.png");

ASSET_MANAGER.downloadAll(function () {
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');

    var gameEngine = new GameEngine();
    var bg = new Background(gameEngine);
    var character = new Character(gameEngine);
    var ui = new UI(gameEngine);

    gameEngine.addEntity(bg);
    gameEngine.addEntity(character);
    gameEngine.addEntity(ui);
 
    gameEngine.init(ctx);
    gameEngine.start();
});