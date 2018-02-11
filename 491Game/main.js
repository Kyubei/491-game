var soundOn = true;
var showHitBox = true;

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

function isPlaying(audio) {
    return !audio.paused;
}

/**
 * Checks a collision between two entities, adding a bonus X or Y value to the
 * hitboxes of entity 1 if applicable.
 */
function checkCollision(entity1, entity2, bonusX, bonusY) {
	this.bonusX = bonusX || 0;
	this.bonusY = bonusY || 0;
    if ((entity1.hitBox.x + entity1.hitBox.width + this.bonusX) > entity2.hitBox.x) {
        if (entity1.hitBox.x < (entity2.hitBox.x + entity2.hitBox.width)) {
            if (entity1.hitBox.y < entity2.hitBox.y + entity2.hitBox.height) {
                if (entity1.hitBox.y + entity1.hitBox.height + this.bonusY > entity2.hitBox.y) {
                    return true;
                }
            }
        }
    }
    return false;
}

function getXDistance(entity1, entity2) {
    var distance = 0;
    if (entity1.hitBox.x + entity1.hitBox.width < entity2.hitBox.x) {
        distance = entity1.hitBox.x + entity1.hitBox.width - entity2.hitBox.x;        
    } else if (entity1.hitBox.x > entity2.hitBox.x + entity2.hitBox.width) {
        distance = entity1.hitBox.x - entity2.hitBox.x + entity2.hitBox.width;
    }
    return distance;
};

function drawHitBox(entity, ctx) {
    entity.hitBox = {
    	x: entity.x + entity.hitBoxDef.offsetX + (entity.hitBoxDef.growthX < 0 ? entity.hitBoxDef.growthX : 0), 
		y: entity.y + entity.hitBoxDef.offsetY,
		width: entity.hitBoxDef.width + Math.abs(entity.hitBoxDef.growthX), 
		height: entity.hitBoxDef.height
	};
    
    if (showHitBox) {
        ctx.globalAlpha=0.2;
        var tempStyle = ctx.fillStyle;
        ctx.fillStyle = "black";
        ctx.fillRect(entity.hitBox.x,entity.hitBox.y,entity.hitBox.width,entity.hitBox.height); // Hitbox drawing for testing
        ctx.fillStyle = tempStyle;
        ctx.globalAlpha=1;
    }
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
	this.bottomY = 380;
	this.bottomWidth = 800;
	this.bottomHeight = 120;
	
	this.portraitX = 10;
	this.portraitY = this.bottomY + 10;
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
	
	this.healthX = this.bar1X + 5;
	this.healthY = this.bar1Y + 11;
	this.healthWidth = this.bar1Width - 8;
	this.healthHeight = this.bar1Height - 21;
    
    this.barChangingSpeed = 1;
	
	this.staminaX = this.bar2X + 5;
	this.staminaY = this.bar2Y + 11;
	this.staminaWidth = this.bar2Width - 8;
	this.staminaHeight = this.bar2Height - 21;
    
    this.bossPortraitX = 150;
    this.bossPortraitY = 20;
    this.bossPortraitWidth = 80;
    this.bossPortraitHeight = 80;
    
    this.bossBarX = this.bossPortraitX + this.bossPortraitWidth - 12;
    this.bossBarY = this.bossPortraitY + 15;
    this.bossBarWidth = 400;
    this.bossBarHeight = 50;
    
    this.bossHealthX = this.bossBarX + 10;
    this.bossHealthY = this.bossBarY + 18;
    this.bossHealthWidth = this.bossBarWidth - 20;
    this.bossHealthHeight = this.bossBarHeight - 35;
    
    this.map1BGMusic = new Audio("./sounds/map1BGMusic.mp3");
    this.map1BGMusic.loop = true;
    this.map1BGMusic.volume = 0.1;
    if (soundOn) {
        this.map1BGMusic.play();
    }
	
	Entity.call(this, game, 0, 0);
}

UI.prototype = new Entity();
UI.prototype.constructor = UI;

function updatePlayerResources(entity, ui) {
    if (entity.currentHealth1Temp > entity.currentHealth) {
        entity.currentHealthTemp -= ui.barChangingSpeed;
    }
    if (Math.abs(entity.currentHealthTemp - entity.currentHealth) <= ui.barChangingSpeed) {
        entity.currentHealthTemp = entity.currentHealth;
    }
    if (entity.currentHealth > entity.currentHealthTemp) {
        entity.currentHealthTemp = entity.currentHealth;
    }
    
    if (entity.currentStaminaTemp > entity.currentStamina) {
        entity.currentStaminaTemp -= ui.barChangingSpeed;
    }
    if (Math.abs(entity.currentStaminaTemp - entity.currentStamina) <= ui.barChangingSpeed) {
        entity.currentStaminaTemp = entity.currentStamina;
    }
    if (entity.currentStamina > entity.currentStaminaTemp) {
        entity.currentStaminaTemp = entity.currentStamina;
    }
    if (entity.currentStamina === entity.currentStaminaTemp && entity.currentStamina < entity.maxStamina) {
        entity.currentStamina += entity.staminaRegen;
        entity.currentStaminaTemp = entity.currentStamina;
        if (entity.currentStamina > entity.maxStamina) {
            entity.currentStamina = entity.maxStamina;
            entity.currentStaminaTemp = entity.maxStamina;
        }
    }  
}

UI.prototype.update = function () {  
    updatePlayerResources(this.game.player1, this);
};

UI.prototype.draw = function (ctx) {
    ctx.drawImage(ASSET_MANAGER.getAsset("./img/UI/Bottom.png"), this.bottomX, this.bottomY, this.bottomWidth, this.bottomHeight);
    ctx.drawImage(ASSET_MANAGER.getAsset("./img/UI/BarBack.png"), this.bar1X, this.bar1Y, this.bar1Width, this.bar1Height);
    ctx.drawImage(ASSET_MANAGER.getAsset("./img/UI/HealthBarLight.png"), this.healthX, this.healthY, this.healthWidth * (this.game.player1.currentHealthTemp / this.game.player1.maxHealth), this.healthHeight);
    ctx.drawImage(ASSET_MANAGER.getAsset("./img/UI/HealthBar.png"), this.healthX, this.healthY, this.healthWidth * (this.game.player1.currentHealth / this.game.player1.maxHealth), this.healthHeight);
    ctx.drawImage(ASSET_MANAGER.getAsset("./img/UI/BarBack.png"), this.bar2X, this.bar2Y, this.bar2Width, this.bar2Height);
    ctx.drawImage(ASSET_MANAGER.getAsset("./img/UI/StaminaBarLight.png"), this.staminaX, this.staminaY, this.staminaWidth * (this.game.player1.currentStaminaTemp / this.game.player1.maxStamina), this.staminaHeight);
    ctx.drawImage(ASSET_MANAGER.getAsset("./img/UI/StaminaBar.png"), this.staminaX, this.staminaY, this.staminaWidth * (this.game.player1.currentStamina / this.game.player1.maxStamina), this.staminaHeight);
    ctx.drawImage(ASSET_MANAGER.getAsset("./img/Riven/RivenPortrait.png"), this.portraitX, this.portraitY, this.portraitWidth, this.portraitHeight);
    ctx.drawImage(ASSET_MANAGER.getAsset("./img/UI/BarBack.png"), this.bossBarX, this.bossBarY, this.bossBarWidth, this.bossBarHeight);
    ctx.drawImage(ASSET_MANAGER.getAsset("./img/UI/HealthBar.png"), this.bossHealthX, this.bossHealthY, this.bossHealthWidth, this.bossHealthHeight);
    ctx.drawImage(ASSET_MANAGER.getAsset("./img/Reksai/ReksaiPortrait.png"), this.bossPortraitX, this.bossPortraitY, this.bossPortraitWidth, this.bossPortraitHeight);
    var tempColor = ctx.fillStyle;
    ctx.font = "30px Calibri";
    ctx.fillStyle = "white";
    ctx.fillText("Rek'sai",this.bossPortraitX + 80,45);
    ctx.font = "20px Calibri";
    ctx.fillText("Player1",this.portraitX + 90,this.portraitY + 30);
    ctx.fillText("Player1",this.game.player1.x + 5,this.game.player1.y + 0);
    ctx.fillText("Rek'sai",this.game.currentBoss.x + 50,this.game.currentBoss.y - 5);
    ctx.fillStyle = tempColor;
    Entity.prototype.draw.call(this);	
};

function Platform(game, x, y) {
    this.platformPicture = ASSET_MANAGER.getAsset("./img/UI/Platform.png");
    this.width = 63;
    this.height = 16;
    
    Entity.call(this, game, x, y);
    
    this.hitBoxDef = {
    	width: this.width, height: this.height, offsetX: 0, offsetY: 0, growthX: 0
    };
    this.hitBox = {
    	x: this.x + this.hitBoxDef.offsetX + (this.hitBoxDef.growthX < 0 ? this.hitBoxDef.growthX : 0), 
		y: this.y + this.hitBoxDef.offsetY,
		width: this.hitBoxDef.width + Math.abs(this.hitBoxDef.growthX), 
		height: this.hitBoxDef.height
	};
}

Platform.prototype = new Entity();
Platform.prototype.constructor = Platform;

Platform.prototype.update = function () {
};

Platform.prototype.draw = function (ctx) {
    ctx.drawImage(this.platformPicture, this.x, this.y, this.width, this.height); 
    Entity.prototype.draw.call(this);
}

function Map1(game) {
    Entity.call(this, game, 0, 0);
    this.platforms = [];
    this.platforms.push(new Platform(game, 150, 315));
    this.platforms.push(new Platform(game, 400, 315));
}

Map1.prototype = new Entity();
Map1.prototype.constructor = UI;

Map1.prototype.update = function () {
};

Map1.prototype.draw = function (ctx) {
    this.platforms.forEach(function(currentPlatform) {
        currentPlatform.draw(ctx);
    });
    Entity.prototype.draw.call(this);
}

var COMBO_DROPOFF_TIME = 5;

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
        //this.startAnimation.drawFrame(this.game.clockTick, ctx, this.x + this.startAnimation.offsetX, this.y + this.startAnimation.offsetY);
    } else {
        //this.animation.drawFrame(this.game.clockTick, ctx, this.x + this.animation.offsetX, this.y + this.animation.offsetY);
    }
    Entity.prototype.draw.call(this);
};

function Reksai(game) {
    this.solid = true;
    this.attackable = true;
    this.state = "idle";
    this.walkSpeed = 2;
	this.lastDirection = "Left";
    
	this.idleRight = new Animation(ASSET_MANAGER.getAsset("./img/Reksai/ReksaiIdleRight.png"), 0, 0, 151, 100, 0.1, 10, true, false, 0, 0);
	this.idleLeft = new Animation(ASSET_MANAGER.getAsset("./img/Reksai/ReksaiIdleLeft.png"), 0, 0, 151, 100, 0.1, 10, true, false, 0, 0);

    this.walkAnimationRight = new Animation(ASSET_MANAGER.getAsset("./img/Reksai/ReksaiWalkRight.png"), 0, 0, 192, 107, 0.1, 17, true, false, 0, 0);
    this.walkAnimationLeft = new Animation(ASSET_MANAGER.getAsset("./img/Reksai/ReksaiWalkLeft.png"), 0, 0, 192, 107, 0.1, 17, true, false, 0, 0);
        
    Entity.call(this, game, 600, 295);
    
    this.currentAnimation = this.idleLeft;
    this.hitBoxDef = {
    	width: 150, height: 100, offsetX: 15, offsetY: 0, growthX: 0
    };
    this.hitBox = {
    	x: this.x + this.hitBoxDef.offsetX + (this.hitBoxDef.growthX < 0 ? this.hitBoxDef.growthX : 0),  
		y: this.y + this.hitBoxDef.offsetY,
		width: this.hitBoxDef.width + Math.abs(this.hitBoxDef.growthX), 
		height: this.hitBoxDef.height
	};
}

Reksai.prototype.handleCollision = function(entity) {
	if (entity.attacking) {
		console.log("HIT!");		
	}
}

Reksai.prototype.update = function() {
    var distance = getXDistance(this.game.player1, this);
    if (distance < 0) {
        this.state = "walking";
        this.lastDirection = "Left";
        this.x -= this.walkSpeed;
    } else if (distance > 0) {
        this.state = "walking";
        this.lastDirection = "Right";
        this.x += this.walkSpeed;
    } else {
        this.state = "idle"
    }
    Entity.prototype.update.call(this);
}

Reksai.prototype.draw = function (ctx) {
    if (this.lastDirection === "Right") {
        if (this.state === "idle") {
            this.idleRight.drawFrame(this.game.clockTick, ctx, this.x + this.idleRight.offsetX, this.y + this.idleRight.offsetY);
            this.currentAnimation = this.idleRight;
        } else if (this.state === "walking") {
            this.walkAnimationRight.drawFrame(this.game.clockTick, ctx, this.x + this.walkAnimationRight.offsetX, this.y + this.walkAnimationRight.offsetY);
            this.currentAnimation = this.walkAnimationRight;
        }
    } else {
        if (this.state === "idle") {
            this.idleLeft.drawFrame(this.game.clockTick, ctx, this.x + this.idleLeft.offsetX, this.y + this.idleLeft.offsetY);
            this.currentAnimation = this.idleLeft;
        } else if (this.state === "walking") {
            this.walkAnimationLeft.drawFrame(this.game.clockTick, ctx, this.x + this.walkAnimationLeft.offsetX, this.y + this.walkAnimationLeft.offsetY);
            this.currentAnimation = this.walkAnimationLeft;
        }
    }
    
    this.hitBox = {
    	x: this.x + this.hitBoxDef.offsetX + (this.hitBoxDef.growthX < 0 ? this.hitBoxDef.growthX : 0), 
		y: this.y + this.hitBoxDef.offsetY,
		width: this.hitBoxDef.width + Math.abs(this.hitBoxDef.growthX), 
		height: this.hitBoxDef.height
	};
    
    drawHitBox(this, ctx);
    
    Entity.prototype.draw.call(this);
};

function Character(game) {
    
    // Sounds
    this.footsteps = new Audio("./sounds/footsteps.mp3");
    this.footsteps.loop = true;
    this.footsteps.volume = 0;
    if (soundOn) {
        this.footsteps.play();
    }
    
    // Animations    	
	this.idleAnimation = null;
    this.idleAnimationRight = new Animation(ASSET_MANAGER.getAsset("./img/Riven/RivenIdleRight.png"), 0, 0, 55, 85, 0.1, 12, true, false, 0, 0);
    this.idleAnimationLeft = new Animation(ASSET_MANAGER.getAsset("./img/Riven/RivenIdleLeft.png"), 0, 0, 55, 85, 0.1, 12, true, false, 5, 0);
	this.runAnimation = null;
    this.runAnimationRight = new Animation(ASSET_MANAGER.getAsset("./img/Riven/RivenRunningRight.png"), 0, 0, 79, 80, 0.1, 13, true, false, 5, 5);
    this.runAnimationLeft = new Animation(ASSET_MANAGER.getAsset("./img/Riven/RivenRunningLeft.png"), 0, 0, 79, 80, 0.1, 13, true, false, -20, 5);
    this.jumpAnimation = null;
    this.jumpAnimationRight = new Animation(ASSET_MANAGER.getAsset("./img/Riven/RivenJumpRight.png"), 0, 0, 72, 90, 0.1, 3, false, false, 5, 0);
    this.jumpAnimationLeft = new Animation(ASSET_MANAGER.getAsset("./img/Riven/RivenJumpLeft.png"), 0, 0, 72, 90, 0.1, 3, false, false, -20, 0);

    // Light Attack
    this.attackAnimationLight1Right = new Animation(ASSET_MANAGER.getAsset("./img/Riven/RivenAA1Right.png"), 0, 0, 109, 110, 0.06, 16, false, false, 2, -20);
    this.attackAnimationLight1Left = new Animation(ASSET_MANAGER.getAsset("./img/Riven/RivenAA1Left.png"), 0, 0, 109, 110, 0.06, 16, false, false, -45, -25 + 2);
    this.attackAnimationLight2Right = new Animation(ASSET_MANAGER.getAsset("./img/Riven/RivenAA2Right.png"), 0, 0, 94, 110, 0.06, 12, false, false, 4, 8 + 6);
    this.attackAnimationLight2Left = new Animation(ASSET_MANAGER.getAsset("./img/Riven/RivenAA2Left.png"), 0, 0, 94, 110, 0.06, 12, false, false, -35, 8 + 2);
    this.attackAnimationLight3Right = new Animation(ASSET_MANAGER.getAsset("./img/Riven/RivenAA3Right.png"), 0, 0, 128, 110, 0.06, 13, false, false, -20, -12);
    this.attackAnimationLight3Left = new Animation(ASSET_MANAGER.getAsset("./img/Riven/RivenAA3Left.png"), 0, 0, 138, 110, 0.06, 13, false, false, -55, -17);
    
    // Strong Side Attacks
    this.attackAnimation = null;
    this.attackAnimation1Right = new Animation(ASSET_MANAGER.getAsset("./img/Riven/RivenQ1Right.png"), 0, 0, 92, 110, 0.08, 10, false, false, -18, -29);
    this.attackAnimation1Left = new Animation(ASSET_MANAGER.getAsset("./img/Riven/RivenQ1Left.png"), 0, 0, 92, 110, 0.08, 10, false, false, -18, -29);
    this.attackAnimation2Right = new Animation(ASSET_MANAGER.getAsset("./img/Riven/RivenQ2Right.png"), 0, 0, 123.887, 97, 0.08, 9, false, false, -20, -9);
    this.attackAnimation2Left = new Animation(ASSET_MANAGER.getAsset("./img/Riven/RivenQ2Left.png"), 0, 0, 123.887, 97, 0.08, 9, false, false, -50, -9);
    this.attackAnimation3Right = new Animation(ASSET_MANAGER.getAsset("./img/Riven/RivenQ3Right.png"), 0, 0, 141.665, 123, 0.08, 12, false, false, -20, -30);
    this.attackAnimation3Left = new Animation(ASSET_MANAGER.getAsset("./img/Riven/RivenQ3Left.png"), 0, 0, 141.665, 123, 0.08, 12, false, false, -65, -30);
    
    this.currentAnimation = this.idleAnimationRight; // Setting starting animation
    
    // Variables
    
	this.runSpeed = 3;
	this.jumpSpeed = 0; // X Velocity when jumping
    this.yVelocity = 0;
    this.jumpYVelocity = 9; // Max Y upwards velocity when jumping
    this.gravity = 0.55;
    this.strongAttackCost = 20; // Stamina cost of strong attacks
	this.lastDirection = "Right";
    this.staminaRegen = 0.3;
    
    this.maxHealth = 100.0;
    this.currentHealth = this.maxHealth;
    this.currentHealthTemp = this.currentHealth;
    
    this.maxStamina = 100.0;
    this.currentStamina = this.maxStamina;
    this.currentStaminaTemp = this.currentStamina;
        
    this.attackInput = 0; // Keyboard Input for Attack, 1 = Light, 2 = Strong
	this.attackIndex = 0;
    this.lastComboIndex = 0; // The last combo index (AA, Q, etc)
    this.lastComboStage = 0; // The last stage of your combo (1, 2, 3, etc)
    this.comboTime = 0; // The timer before the combo drops off
    
	this.running = false;
    this.jumping = false;
    this.falling = true;
	this.attacking = false;
    this.ground = 370; 
    
    this.leftDown = false;
    this.rightDown = false;
    this.jumpDown = false;
    
    Entity.call(this, game, 100, 300);
    
    this.hitBoxDef = {
    	width: 45, height: 70, offsetX: 8, offsetY: 10, growthX: 0
    };
    this.hitBox = {
    	x: this.x + this.hitBoxDef.offsetX + (this.hitBoxDef.growthX < 0 ? this.hitBoxDef.growthX : 0), 
		y: this.y + this.hitBoxDef.offsetY,
		width: this.hitBoxDef.width + Math.abs(this.hitBoxDef.growthX), 
		height: this.hitBoxDef.height
	};
}

Character.prototype = new Entity();
Character.prototype.constructor = Character;

Character.prototype.update = function () {
	var that = this;
	if (this.game.r) { // Arrow thing temporary
		if (!this.attacking) {
			//this.attacking = true;
			this.running = false;
			this.game.addEntity(new Arrow(this.x, this.y + 40, this.game));
		}
	}
    if (this.jumpDown && !this.attacking && !this.jumping && !this.falling) {
    	this.jumping = true;
        this.yVelocity = this.jumpYVelocity;
		if (this.rightDown) {
			this.lastDirection = "Right";
			this.jumpSpeed = this.runSpeed;
		} else if (this.leftDown) {
			this.lastDirection = "Left";
			this.jumpSpeed = -this.runSpeed;
		} else {
			this.jumpSpeed = 0;
		}
	}	
    if ((this.rightDown || this.leftDown) && !this.attacking && !this.jumping && !this.falling) {
		this.running = true;
		if (this.rightDown) {
			this.lastDirection = "Right";
		} else if (this.leftDown) {
			this.lastDirection = "Left";
		}
	} else {
		this.running = false;
	}

    this.comboTime -= this.game.clockTick; // Combo Timer
    if (this.comboTime <= 0 && this.lastComboStage > 0) {
    	console.log("Combo stage "+this.lastComboStage+" has dropped off!");
    	this.lastComboStage = 0;
    }
    
    // Process the raw attack input into the appropriate skill
    if (this.attackInput > 0) { 
		switch(this.attackInput) {
			case 1: // Light attack
		    	if (!this.attacking && !this.jumping && !this.falling) {
	    			if (this.lastComboType != this.attackInput) { // Last Combo was different (e.g. AA vs Q) - drop combo
	    				this.lastComboStage = 0;		    				
	    			}
		    		this.attacking = true;
		    		// AA will take attack indexes 4-6
		    		if (this.lastComboStage < 3) {
		    			this.attackIndex = this.lastComboStage + 4;
		    		} else {
		    			this.attackIndex = 4;
                    }
		    		this.lastComboType = this.attackInput;
		    		this.lastComboStage = this.attackIndex - 3;
		    		this.comboTime = COMBO_DROPOFF_TIME;
		    	}
	    	break;
			case 2: // Strong attack
		    	if (!this.attacking && !this.jumping && !this.falling) {
		    		if (this.rightDown || this.leftDown) {
                        if (this.currentStamina >= this.strongAttackCost) {
                            this.currentStamina -= this.strongAttackCost;
                            if (this.lastComboType != this.attackInput) { // Last Combo was different (e.g. AA vs Q) - drop combo
                                this.lastComboStage = 0;		    				
                            }
                            this.attacking = true;
                            // Q will take attack indexes 1, 2, and 3
                            if (this.lastComboStage < 3)
                                this.attackIndex = this.lastComboStage + 1;
                            else
                                this.attackIndex = 1;
                            this.lastComboType = this.attackInput;
                            this.lastComboStage = this.attackIndex;
                            this.comboTime = COMBO_DROPOFF_TIME;
                        }
		    		}
		    	}
	    	break;
		}
    }
	
	if (this.attackIndex > 0) {
		switch(this.attackIndex) {
			case 1: // Strong side attack
		    	if (this.lastDirection === "Right") {
		    		this.attackAnimation = this.attackAnimation1Right;
		    	} else {
		    		this.attackAnimation = this.attackAnimation1Left;
				}
			break;
			case 2:
		    	if (this.lastDirection === "Right") {
		    		this.attackAnimation = this.attackAnimation2Right;
		    	} else {
		    		this.attackAnimation = this.attackAnimation2Left;
				}
			break;
			case 3:
		    	if (this.lastDirection === "Right") {
		    		this.attackAnimation = this.attackAnimation3Right;
		    	} else {
		    		this.attackAnimation = this.attackAnimation3Left;
				}
			break;
			case 4: // Light attack
		    	if (this.lastDirection === "Right") {
		    		this.attackAnimation = this.attackAnimationLight1Right;
		    	} else {
		    		this.attackAnimation = this.attackAnimationLight1Left;
				}
			break;
			case 5:
		    	if (this.lastDirection === "Right") {
		    		this.attackAnimation = this.attackAnimationLight2Right;
		    	} else {
		    		this.attackAnimation = this.attackAnimationLight2Left;
				}
			break;
			case 6:
		    	if (this.lastDirection === "Right") {
		    		this.attackAnimation = this.attackAnimationLight3Right;
		    	} else {
		    		this.attackAnimation = this.attackAnimationLight3Left;
				}
			break;
		}
    	if (this.lastDirection === "Right") {
			this.lastDirection = "Right";
    	} else {
			this.lastDirection = "Left";
		}
	}
	
	// Animation Direction Control
	if (this.lastDirection === "Right") {
    	this.jumpAnimation = this.jumpAnimationRight;
		this.idleAnimation = this.idleAnimationRight;
		this.runAnimation = this.runAnimationRight;
	} else {
		this.jumpAnimation = this.jumpAnimationLeft;
		this.idleAnimation = this.idleAnimationLeft;
		this.runAnimation = this.runAnimationLeft;
	}
	
	if (this.running) {
        this.footsteps.volume = 0.8;
		if (this.lastDirection === "Right") {
			this.x += this.runSpeed;
		} else if (this.lastDirection === "Left") {
			this.x -= this.runSpeed;
		}
	} else if ((this.jumping || this.falling) && !this.attacking) {
		this.x += this.jumpSpeed;
	}
    
    if (!this.running) {
        if (this.footsteps.volume > 0.05) {
            this.footsteps.volume -= 0.05;
        }
        if (this.footsteps.volume <= 0.05) {
            this.footsteps.volume = 0;
            this.currentTime = 0;
        }
    }
    var collision = false;
	if ((this.attackIndex >= 1 && this.attackIndex <= 3) && this.attackAnimation.elapsedTime <= 0.5) { // Q first part - has movement on first half
		if (this.lastDirection === "Right") {
		    this.game.entities.forEach(function(entity) {
		    	if (entity.solid) {
			        if (checkCollision(that, entity, that.runSpeed)) {
			        	collision = true;
			        }
		    	}
		    });
		    if (!collision)
		    	this.x += this.runSpeed;
		} else {
		    this.game.entities.forEach(function(entity) {
		    	if (entity.solid) {
			        if (checkCollision(that, entity, -1 * that.runSpeed)) {
			        	collision = true;
			        }
		    	}
		    });
		    if (!collision)
		    	this.x -= this.runSpeed;
		}
	}
	if (this.attacking) {
	    this.game.entities.forEach(function(entity) {
	    	if (entity.attackable) {
		        if (checkCollision(that, entity)) {
		        	entity.handleCollision(that);
		        }
	    	}
	    });
		if (this.attackIndex >= 1 && this.attackIndex <= 6 && this.attackAnimation.elapsedTime <= 0.5) {
			if (this.lastDirection === "Right") {
	            this.hitBoxDef.growthX += 1.6;
			} else {
	            this.hitBoxDef.growthX -= 1.6;
			}
		}
        if (this.attackAnimation != null && this.attackAnimation.isDone()) {
            this.attackAnimation.elapsedTime = 0;
            this.attacking = false;
			this.attackIndex = 0;
            this.hitBoxDef.growthX = 0; //reset
        }
	}
	
    var platformFound = false; 
    this.game.currentMap.platforms.forEach(function(currentPlatform) {
        if ((that.hitBox.x + that.hitBox.width) > currentPlatform.hitBox.x) {
            if (that.hitBox.x < (currentPlatform.hitBox.x + currentPlatform.hitBox.width)) {
                if ((that.hitBox.y + that.hitBox.height) <= currentPlatform.hitBox.y) {
                    if ((that.hitBox.y + that.hitBox.height - (that.yVelocity - that.gravity )) >= currentPlatform.hitBox.y) {
                        platformFound = true;
                        if (that.falling) {
                            that.falling = false;
                            that.yVelocity = 0;
                            that.y = currentPlatform.hitBox.y - that.hitBox.height - that.hitBoxDef.offsetY;
                        }
                    }
                }
            }
        }
    });
    
    if (!platformFound && !this.jumping) {
        if (!this.falling) {
            this.falling = true;
            if (!this.attacking) {
                if (this.rightDown) {
                    this.lastDirection = "Right";
                    this.jumpSpeed = this.runSpeed;
                } else if (this.leftDown) {
                    this.lastDirection = "Left";
                    this.jumpSpeed = -this.runSpeed;
                } else {
                    this.jumpSpeed = 0;
                }
            }
        }
    }
    
    if (this.jumping || this.falling) {
        this.yVelocity-= this.gravity;  
        this.y -= this.yVelocity;    
    }
    if (this.jumping && this.yVelocity <= 0) {
        this.falling = true;
        this.jumping = false;
    }
    if (this.falling && this.hitBox.y + this.hitBox.height > this.ground) {
        this.yVelocity = 0;
        this.falling = false;
        this.y = this.ground - this.hitBox.height;
    }
    
    if (this.hitBox.x + this.hitBoxDef.width >= this.game.surfaceWidth && this.lastDirection === "Right") {
        this.x = this.game.surfaceWidth - this.hitBoxDef.width - this.hitBoxDef.offsetX;
    }
    if (this.hitBox.x + this.hitBox.width - this.hitBoxDef.width <= 0 && this.lastDirection === "Left") {
        this.x = 0 - this.hitBoxDef.offsetX;
    }
    
    /*
    if (this.jumping) {
    	//console.log("jump = "+this.jumpAnimation.elapsedTime+" out of "+this.jumpAnimation.totalTime);
        //if (this.jumpAnimation.isDone()) {
    	if (this.jumpAnimation.elapsedTime >= this.jumpAnimation.totalTime * 2) {
            this.jumpAnimation.elapsedTime = 0;
            this.jumping = false;
        }
        var jumpDistance = this.jumpAnimation.elapsedTime / (this.jumpAnimation.totalTime * 2);
        var totalHeight = 70;

        if (jumpDistance > 0.5) {
            jumpDistance = 1 - jumpDistance;
		}

        //var height = jumpDistance * 2 * totalHeight; 
        var height = totalHeight*(-4 * (jumpDistance * jumpDistance - jumpDistance));
        this.y = this.ground - height;
    }*/
    Entity.prototype.update.call(this);
};

Character.prototype.draw = function (ctx) {
	if ((this.jumping || this.falling) && !this.attacking) { // Jumping
		this.jumpAnimation.drawFrame(this.game.clockTick, ctx, this.x + this.jumpAnimation.offsetX, this.y + this.jumpAnimation.offsetY, 1, true);
        this.currentAnimation = this.jumpAnimation;        
    } else if (this.attacking && this.attackAnimation != null) { // Attacking
        this.attackAnimation.drawFrame(this.game.clockTick, ctx, this.x + this.attackAnimation.offsetX, this.y + this.attackAnimation.offsetY);
        this.currentAnimation = this.attackAnimation;
    } else if (this.running) { // Running
		this.runAnimation.drawFrame(this.game.clockTick, ctx, this.x + this.runAnimation.offsetX, this.y + this.runAnimation.offsetY);	
        this.currentAnimation = this.runAnimation;
    } else { // Idle
		this.idleAnimation.drawFrame(this.game.clockTick, ctx, this.x + this.idleAnimation.offsetX, this.y + this.idleAnimation.offsetY);
        this.currentAnimation = this.idleAnimation;
    }
    
    drawHitBox(this, ctx);
    
    Entity.prototype.draw.call(this);
};

/*
	Asset manager
*/

var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./img/arrow.png");
ASSET_MANAGER.queueDownload("./img/arrow_start.png");
ASSET_MANAGER.queueDownload("./img/pink_flare.png");
ASSET_MANAGER.queueDownload("./img/small_flare.png");

ASSET_MANAGER.queueDownload("./img/Riven/RivenPortrait.png");
ASSET_MANAGER.queueDownload("./img/Riven/RivenIdleRight.png");
ASSET_MANAGER.queueDownload("./img/Riven/RivenIdleLeft.png");
ASSET_MANAGER.queueDownload("./img/Riven/RivenRunningRight.png");
ASSET_MANAGER.queueDownload("./img/Riven/RivenRunningLeft.png");
ASSET_MANAGER.queueDownload("./img/Riven/RivenQ1Left.png");
ASSET_MANAGER.queueDownload("./img/Riven/RivenQ1Right.png");
ASSET_MANAGER.queueDownload("./img/Riven/RivenQ2Left.png");
ASSET_MANAGER.queueDownload("./img/Riven/RivenQ2Right.png");
ASSET_MANAGER.queueDownload("./img/Riven/RivenQ3Left.png");
ASSET_MANAGER.queueDownload("./img/Riven/RivenQ3Right.png");
ASSET_MANAGER.queueDownload("./img/Riven/RivenAA1Left.png");
ASSET_MANAGER.queueDownload("./img/Riven/RivenAA1Right.png");
ASSET_MANAGER.queueDownload("./img/Riven/RivenAA2Left.png");
ASSET_MANAGER.queueDownload("./img/Riven/RivenAA2Right.png");
ASSET_MANAGER.queueDownload("./img/Riven/RivenAA3Left.png");
ASSET_MANAGER.queueDownload("./img/Riven/RivenAA3Right.png");
ASSET_MANAGER.queueDownload("./img/Riven/RivenJumpLeft.png");
ASSET_MANAGER.queueDownload("./img/Riven/RivenJumpRight.png");

ASSET_MANAGER.queueDownload("./img/Reksai/ReksaiIdleRight.png");
ASSET_MANAGER.queueDownload("./img/Reksai/ReksaiIdleLeft.png");
ASSET_MANAGER.queueDownload("./img/Reksai/ReksaiWalkLeft.png");
ASSET_MANAGER.queueDownload("./img/Reksai/ReksaiWalkRight.png");
ASSET_MANAGER.queueDownload("./img/Reksai/ReksaiPortrait.png");

ASSET_MANAGER.queueDownload("./img/Background.png");
ASSET_MANAGER.queueDownload("./img/UI/Bottom.png");
ASSET_MANAGER.queueDownload("./img/UI/BarBack.png");
ASSET_MANAGER.queueDownload("./img/UI/HealthBar.png");
ASSET_MANAGER.queueDownload("./img/UI/HealthBarLight.png");
ASSET_MANAGER.queueDownload("./img/UI/StaminaBar.png");
ASSET_MANAGER.queueDownload("./img/UI/StaminaBarLight.png");
ASSET_MANAGER.queueDownload("./img/UI/Platform.png");

ASSET_MANAGER.downloadAll(function () {
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');

    var gameEngine = new GameEngine();
    var bg = new Background(gameEngine);
	var reksai = new Reksai(gameEngine);
    var character = new Character(gameEngine);
    var ui = new UI(gameEngine);
    var map1 = new Map1(gameEngine);

    gameEngine.addEntity(bg);
    gameEngine.addEntity(ui);
    gameEngine.addEntity(map1);
    gameEngine.addEntity(character);
    gameEngine.addEntity(reksai);
 
    gameEngine.init(ctx);
    gameEngine.setPlayer1(character);
    gameEngine.setBoss(reksai);
    gameEngine.setMap(map1);
    gameEngine.setUI(ui);
    gameEngine.start();
});