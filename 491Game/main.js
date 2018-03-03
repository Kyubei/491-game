/**
    Variables for testing
*/

var soundOn = true;
var showHitBox = false;
var testingMode = false; // W damage = 700

/**
    General Variables
*/

// Booleans
var musicFadingOut = false;
var musicFadingIn = false;
// Numbers
var bossMusicVolume = 0.1;
var COMBO_DROPOFF_TIME = 5;
var IMG_PART = 1;
var PART_SECONDARY = 2;
var TEXT_PART = 3;
var SHAPE_PART = 4;
var VOID_BALL = 5;
var PART_GENERATOR = 6;
var VOID_PORTAL = 7;
var VOID_ERUPTION = 8;
var IMG_FLASH_PART = 9;
var BURROW_PART = 10;
var VOID_STORM = 11;
var VOID_GOOP = 12;
// Sounds
var bossMusic = new Audio("./sounds/map1BGMusic.mp3");
bossMusic.loop = true;
bossMusic.volume = bossMusicVolume;
var climbMusic = new Audio("./sounds/malz.mp3");
climbMusic.loop = true;
climbMusic.volume = 0.2;
var earthRumble = new Audio("./sounds/earth_rumble.wav");
earthRumble.loop = true;
earthRumble.volume = 0.4;
var healSound = new Audio("./sounds/heal.wav");
healSound.volume = 0.1;
var reksaiProjectileSound = new Audio("./sounds/rekProjHit.wav");
reksaiProjectileSound.volume = 0.1;
var lightningSound = new Audio("./sounds/lightning.wav");
lightningSound.volume = 0.1;
var hitSound = new Audio("./sounds/punch.mp3");
hitSound.volume = 0.5;
var voidlingDeathSound = new Audio("./sounds/Death.mp3");
voidlingDeathSound.volume = 0.1;
var screamSound = new Audio("./sounds/rekScream.wav");
screamSound.volume = 0.1;
var shootSound = new Audio("./sounds/rekShoot.wav");
shootSound.volume = 0.1;
var spawnSound = new Audio("./sounds/Spawn.mp3");
spawnSound.volume = 0.1;
var disappearSound = new Audio("./sounds/disappear.mp3");
disappearSound.volume = 1.0;
var footsteps = new Audio("./sounds/footsteps.mp3");
footsteps.loop = true;
footsteps.volume = 0;
if (soundOn) {
    this.footsteps.play();
}
var autoSound = new Audio("./sounds/rivenAuto.mp3");
autoSound.volume = 0.1;
var q1Sound = new Audio("./sounds/Q1.mp3");
q1Sound.volume = 0.1;
var q2Sound = new Audio("./sounds/Q2.mp3");
q2Sound.volume = 0.1;
var q3Sound = new Audio("./sounds/Q3.mp3");
q3Sound.volume = 0.1;
var eSound = new Audio("./sounds/E.mp3");
eSound.volume = 0.1;
var wSound = new Audio("./sounds/W.mp3");
wSound.volume = 0.1;
var chargedBurstSound = new Audio("./sounds/chargedburst.wav");
hitSound.volume = 1;
var teleportSound = new Audio("./sounds/teleport.wav");
teleportSound.volume = 0.3;
teleportSound.playbackRate = 1.5;
var laserSound = new Audio("./sounds/laser.wav");
laserSound.volume = 0.2;
var burrowingSound = new Audio("./sounds/ReksaiBurrowing.mp3");
burrowingSound.volume = 0.2;
var unburrowingSound = new Audio("./sounds/ReksaiUnburrowing.mp3");
unburrowingSound.volume = 0.2;
var rocksSound = new Audio("./sounds/taliyahrocks.mp3");
rocksSound.volume = 0.1;
var jumpSound = new Audio("./sounds/jumpSound.mp3");
jumpSound.volume = 0.3;
var breakSound = new Audio("./sounds/rock_break.wav");
breakSound.volume = 0.3;

/**
    Useful methods
*/

// Creates an animation
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

// Returns whether or not the audio file is playing
function isPlaying(audio) {
    return !audio.paused;
}

// Checks collision between two entities
function checkCollision(entity1, entity2) {
    var hitBox1 = entity1.hitBox;
    var hitBox2 = entity2.hitBox;
    return (hitBox1.x + hitBox1.width > hitBox2.x && hitBox1.x < hitBox2.x + hitBox2.width
         && hitBox1.y < hitBox2.y + hitBox2.height && hitBox1.y + hitBox1.height > hitBox2.y);
}

// Returns the distance along the x-axis between two entities. If they collide, the distance is 0
function getXDistance(entity1, entity2) {
    var distance = 0;
    if (entity1.hitBox.x + entity1.hitBox.width < entity2.hitBox.x) {
        distance = entity1.hitBox.x + entity1.hitBox.width - entity2.hitBox.x;        
    } else if (entity1.hitBox.x > entity2.hitBox.x + entity2.hitBox.width) {
        distance = entity1.hitBox.x - entity2.hitBox.x + entity2.hitBox.width;
    }
    return distance;
};

// Creates the hitbox for the entity
function createHitBox(entity) {
    entity.hitBox = {
    	x: entity.x + entity.hitBoxDef.offsetX + (entity.hitBoxDef.growthX < 0 ? entity.hitBoxDef.growthX : 0), 
		y: entity.y + entity.hitBoxDef.offsetY + (entity.hitBoxDef.growthY < 0 ? entity.hitBoxDef.growthY : 0),
		width: entity.hitBoxDef.width + Math.abs(entity.hitBoxDef.growthX), 
		height: entity.hitBoxDef.height + Math.abs(entity.hitBoxDef.growthY)
	};
}

// Draws the hitbox of an entity
function drawHitBox(entity, ctx) {
    if (entity.hitBoxDef) {
        entity.hitBox = {
            x: entity.x + entity.hitBoxDef.offsetX + (entity.hitBoxDef.growthX < 0 ? entity.hitBoxDef.growthX : 0), 
            y: entity.y + entity.hitBoxDef.offsetY + (entity.hitBoxDef.growthY < 0 ? entity.hitBoxDef.growthY : 0),
            width: entity.hitBoxDef.width + Math.abs(entity.hitBoxDef.growthX), 
            height: entity.hitBoxDef.height + Math.abs(entity.hitBoxDef.growthY)
        };
    }
    if (showHitBox) {
    	if (ctx != null) {
	        ctx.globalAlpha = 0.2;
	        var tempStyle = ctx.fillStyle;
	        ctx.fillStyle = "black";
	        ctx.fillRect(entity.hitBox.x, entity.hitBox.y, entity.hitBox.width, entity.hitBox.height);
	        ctx.fillStyle = tempStyle;
	        ctx.globalAlpha = 1;
    	}
    }
}

// Fades the boss music out
fadeBossMusicOut = function() {
    if (!soundOn) { 
        return; 
    }
    if (bossMusic.volume > 0) {
        musicFadingOut = true;
    	bossMusic.volume = Math.max(0, bossMusic.volume - 0.01);
    }
    if (bossMusic.volume <= 0) {
        bossMusic.Volume = 0;
        bossMusic.pause();
        bossMusic.currentTime = 0;
        musicFadingOut = false;
    }
}

// Fades the boss music in
fadeBossMusicIn = function() {
    if (!soundOn) { 
        return; 
    }
    if (!isPlaying(bossMusic)) {
        bossMusic.play();
    }
    if (bossMusic.volume < bossMusicVolume) {
        musicFadingIn = true;
    	bossMusic.volume = Math.min(bossMusicVolume, bossMusic.volume + 0.01);
    }
    if (bossMusic.volume >= bossMusicVolume) {
        bossMusic.Volume = bossMusicVolume;
        musicFadingOut = false;
    }
}

// Fades the climb music out
fadeClimbMusicOut = function() {
    if (!soundOn) { 
        return; 
    }
    if (climbMusic.volume > 0) {
        musicFadingOut = true;
    	climbMusic.volume = Math.max(0, climbMusic.volume - 0.01);
    }
    if (climbMusic.volume <= 0) {
        climbMusic.Volume = 0;
        climbMusic.pause();
        climbMusic.currentTime = 0;
        musicFadingOut = false;
    }
}

// Returns the RGB of a hex color (e.g. #FFFFFF)
function rgb(color) {
    return color.match(/\w\w/g).map(function(b){
    	return parseInt(b,16)
    });
}

// Returns a random color, in hex, of two other hex colors.
function getRandomColor(color1, color2) {
	var rgb1 = color1.match(/\w\w/g).map(function(b){
    	return parseInt(b,16)
    });
	var rgb2 = color2.match(/\w\w/g).map(function(b){
    	return parseInt(b,16)
    });
	var rgb = []; //the returning rgb
	for (var i = 0; i < 3; i++) {
		rgb[i] = rgb1[i] + Math.random()*(rgb2[i]-rgb1[i]) | 0;
	}
	return '#' + rgb
		.map(function(n){ return n.toString(16) })
	    .map(function(s){ return "00".slice(s.length)+s}).join(''); 
}

// Returns whether or not the entity is on the screen
function isOnScreen(entity) {
	return (entity.x >= entity.game.liveCamera.x - 50 && entity.x <= entity.game.liveCamera.x + entity.game.liveCamera.width + 50
			&& entity.y >= entity.game.liveCamera.y -50 && entity.y <= entity.game.liveCamera.y + entity.game.liveCamera.height + 50);
}

// Plays the given audio
function playSound(audio) {
    if (!soundOn) {
        return;
    }
    audio.currentTime = 0;
    audio.play();
}

/**
    Animation
*/

// Draws the frame for an animation
Animation.prototype.drawFrame = function (tick, ctx, x, y, scaleBy, linger) {
	var linger = linger || false;
    var scale = scaleBy || 1;
    this.elapsedTime += tick;
    if (this.loop && this.isDone()) {
        this.elapsedTime = 0;
    } else if (this.isDone() && !linger) {
        return;
    }
    var index = this.reverse ? this.frames - this.currentFrame() - 1 : this.currentFrame();
    var vindex = 0;
    if (linger && index >= this.frames) { // Stay on the last frame
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

// Returns the current frame of an animation
Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
};

// Returns whether or not the animation is done
Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
};

/**
    Background
*/

function Background(game) {
    Entity.call(this, game, 0, 0);
}
Background.prototype = new Entity();
Background.prototype.constructor = Background;
Background.prototype.update = function () {
};
Background.prototype.draw = function (ctx) {
    ctx.drawImage(ASSET_MANAGER.getAsset("./img/Background.png"), 0, 0);
    ctx.drawImage(ASSET_MANAGER.getAsset("./img/Background.png"), 800, 0);
    ctx.drawImage(ASSET_MANAGER.getAsset("./img/Background.png"), 1600, 0);
    ctx.drawImage(ASSET_MANAGER.getAsset("./img/Background2.png"), 800 - 100, 0 - 855);
    ctx.drawImage(ASSET_MANAGER.getAsset("./img/Background3.png"), 800 - 100, 0 - 855 * 2);
    Entity.prototype.draw.call(this);
};

/**
    UI (UI ID)
*/

function UI(game) {
    // Number Variables
    this.gameOverTransparency = 0;  
    this.barChangingSpeed = 1;  
    
    // Bottom
	this.bottomX = 0;
	this.bottomY = 380;
	this.bottomWidth = 800;
	this.bottomHeight = 120;
    // Player Portrait
	this.portraitX = 10;
	this.portraitY = this.bottomY + 10;
	this.portraitWidth = 100;
	this.portraitHeight = 100;
    // Player Health Bar
	this.bar1X = this.portraitX + this.portraitWidth - 20;
	this.bar1Y = this.portraitY + 25;
	this.bar1Width = 150;
	this.bar1Height = 30;
	this.healthX = this.bar1X + 5;
	this.healthY = this.bar1Y + 11;
	this.healthWidth = this.bar1Width - 8;
	this.healthHeight = this.bar1Height - 21;
    // Player Stamina Bar
	this.bar2X = this.portraitX + this.portraitWidth - 20;
	this.bar2Y = this.portraitY + 45;
	this.bar2Width = 150;
	this.bar2Height = 30;
	this.staminaX = this.bar2X + 5;
	this.staminaY = this.bar2Y + 11;
	this.staminaWidth = this.bar2Width - 8;
	this.staminaHeight = this.bar2Height - 21;
    // Boss Portrait
    this.bossPortraitX = 150;
    this.bossPortraitY = 20;
    this.bossPortraitWidth = 80;
    this.bossPortraitHeight = 80;
    // Boss Health Bar
    this.bossBarX = this.bossPortraitX + this.bossPortraitWidth - 12;
    this.bossBarY = this.bossPortraitY + 15;
    this.bossBarWidth = 400;
    this.bossBarHeight = 50;
    this.bossHealthX = this.bossBarX + 10;
    this.bossHealthY = this.bossBarY + 18;
    this.bossHealthWidth = this.bossBarWidth - 20;
    this.bossHealthHeight = this.bossBarHeight - 35;
    
	Entity.call(this, game, 0, 0);
}

UI.prototype = new Entity();
UI.prototype.constructor = UI;

UI.prototype.update = function () {
    if (this.game.currentPhase === 0) {
        fadeBossMusicIn();
    } else if (this.game.currentPhase === 1) {
        fadeBossMusicOut();
    } else if (this.game.currentPhase === 2 && this.game.currentBoss.attackEnabled) {
        fadeBossMusicIn();
    } else if (this.game.currentPhase === 3) {
        fadeBossMusicOut();
    }
    updatePlayerResources(this.game.player1, this);
    updateBossResources(this.game.currentBoss, this);
};

UI.prototype.draw = function (ctx) { //draw ui
    ctx.drawImage(ASSET_MANAGER.getAsset("./img/UI/Bottom.png"), this.bottomX, this.bottomY, this.bottomWidth, this.bottomHeight);
    ctx.drawImage(ASSET_MANAGER.getAsset("./img/UI/Bottom.png"), this.bottomX + 800, this.bottomY, this.bottomWidth, this.bottomHeight);
    ctx.drawImage(ASSET_MANAGER.getAsset("./img/UI/BarBack.png"), this.bar1X + this.game.liveCamera.x, this.bar1Y + this.game.liveCamera.y, this.bar1Width, this.bar1Height);
    ctx.drawImage(ASSET_MANAGER.getAsset("./img/UI/HealthBarLight.png"), this.healthX + this.game.liveCamera.x, this.healthY + this.game.liveCamera.y, this.healthWidth * (this.game.player1.currentHealthTemp / this.game.player1.maxHealth), this.healthHeight);
    ctx.drawImage(ASSET_MANAGER.getAsset("./img/UI/HealthBar.png"), this.healthX + this.game.liveCamera.x, this.healthY + this.game.liveCamera.y, this.healthWidth * (this.game.player1.currentHealth / this.game.player1.maxHealth), this.healthHeight);
    ctx.drawImage(ASSET_MANAGER.getAsset("./img/UI/BarBack.png"), this.bar2X + this.game.liveCamera.x, this.bar2Y + this.game.liveCamera.y, this.bar2Width, this.bar2Height);
    ctx.drawImage(ASSET_MANAGER.getAsset("./img/UI/StaminaBarLight.png"), this.staminaX + this.game.liveCamera.x, this.staminaY + this.game.liveCamera.y, this.staminaWidth * (this.game.player1.currentStaminaTemp / this.game.player1.maxStamina), this.staminaHeight);
    ctx.drawImage(ASSET_MANAGER.getAsset("./img/UI/StaminaBar.png"), this.staminaX + this.game.liveCamera.x, this.staminaY + this.game.liveCamera.y, this.staminaWidth * (this.game.player1.currentStamina / this.game.player1.maxStamina), this.staminaHeight);
    ctx.drawImage(ASSET_MANAGER.getAsset("./img/Riven/RivenPortrait.png"), this.portraitX + this.game.liveCamera.x, this.portraitY + this.game.liveCamera.y, this.portraitWidth, this.portraitHeight);
    var tempColor = ctx.fillStyle;
    ctx.font = "30px Calibri";
    ctx.fillStyle = "white";
    ctx.font = "20px Calibri";
    ctx.fillText("Player1  " + this.game.player1.currentHealth + " / " + this.game.player1.maxHealth,this.portraitX + 90 + this.game.liveCamera.x,this.portraitY + 30 + this.game.liveCamera.y);
    if (this.game.currentPhase === 0) {
        ctx.drawImage(ASSET_MANAGER.getAsset("./img/UI/BarBack.png"), this.bossBarX + this.game.liveCamera.x, this.bossBarY + this.game.liveCamera.y, this.bossBarWidth, this.bossBarHeight);
        ctx.drawImage(ASSET_MANAGER.getAsset("./img/UI/HealthBarLight.png"), this.bossHealthX + this.game.liveCamera.x, this.bossHealthY + this.game.liveCamera.y, this.bossHealthWidth * (this.game.currentBoss.currentHealthTemp / this.game.currentBoss.maxHealth), this.bossHealthHeight);
        ctx.drawImage(ASSET_MANAGER.getAsset("./img/UI/HealthBar.png"), this.bossHealthX + this.game.liveCamera.x, this.bossHealthY + this.game.liveCamera.y, this.bossHealthWidth * (this.game.currentBoss.currentHealth / this.game.currentBoss.maxHealth), this.bossHealthHeight);
    	ctx.drawImage(ASSET_MANAGER.getAsset("./img/Reksai/ReksaiPortrait.png"), this.bossPortraitX + this.game.liveCamera.x, this.bossPortraitY + this.game.liveCamera.y, this.bossPortraitWidth, this.bossPortraitHeight);
        ctx.fillText("Rek'sai                        " + this.game.currentBoss.currentHealth + " / " + this.game.currentBoss.maxHealth,this.bossPortraitX + 80,45);
    }
    if (this.game.currentPhase === 2 || this.game.currentPhase === 14) {
        ctx.drawImage(ASSET_MANAGER.getAsset("./img/UI/BarBack.png"), this.bossBarX + this.game.liveCamera.x, this.bossBarY + this.game.liveCamera.y, this.bossBarWidth, this.bossBarHeight);
        ctx.drawImage(ASSET_MANAGER.getAsset("./img/UI/HealthBarLight.png"), this.bossHealthX + this.game.liveCamera.x, this.bossHealthY + this.game.liveCamera.y, this.bossHealthWidth * (this.game.currentBoss.currentHealthTemp / this.game.currentBoss.maxHealth), this.bossHealthHeight);
        ctx.drawImage(ASSET_MANAGER.getAsset("./img/UI/HealthBar.png"), this.bossHealthX + this.game.liveCamera.x, this.bossHealthY + this.game.liveCamera.y, this.bossHealthWidth * (this.game.currentBoss.currentHealth / this.game.currentBoss.maxHealth), this.bossHealthHeight);
    	ctx.drawImage(ASSET_MANAGER.getAsset("./img/Malzahar/MalzaharPortrait.png"), this.bossPortraitX + this.game.liveCamera.x, this.bossPortraitY + this.game.liveCamera.y, this.bossPortraitWidth, this.bossPortraitHeight);
        ctx.fillText("Malzahar                      " + this.game.currentBoss.currentHealth + " / " + this.game.currentBoss.maxHealth,this.bossPortraitX + 80 + this.game.liveCamera.x,45 + this.game.liveCamera.y);
    }
    if (!this.game.player1.dead) {
        ctx.fillText("Player1", this.game.player1.x + 5,this.game.player1.y + 0);
    }
    if (this.game.currentPhase === 0) {
        ctx.fillText("Rek'sai", this.game.currentBoss.x + 50, this.game.currentBoss.y - 5);
    }
    if (this.game.currentPhase === 2 || this.game.currentPhase === 14) {
        ctx.fillText("Malzahar", this.game.currentBoss.x + 10, this.game.currentBoss.y - 15);
    }
    ctx.fillStyle = tempColor;
    if (this.game.player1.dead) {
        if (this.gameOverTransparency < 1) {
            this.gameOverTransparency += 0.025;
            ctx.globalAlpha = this.gameOverTransparency;
        }
        ctx.font = "100px Calibri";
        ctx.fillStyle = "white";
        ctx.textAlign = "center"; 
        ctx.fillText("Defeat",400 + this.game.liveCamera.x,250 + this.game.liveCamera.y);
        ctx.globalAlpha = 1.0;
    } else if (this.game.currentBoss.dead) {
        if (this.gameOverTransparency < 1) {
            this.gameOverTransparency += 0.025;
            ctx.globalAlpha = this.gameOverTransparency;
        }
        ctx.font = "100px Calibri";
        ctx.fillStyle = "white";
        ctx.textAlign = "center"; 
        if (this.game.currentPhase === 0) {
	        this.game.cameraLock = false;
	        this.game.camera.maxX = 800;
	        this.game.currentPhase = 1;
     		this.game.addEntity(new Particle(IMG_FLASH_PART, 600, 250, 0, 0, 0, 0, 0, 0, 0, 500, 0, 0, 1, 0, false, this.game,
     				new Animation(ASSET_MANAGER.getAsset("./img/ArrowGoRight.png"), 0, 0, 269, 83, 1, 1, true, false, 0, 0)));
        }
        ctx.globalAlpha = 1.0;
    }
    if (this.game.currentPhase >= 6 && this.game.currentPhase <= 10) {
        var randomness = Math.random() * 100;
        if (randomness <= 10) {
            var randomSize = 2 + Math.random() * 13;
            var randomPosition = (800 - randomSize) + Math.random() * (801 + randomSize);
            var particle = new Particle(SHAPE_PART,
                                            randomPosition,
                                            this.game.camera.y - 100, 
                                            0, 0, -3, -5, 0.3, 0, 0, 100, 0, 10, 1, 0, true, this.game);
                                    var element = new SquareElement(randomSize, randomSize, "#2A2349", "#272144");
                                    particle.other = element;
                                    this.game.addEntity(particle);
        }
	}
    Entity.prototype.draw.call(this);	
};

// Updates given player's resources
function updatePlayerResources(entity, ui) {
    if (entity.currentHealth < 0) {
        entity.currentHealth = 0;
    }
    if (entity.currentHealthTemp > entity.currentHealth) {
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

// Updates Boss Resources
function updateBossResources(entity, ui) {
    if (entity.currentHealth < 0) {
        entity.currentHealth = 0;
    }
    if (entity.currentHealthTemp > entity.currentHealth) {
        entity.currentHealthTemp -= ui.barChangingSpeed;
    }
    if (Math.abs(entity.currentHealthTemp - entity.currentHealth) <= ui.barChangingSpeed) {
        entity.currentHealthTemp = entity.currentHealth;
    }
    if (entity.currentHealth > entity.currentHealthTemp) {
        entity.currentHealthTemp = entity.currentHealth;
    }
}

/**
    Platform
*/
function Platform(game, x, y, hSpeed, vSpeed, switchDelay, specialId) {
    // Number Variables
    this.x = x;
    this.y = y;
    this.width = 63;
    this.height = 16;
    this.hSpeed = hSpeed || 0;
    this.vSpeed = vSpeed || 0;
    this.switchDelay = switchDelay || 0;
	this.specialId = specialId || 0;
    this.step = 0;
    // Pictures and Animations
    this.platformPicture = ASSET_MANAGER.getAsset("./img/UI/Platform.png");
    if (this.specialId === 1) {
        this.platformPicture = ASSET_MANAGER.getAsset("./img/UI/PlatformBouncy.png");    	
    }
    
    Entity.call(this, game, x, y);
    
    this.hitBoxDef = {
    	width: this.width, height: this.height, offsetX: 0, offsetY: 0, growthX: 0, growthY: 0
    };
    createHitBox(this);
}

Platform.prototype = new Entity();
Platform.prototype.constructor = Platform;

Platform.prototype.update = function () {
	// Only update when it is visible on the screen
	if (isOnScreen(this)) {
		this.step++;
		if (this.switchDelay > 0 && this.step % this.switchDelay === 0) {
			this.hSpeed *= -1;
			this.vSpeed *= -1;
		}
	    this.x += this.hSpeed;
	    this.y += this.vSpeed;
	}
    if (this.game.currentPhase === 10 && !this.removeFromWorld) {
        if (this.game.liveCamera.y <= -120 && this.hitBox.y + this.hitBox.height >= this.game.liveCamera.y + 500) {
			for (i = 0; i < this.hitBox.width; i += 10) {
	        	console.log("creating particle");
	            playSound(breakSound);
	            var particle = new Particle(SHAPE_PART, this.x + i, this.y, 4, -4, 0, -4, 0.15, 0.1, 0, 5, 0, 50, 1, 0, true, this.game);
	            var element;
	            if (this.specialId === 0)
	            	element = new SquareElement(6 + Math.random() * 4, 6 + Math.random() * 4, "#123D5C", "#386586");
	            else
	            	element = new SquareElement(6 + Math.random() * 4, 6 + Math.random() * 4, "#39682D", "#41850B");
	            particle.other = element;
	            this.game.addEntity(particle);
			}
			this.removeFromWorld = true;
        }
    }
    Entity.prototype.update.call(this);
    drawHitBox(this);
};

Platform.prototype.draw = function (ctx) {
	if (!this.removeFromWorld) {
	    ctx.drawImage(this.platformPicture, this.x, this.y, this.width, this.height); 
		drawHitBox(this, ctx);
	}
	Entity.prototype.draw.call(this);
}

/**
    Map
*/

function Map(game) {
    // Starting Platforms at start
    this.platforms = [];
	this.platforms.push(new Platform(game, 200, 315, 1, 0, 64));
	this.platforms.push(new Platform(game, 500, 315));
    
    Entity.call(this, game, 0, 0);    
}

Map.prototype = new Entity();
Map.prototype.constructor = UI;

Map.prototype.update = function () {
};

Map.prototype.draw = function (ctx) {
    this.platforms.forEach(function(currentPlatform) {
        currentPlatform.draw(ctx);
    });
    Entity.prototype.draw.call(this);
}

function createPlatforms(game) {
	var powerups = [
		
		new Powerup(game, 816, -544, 0), //health powerup
		
		new Powerup(game, 816, 0, 0), //health powerup
		
		new Powerup(game, 1552, -896, 0), //health powerup
		
		new Powerup(game, 1216, -992, 0), //health powerup
	]
	var voidlings = [
		new Voidling(game, 944, -208, "explode"),

		new Voidling(game, 1024, 128, "touch"),

		new Voidling(game, 1248, 128, "touch"),

		new Voidling(game, 976, -1008, "explode"),

		new Voidling(game, 1184, -1008, "touch"),

		new Voidling(game, 1392, -1008, "touch"),

		new Voidling(game, 1056, -1152, "touch"),

		new Voidling(game, 1232, -1152, "touch"),

		new Voidling(game, 992, -704, "touch"),

		new Voidling(game, 1056, -704, "touch"),

		new Voidling(game, 928, -368, "touch"),

		new Voidling(game, 1104, -368, "touch"),

		new Voidling(game, 864, -16, "explode"),

		new Voidling(game, 960, -864, "touch"),

		new Voidling(game, 1120, -864, "touch"),
	];
	var platforms = [
		
		new Platform(game, 800, 320),
		
		new Platform(game, 800, 272),
		
		new Platform(game, 800, 224),
		
		new Platform(game, 864, 176),
		
		new Platform(game, 928, 176),
		
		new Platform(game, 992, 176),
		
		new Platform(game, 1056, 176),
		
		new Platform(game, 1120, 176),
		
		new Platform(game, 1184, 176),
		
		new Platform(game, 1248, 176),
		
		new Platform(game, 1312, 176),
		
		new Platform(game, 1376, 176),
		
		new Platform(game, 1440, 176),
		
		new Platform(game, 1504, 176, 0, -2, 96 / 2), //VERTICAL
		
		new Platform(game, 1392, 80),
		
		new Platform(game, 1328, 32),
		
		new Platform(game, 1072, 32),
		
		new Platform(game, 1008, 32),
		
		new Platform(game, 944, 32),
		
		new Platform(game, 880, 32),
		
		new Platform(game, 816, 32),
		
		new Platform(game, 752, 32),
		
		new Platform(game, 1264, -16),
		
		new Platform(game, 1136, -16),
		
		new Platform(game, 1200, -64),
		
		new Platform(game, 1136, -112),
		
		new Platform(game, 1072, -160),
		
		new Platform(game, 1008, -160),
		
		new Platform(game, 944, -160),
		
		new Platform(game, 880, -160),
		
		new Platform(game, 816, -160, 0, -2, 160 / 2), //VERTICAL
		
		new Platform(game, 880, -320),
		
		new Platform(game, 944, -320),
		
		new Platform(game, 1008, -320),
		
		new Platform(game, 1072, -320),
		
		new Platform(game, 1136, -320),
		
		new Platform(game, 1200, -320),
		
		new Platform(game, 1312, -320),
		
		new Platform(game, 1424, -368),
		
		new Platform(game, 1344, -416),
		
		new Platform(game, 1216, -416),
		
		new Platform(game, 1088, -416),
		
		new Platform(game, 976, -416),
		
		new Platform(game, 880, -464),
		
		new Platform(game, 1200, -512),
		
		new Platform(game, 976, -512),
		
		new Platform(game, 1088, -512),
		
		new Platform(game, 800, -512),
		
		new Platform(game, 1264, -512, 2, 0, 176 / 2), //HORIZONTAL
		
		new Platform(game, 1536, -512, 0, 0, 0, 1), //BOUNCY
		
		new Platform(game, 1360, -656),
		
		new Platform(game, 1296, -656),
		
		new Platform(game, 1232, -656),
		
		new Platform(game, 1168, -656),
		
		new Platform(game, 1104, -656),
		
		new Platform(game, 1040, -656),
		
		new Platform(game, 976, -656),
		
		new Platform(game, 912, -656, 0, 0, 0, 1), //BOUNCY
		
		new Platform(game, 1536, -704),
		
		new Platform(game, 912, -816),
		
		new Platform(game, 976, -816),
		
		new Platform(game, 1040, -816),
		
		new Platform(game, 1104, -816),
		
		new Platform(game, 1168, -816),
		
		new Platform(game, 1296, -816),
		
		new Platform(game, 1424, -816),
		
		new Platform(game, 848, -864),
		
		new Platform(game, 784, -864),
		
		new Platform(game, 1488, -864),
		
		new Platform(game, 1552, -864),
		
		new Platform(game, 784, -912),
		
		new Platform(game, 784, -960),
		
		new Platform(game, 912, -960),
		
		new Platform(game, 976, -960),
		
		new Platform(game, 1040, -960),
		
		new Platform(game, 1104, -960),
		
		new Platform(game, 1168, -960),
		
		new Platform(game, 1232, -960),
		
		new Platform(game, 1296, -960),
		
		new Platform(game, 1360, -960),
		
		new Platform(game, 1424, -960),
		
		new Platform(game, 1488, -960),
		
		new Platform(game, 1552, -960),
		
		new Platform(game, 1536, -1008),
		
		new Platform(game, 1536, -1056),
		
		new Platform(game, 1536, -1104),
		
		new Platform(game, 1280, -1104),
		
		new Platform(game, 1216, -1104),
		
		new Platform(game, 1152, -1104),
		
		new Platform(game, 1088, -1104),
		
		new Platform(game, 1024, -1104),
		
		new Platform(game, 1472, -1104, -2, 0, 80 / 2), //HORIZONTAL
		
		new Platform(game, 960, -1152),
		
		new Platform(game, 896, -1200),
		
		new Platform(game, 1120, -1200, 0, 0, 0, 1), //BOUNCY
		
		new Platform(game, 960, -1248),
		
		new Platform(game, 800, -1328),
		
		new Platform(game, 864, -1328),
		
		new Platform(game, 928, -1328),
		
		new Platform(game, 992, -1328),
		
		new Platform(game, 1056, -1328),
		
		new Platform(game, 1120, -1328),
		
		new Platform(game, 1184, -1328),
		
		new Platform(game, 1248, -1328),
		
		new Platform(game, 1312, -1328),
		
		new Platform(game, 1376, -1328),
		
		new Platform(game, 1440, -1328),
		
		new Platform(game, 1504, -1328),
		
		new Platform(game, 1568, -1328),

	];
	for (i = 0; i < platforms.length; i++) {
		var p = platforms[i];
		//console.log("adding new platform: "+p.x+","+p.y);
		game.currentMap.platforms.push(p);
	}
	for (i = 0; i < voidlings.length; i++) {
		var v = voidlings[i];
		game.addEntity(v);
	}
	for (i = 0; i < powerups.length; i++) {
		var v = powerups[i];
		game.addEntity(v);
	}
}

/**
    TextBox
*/

function TextBox(game, image, text) {
	this.image = image;
	this.text = text;
	this.showText = "";
	this.progress = 0;
	this.step = 0;
	this.life = -1;
    Entity.call(this, game, 0, 0);
}

function wrapText(context, text, x, y, maxWidth, lineHeight) {
    var words = text.split(' ');
    var line = '';
    y += 5;

    for (var n = 0; n < words.length; n++) {
        var testLine = line + words[n] + ' ';
        var metrics = context.measureText(testLine);
        var testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            context.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
        } else {
            line = testLine;
        }
    }
    context.fillText(line, x, y);
}

TextBox.prototype.update = function() {
	this.step++;
	if (this.life > 0) {
		this.life--;
		if (this.life <= 0) {
			this.removeFromWorld = true;
            if (this.game.currentPhase === 2) {
                this.game.currentBoss.attackEnabled = true;
                this.game.player1.canControl = true;
        	} else if (this.game.currentPhase === 3) {
                if (soundOn) {
                    climbMusic.play();
                }
        		var chat = new TextBox(this.game, "./img/Chat/MalzSquare.png", "You think you've WON?");
        		this.game.addEntity(chat);
        		this.game.currentPhase = 4;
        	} else if (this.game.currentPhase === 4) {
        		//var chat = new TextBox(this.game, "./img/Chat/MalzSquare.png", "All must bow down to the void... or be CONSUMED by it!");
        		var chat = new TextBox(this.game, "./img/Chat/MalzSquare.png", "I have become one with the void! It bends to my will!");
        		this.game.addEntity(chat);
        		this.game.currentPhase = 5;
        	} else if (this.game.currentPhase === 5) {
        		this.game.currentPhase = 6;
        		this.game.step = 0;
                if (soundOn) {
                    earthRumble.play();
                }
        	} else if (this.game.currentPhase === 8) {
         		var chat = new TextBox(this.game, "./img/Chat/RivenSquare.png", "Not good! Better get out of here!");
         		this.game.addEntity(chat);
         		this.game.currentPhase = 9;
         		this.game.addEntity(new Particle(IMG_FLASH_PART, 1200, 300, 0, 0, 0, 0, 0, 0, 0, 500, 0, 0, 1, 0, false, this.game,
         				new Animation(ASSET_MANAGER.getAsset("./img/ArrowGoUp.png"), 0, 0, 269, 83, 1, 1, true, false, 0, 0)));
        	} else if (this.game.currentPhase === 9) {
         		this.game.currentPhase = 10;
        		this.game.step = 0;
        		this.game.cameraLock = false;
        		createPlatforms(this.game);
        	} else if (this.game.currentPhase === 12 || this.game.currentPhase === 13 || this.game.currentPhase === 14) {
                this.game.currentPhase = 14;
                this.game.player1.canControl = true;
                this.game.currentBoss.attackEnabled = true;
                this.game.currentBoss.maxHealth = 100;
                this.game.currentBoss.attackable = true;
                this.game.currentBoss.currentHealth = 100;
                this.game.currentBoss.currentHealthTemp = 100;
                this.game.currentBoss.dead = false;
            }
		}
	}
	if (this.step % this.game.textSpeed === 0) {
		this.progress++;
		if (this.progress >= this.text.length) {
			this.showText = this.text;
			if (this.life === -1) {
				this.life = 100;
			}
		} else {
			this.showText = this.text.substring(0, this.progress);
			var c = this.showText.charAt(this.progress - 1);
			if (c === '?' || (c.toLowerCase() != c.toUpperCase())) { // It's a character
			    var sound = new Audio("./sounds/chat.wav");
			    sound.volume = 0.4;
			    if (this.image.indexOf("Riven") !== -1) {
			    	sound = new Audio("./sounds/chat2.wav");
                    sound.volume = 0.1;
			    }
			    sound.play();
			}
		}
	}
    Entity.prototype.update.call(this);
}

TextBox.prototype.draw = function(ctx) {
    var tempColor = ctx.fillStyle;
    var trueWidth = 220;
    var trueHeight = 64;
    ctx.fillStyle = "#452a84";
	ctx.globalAlpha = 0.5;
    ctx.fillRect(285 + 64 + this.game.liveCamera.x, 420 + this.game.liveCamera.y, trueWidth, trueHeight);
    ctx.fillStyle = tempColor;
	ctx.globalAlpha = 1;
	ctx.drawImage(ASSET_MANAGER.getAsset("./img/Chat/ChatSquare.png"), 285 + this.game.liveCamera.x, 
			420 + this.game.liveCamera.y, 64, 64);
	ctx.drawImage(ASSET_MANAGER.getAsset(this.image), 285 + this.game.liveCamera.x, 
			420 + this.game.liveCamera.y, 64, 64);
	
    ctx.font = "16px Lucida Console";
    ctx.fillStyle = "white";
    ctx.textAlign = "left";
    wrapText(ctx, this.showText, 285 + 64 + this.game.liveCamera.x + 12, 420 + this.game.liveCamera.y + 12, 196, 20);
    Entity.prototype.draw.call(this);
}

/**
    Particles
*/

// A shape element which is attached to a particle.
// If the particle.other is not null, the shape is drawn instead of an image.
function SquareElement(width, height, color1, color2) {
	this.width = width;
	this.height = height;
	var color1 = color1;
	var color2 = color2 || null;
	if (color2 != null) {
		this.color = getRandomColor(color1, color2);
	} else {
		this.color = color1;
	}
}

SquareElement.prototype.draw = function(ctx, x, y, sizeScale) {
    var tempColor = ctx.fillStyle;
    var trueWidth = this.width * sizeScale;
    var trueHeight = this.height * sizeScale;
    ctx.fillStyle = this.color;
    ctx.fillRect(x - trueWidth / 2, y - trueHeight / 2, trueWidth, trueHeight);
    ctx.fillStyle = tempColor;
    Entity.prototype.draw.call(this);
}

// A shape element which is attached to a particle.
// If the particle.other is not null, the shape is drawn instead of an image.
function CircleElement(radius, color1, color2) {
	this.radius = radius;
	var color1 = color1;
	var color2 = color2 || null;
	if (color2 != null) {
		this.color = getRandomColor(color1, color2);
	} else {
		this.color = color1;
	}
}

CircleElement.prototype.draw = function(ctx, x, y, sizeScale) {
    var tempColor = ctx.fillStyle;
    var trueRadius = this.radius * sizeScale;
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(x, y, trueRadius, 0, 2 * Math.PI, false);
    ctx.fill();
    ctx.fillStyle = tempColor;
    Entity.prototype.draw.call(this);
}

// A text element which is attached to a particle.
// If the particle.other is not null, the text is drawn instead of an image.
function TextElement(text, font, size, color, shadowColor) {
	this.text = text;
	this.font = font;
	this.size = size;
	this.color = color;
	this.shadowColor = shadowColor || null;
}

TextElement.prototype.draw = function(ctx, x, y, sizeScale) {
    var tempColor = ctx.fillStyle;
    var trueSize = this.size * sizeScale;
    var trueFont = "" + trueSize + "px " + this.font;
    ctx.textAlign = "center";
    ctx.font = trueFont;
    if (this.shadowColor !== null) {
	    ctx.fillStyle = this.shadowColor;
	    ctx.fillText(this.text, x + 4, y + 4);
    }
    ctx.fillStyle = this.color;
    ctx.fillText(this.text, x, y);
    ctx.fillStyle = tempColor;
    Entity.prototype.draw.call(this);
}

// PARTICLE ID
function Particle(particleId, x, y, minHSpeed, maxHSpeed, minVSpeed, maxVSpeed,
	gravity, friction, width, maxLife, fadeIn, fadeOut, maxAlpha, alphaVariance, shrink, game, anim) {
	this.particleId = particleId;
	this.GRAVITY_CAP = 30;
	this.animation = anim || null;
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
	this.absoluteSizeScale = 1;
	this.width = width;
	this.maxAlpha = maxAlpha + Math.random() * (alphaVariance * 2) - alphaVariance;
	this.other = null;
	this.snapEntity = null;
	this.attackId = -1;
	this.direction = "none";
	if (fadeIn > 0) {
		this.alpha = 0;
	} else {
		this.alpha = maxAlpha;
    }
    this.hitBox = {
    	x: this.x - this.width / 2 + this.width, 
		y: this.y - this.width / 2 + this.width,
		width: this.width, 
		height: this.width
	};
    Entity.call(this, game, x + Math.random() * (width * 2) - width, y + Math.random() * (width * 2) - width);
}

Particle.prototype = new Entity();
Particle.prototype.constructor = Particle;

Particle.prototype.update = function() {
	if (this.particleId === IMG_PART) {
		/*this.game.addEntity(new Particle(PART_SECONDARY, this.x + 20, this.y + 20, 3, -3, 3, 0,
			0, 0, 0, 10, 10, 10, 1, 0, true, this.game,
		new Animation(ASSET_MANAGER.getAsset("./img/small_flare.png"), 0, 0, 12, 12, 1, 1, false, false, 0, 0)));*/
	}
	if (this.particleId === VOID_BALL && this.life % 2 === 0) {
	    var newParticle = new Particle(PART_SECONDARY, this.x, this.y, 
				-2, 2, -2, 2, 0, 0.1, 0, 30, 0, 15, .7, .2, true, this.game);
	    var element = new CircleElement(10 + Math.random() * 4, "#240340", "#131d4f");
	   	newParticle.other = element;
	    this.game.addEntity(newParticle);
	}
	if (this.particleId === VOID_PORTAL && this.life % 2 === 0) {
	    var newParticle = new Particle(PART_SECONDARY, this.x, this.y, 
				-3, 3, -2, 0, 0, 0.1, 0, 30, 0, 15, .7, .2, true, this.game);
	    var element = new CircleElement(4 + Math.random() * 2, "#240340", "#131d4f");
	   	newParticle.other = element;
	    this.game.addEntity(newParticle);
		if (this.life >= (this.maxLife / 2)) { //erupt!
		    newParticle = new Particle(PART_SECONDARY, this.x, this.y, 
					-3, 3, -10, -15, -.5, 0.1, 0, 30, 0, 15, .7, .2, true, this.game);
		    element = new CircleElement(10 + Math.random() * 4, "#240340", "#131d4f");
		   	newParticle.other = element;
		   	newParticle.attackId = 2;
		    this.game.addEntity(newParticle);
		}
	}
	if (this.attackId === 3 && this.life % 2 === 0) { //void storm attack
	    var newParticle = new Particle(PART_SECONDARY, this.x, this.y, 
				-2, 2, -2, 2, 0, 0.2, 0, 20, 0, 15, .5, .2, true, this.game);
	    var element = new CircleElement(10 + Math.random() * 4, "#240340", "#131d4f");
	   	newParticle.other = element;
	    this.game.addEntity(newParticle);
	}
	if (this.particleId === VOID_STORM && this.life % 2 === 0) {
		var speed = this.direction === "Right" ? 8 : -8;
	    var newParticle = new Particle(PART_SECONDARY, this.x, this.y, 
				speed, speed, -4, 4, 0, 0, 0, 60, 0, 15, .5, .2, true, this.game);
	    var element = new CircleElement(10 + Math.random() * 4, "#240340", "#131d4f");
	   	newParticle.other = element;
	   	newParticle.attackId = 3;
	    this.game.addEntity(newParticle);
	}
	if (this.particleId === VOID_GOOP && this.life % 2 === 0) {
		if (this.y <= this.game.liveCamera.y + this.game.liveCamera.height) {
		    var newParticle = new Particle(PART_SECONDARY, this.x, this.y, 
					0, 0, 0, 0, 0, 0, 0, 40, 10, 10, .3, .2, true, this.game);
		    var element = new CircleElement(7 + Math.random() * 4, "#240340", "#131d4f");
		   	newParticle.other = element;
		    this.game.addEntity(newParticle);
		} else {
			console.log("deleting goop "+this.y)
			this.removeFromWorld = true;			
		}
	}
	if (this.particleId === BURROW_PART) {
		var right = false;
        var distance = getXDistance(this.game.player1, this) - this.game.player1.hitBox.width / 2;
        if (distance > 0) {
        	right = true;
        	this.x += Math.min(distance, 2);
        } else
        	this.x += Math.max(distance, -2);
        if (this.life % 3 === 0) {
		    var newParticle = new Particle(PART_SECONDARY, this.x, this.y, 
					-2, 2, -3, 0, 0.1, 0.1, 0, 30, 0, 15, .7, .2, true, this.game,
		        	new Animation(ASSET_MANAGER.getAsset("./img/Particle/smoke.png"), 0, 0, 256, 256, 0.06 + Math.random() * 0.02, 20, true, false, 15, 10));
		    newParticle.absoluteSizeScale = .1 + Math.random() * .1;
		    this.game.addEntity(newParticle);
        }
		if (this.life % 2 === 0 && this.life >= (this.maxLife * 3 / 4)) { //erupt!
		    newParticle = new Particle(PART_SECONDARY, this.x, this.y, 
					-3, 3, -5, 0, 0.1, 0.1, 0, 30, 0, 15, .7, .2, true, this.game,
		        	new Animation(ASSET_MANAGER.getAsset("./img/Particle/smoke.png"), 0, 0, 256, 256, 0.03 + Math.random() * 0.04, 20, true, false, 15, 10));
		    newParticle.absoluteSizeScale = .2 + Math.random() * .2;
		    this.game.addEntity(newParticle);
		}
		if (this.life === this.maxLife) {
			this.game.currentBoss.energy = 0;
            this.game.currentBoss.state = "attacking";
            playSound(screamSound);
            this.game.currentBoss.attackIndex = 4; //scream that does damage
            if (!right) {
                this.game.currentBoss.attackAnimation = this.game.currentBoss.screamAnimationLeft;
            } else {
                this.game.currentBoss.attackAnimation = this.game.currentBoss.screamAnimationRight;
            }
			this.game.currentBoss.y -= 1000;
			this.game.currentBoss.x = this.x - this.game.currentBoss.hitBox.width / 2;
		}
	}
	/**
	 * particle generators create particles similar to whatever they were initialized with
	 */
	if (this.particleId === PART_GENERATOR) {
		
        var particle = new Particle(SHAPE_PART, this.x, this.y, 4, -4, 2, -6, 0.15, 0.05, 0, 5, 10, 50, 1, 0, false, this.game);
        particle.other = this.other;
        this.game.addEntity(particle);
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
	if (this.vSpeed > 0) {
		this.vSpeed -= this.friction;
		if (this.vSpeed <= 0)
			this.vSpeed = 0;
	}
	if (this.vSpeed < 0) {
		this.vSpeed += this.friction;
		if (this.vSpeed >= 0)
			this.vSpeed = 0;
	}
	this.vSpeed += this.gravity;
	if (this.vSpeed > this.GRAVITY_CAP)
		this.vSpeed = this.GRAVITY_CAP;
	this.x += this.hSpeed;
	this.y += this.vSpeed;
	if (this.y >= 600) {
		this.removeFromWorld = true;
    }
	this.life++;
	
	if (this.snapEntity != null) {
		this.x = this.snapEntity.x;
		this.y = this.snapEntity.y;
	}

    this.hitBox = { //update hitbox as we move
    	x: this.x - this.width / 2 + this.width, 
		y: this.y - this.width / 2 + this.width,
		width: this.width, 
		height: this.width
	};
    if (checkCollision(this, this.game.player1) && !this.game.player1.hitByAttack) {
    	if (this.attackId === 1) { // Reksai Void Ball
            if (this.game.player1.vulnerable) {
                this.game.player1.vulnerable = false;
                var damageParticle = new Particle(TEXT_PART, this.game.player1.hitBox.x, this.game.player1.hitBox.y, 
            			0.2, -0.2, -3, -3, 0, 0.1, 0, 5, 10, 50, 1, 0, false, this.game);
                var damageText = new TextElement("", "Lucida Console", 25, "red", "black");
                var damage = 40;
            	damageText.text = damage;
                damageParticle.other = damageText;
                this.game.addEntity(damageParticle);
                this.game.player1.currentHealth -= 40;
                this.game.player1.invulnTimer = this.game.player1.invulnTimerMax;
                this.game.player1.hitByAttack = true;
                playSound(reksaiProjectileSound);
                if (this.hSpeed < 0) {
                    this.game.player1.xVelocity = -3;
                    this.game.player1.lastDirection = "Right";
                    this.game.player1.hurtAnimation = this.game.player1.hurtAnimationRight;
                } else {
                    this.game.player1.xVelocity = 3;
                    this.game.player1.lastDirection = "Left";
                    this.game.player1.hurtAnimation = this.game.player1.hurtAnimationLeft;
                }
            }
    	}
    	if (this.attackId === 2) { //malzahar void eruption
            if (this.game.player1.vulnerable) {
                this.game.player1.vulnerable = false;
                var damageParticle = new Particle(TEXT_PART, this.game.player1.hitBox.x, this.game.player1.hitBox.y, 
            			0.2, -0.2, -3, -3, 0, 0.1, 0, 5, 10, 50, 1, 0, false, this.game);
                var damageText = new TextElement("", "Lucida Console", 25, "red", "black");
                var damage = 40;
            	damageText.text = damage;
                damageParticle.other = damageText;
                this.game.addEntity(damageParticle);
                this.game.player1.currentHealth -= 30;
                this.game.player1.invulnTimer = this.game.player1.invulnTimerMax;
                this.game.player1.hitByAttack = true;
                playSound(lightningSound);
                if (this.hSpeed < 0) {
                    this.game.player1.xVelocity = -3;
                    this.game.player1.lastDirection = "Right";
                    this.game.player1.hurtAnimation = this.game.player1.hurtAnimationRight;
                } else {
                    this.game.player1.xVelocity = 3;
                    this.game.player1.lastDirection = "Left";
                    this.game.player1.hurtAnimation = this.game.player1.hurtAnimationLeft;
                }
            }
    	}
    	if (this.attackId === 3) { //malzahar void storm
            if (this.game.player1.vulnerable) {
                this.game.player1.vulnerable = false;
                var damageParticle = new Particle(TEXT_PART, this.game.player1.hitBox.x, this.game.player1.hitBox.y, 
            			0.2, -0.2, -3, -3, 0, 0.1, 0, 5, 10, 50, 1, 0, false, this.game);
                var damageText = new TextElement("", "Lucida Console", 25, "red", "black");
                var damage = 6; //this is going to tick a lot
            	damageText.text = damage;
                damageParticle.other = damageText;
                this.game.addEntity(damageParticle);
                this.game.player1.currentHealth -= 30;
                this.game.player1.invulnTimer = this.game.player1.invulnTimerMax;
                this.game.player1.hitByAttack = true;
                playSound(lightningSound);
                if (this.hSpeed < 0) {
                    this.game.player1.xVelocity = -3;
                    this.game.player1.lastDirection = "Right";
                    this.game.player1.hurtAnimation = this.game.player1.hurtAnimationRight;
                } else {
                    this.game.player1.xVelocity = 3;
                    this.game.player1.lastDirection = "Left";
                    this.game.player1.hurtAnimation = this.game.player1.hurtAnimationLeft;
                }
            }
    	}
    }
    Entity.prototype.update.call(this);
};

Particle.prototype.draw = function (ctx) {
	if (this.particleId === IMG_FLASH_PART) {
		this.sizeScale = 0.4;
	    if (this.life % 30 === 0)
	    	this.alpha = this.alpha === 1 ? 0 : 1;
	}
	ctx.globalAlpha = this.alpha * this.maxAlpha;
	if (this.other == null) {
		if (this.animation !== null)
			this.animation.drawFrame(this.game.clockTick, ctx, this.x + this.animation.offsetX,
					this.y + this.animation.offsetY, this.sizeScale * this.absoluteSizeScale, this.sizeScale * this.absoluteSizeScale);
	} else {
		this.other.draw(ctx, this.x, this.y, this.sizeScale * this.absoluteSizeScale);
	}
    Entity.prototype.draw.call(this);
	ctx.globalAlpha = 1;
};

/**
    Powerup
*/

function Powerup(game, x, y, type) {
	this.step = 0;
	this.x = x;
	this.y = y;
    Entity.call(this, game, x, y);
	
    this.hitBoxDef = {
    	width: 32, height: 32, offsetX: 0, offsetY: 0, growthX: 0, growthY: 0
    };
    drawHitBox(this);
}

Powerup.prototype.update = function () {
	// Only update when in the screen
	if (isOnScreen(this)) {
		this.game.addEntity(new Particle(IMG_PART, this.x, this.y - 10, 0.2, -0.2, 0.2, -0.2, 0, 0, 5, 5, 10, 50, 0.7, 0.2, true, this.game,
			new Animation(ASSET_MANAGER.getAsset("./img/pink_flare.png"), 0, 0, 64, 64, 0.03, 16, true, false, 0, 0)));
        if (checkCollision(this, this.game.player1)) {
            playSound(healSound);
            
            var damageParticle = new Particle(TEXT_PART, this.game.player1.hitBox.x, this.game.player1.hitBox.y, 
                    0.2, -0.2, -3, -3, 0, 0.1, 0, 5, 10, 50, 1, 0, false, this.game);
            var damageText = new TextElement("", "Lucida Console", 25, "#ADFF2F", "black");
            var damage = 30;
            damageText.text = damage;
            damageParticle.other = damageText;
            this.game.addEntity(damageParticle);
            this.game.player1.currentHealth += damage;
            if (this.game.player1.currentHealth >= this.game.player1.maxHealth) {
            	this.game.player1.currentHealth = this.game.player1.maxHealth;
            }
            this.removeFromWorld = true;
        }
	}
    Entity.prototype.update.call(this);
};

Powerup.prototype.draw = function (ctx) { 
    Entity.prototype.draw.call(this);
}

/**
    Voidling (VOIDLING ID)
*/

function Voidling(game, x, y, voidlingType) {
    // Number Variables
    this.x = x;
    this.y = y;
	this.step = 0;
    this.walkSpeed = 2;
    this.attackableTimer = 0;
    this.explosionDamage = 20;
    this.touchDamage = 10;
    this.maxHealth = 3.0;
    this.currentHealth = this.maxHealth;
    this.currentHealthTemp = this.currentHealth;
    // String Variables
    this.type = voidlingType;
    this.lastDirection = "Right";
    // Boolean Variables    
    this.attackEnabled = true;
    this.dead = false;
    this.attackable = true;
    // Animations
    this.walkAnimationRight = new Animation(ASSET_MANAGER.getAsset("./img/Malzahar/VoidlingRight.png"), 0, 0, 97, 60, 0.1, 4, true, false, 0, 0);
    this.walkAnimationLeft = new Animation(ASSET_MANAGER.getAsset("./img/Malzahar/VoidlingLeft.png"), 0, 0, 97, 60, 0.1, 4, true, false, 0, 0);
    
    // Type Control
    if (voidlingType == "touch") {
        this.walkSpeed = 4;
    } else if (voidlingType == "explode") {
        this.walkAnimationRight = new Animation(ASSET_MANAGER.getAsset("./img/Malzahar/VoidlingRightExplode.png"), 0, 0, 97, 60, 0.1, 4, true, false, 0, 0);
        this.walkAnimationLeft = new Animation(ASSET_MANAGER.getAsset("./img/Malzahar/VoidlingLeftExplode.png"), 0, 0, 97, 60, 0.1, 4, true, false, 0, 0);
    }
    this.walkAnimation = this.walkAnimationLeft;

    Entity.call(this, game, x, y);

    this.hitBoxDef = {
    	width: 75, height: 60, offsetX: 15, offsetY: 0, growthX: 0, growthY: 0
    };
    drawHitBox(this);
}

Voidling.prototype.update = function() {
    if (this.attackableTimer > 0) {
        this.attackableTimer--;
        if (this.attackableTimer <= 0) {
            this.attackable = true;
        }
    }
    
    if (this.attackable) {
    	if (this.game.player1.y >= this.y + 30) {
    		// Don't hit the head
    	} else if (this.type == "explode") {
            if (checkCollision(this, this.game.player1)) {
                if (this.game.player1.vulnerable && (!this.game.player1.attacking)) {
                    this.currentHealth = 0;
                    playSound(lightningSound);
                    this.game.player1.vulnerable = false;
                    var damageParticle = new Particle(TEXT_PART, this.game.player1.hitBox.x, this.game.player1.hitBox.y, 
                            0.2, -0.2, -3, -3, 0, 0.1, 0, 5, 10, 50, 1, 0, false, this.game);
                    var damageText = new TextElement("", "Lucida Console", 25, "red", "black");
                    var damage = this.explosionDamage;
                    damageText.text = damage;
                    damageParticle.other = damageText;
                    this.game.addEntity(damageParticle);
                    this.game.player1.currentHealth -= this.explosionDamage;
                    this.game.player1.invulnTimer = this.game.player1.invulnTimerMax;
                    this.game.player1.hitByAttack = true;   
                    if (this.lastDirection == "Left") {
                        this.game.player1.xVelocity = -2;
                        this.game.player1.lastDirection = "Right";
                        this.game.player1.hurtAnimation = this.game.player1.hurtAnimationRight;
                    } else if (this.lastDirection == "Right") {
                        this.game.player1.xVelocity = 2;
                        this.game.player1.lastDirection = "Left";
                        this.game.player1.hurtAnimation = this.game.player1.hurtAnimationLeft;
                    }
                }
            }
        } else if (this.type == "touch") {
            if (checkCollision(this, this.game.player1)) {
                if (this.game.player1.vulnerable && (!this.game.player1.attacking)) {
                    playSound(hitSound);                    
                    this.game.player1.vulnerable = false;
                    var damageParticle = new Particle(TEXT_PART, this.game.player1.hitBox.x, this.game.player1.hitBox.y, 
                            0.2, -0.2, -3, -3, 0, 0.1, 0, 5, 10, 50, 1, 0, false, this.game);
                    var damageText = new TextElement("", "Lucida Console", 25, "red", "black");
                    var damage = this.touchDamage;
                    damageText.text = damage;
                    this.walkSpeed *= -1;
                    damageParticle.other = damageText;
                    this.game.addEntity(damageParticle);
                    this.game.player1.currentHealth -= this.touchDamage;
                    this.game.player1.invulnTimer = this.game.player1.invulnTimerMax;
                    this.game.player1.hitByAttack = true;   
                    if (this.lastDirection == "Left") {
                        this.game.player1.xVelocity = -2;
                        this.game.player1.lastDirection = "Right";
                        this.game.player1.hurtAnimation = this.game.player1.hurtAnimationRight;
                    } else if (this.lastDirection == "Right") {
                        this.game.player1.xVelocity = 2;
                        this.game.player1.lastDirection = "Left";
                        this.game.player1.hurtAnimation = this.game.player1.hurtAnimationLeft;
                    }
                }
            }
            
        }
    }
    
    // Death
    if (this.currentHealth <= 0 && !this.dead) {
        playSound(voidlingDeathSound);
        this.dead = true;
        this.attackable = false;
        this.solid = false;
        var particle = new Particle(PART_GENERATOR,
                this.x + this.hitBox.width / 2,
                this.y + this.hitBox.height / 2, 
                0, 0, 0, 0, 0, 0, 0, 20, 0, 0, 0, 0, false, this.game);
        var element = new CircleElement(2 + Math.random() * 1, "#290d4c", "#160f3d");
        particle.other = element;
        this.game.addEntity(particle);
        this.removeFromWorld = true;
    }
    var that = this;
    var switchDirection = false;
    
    // Platform detection
    var platformFound = false;
    this.game.currentMap.platforms.forEach(function(currentPlatform) {
        if (currentPlatform.hSpeed == 0 && currentPlatform.vSpeed == 0) {
            if (that.hitBox.x > currentPlatform.hitBox.x && that.walkSpeed < 0) {
                if (that.hitBox.x <= (currentPlatform.hitBox.x + currentPlatform.hitBox.width)) {
                    if (that.hitBox.y + that.hitBox.height / 2 <= currentPlatform.hitBox.y) {
                        if (that.hitBox.y + that.hitBox.height >= currentPlatform.hitBox.y) {
                            platformFound = true;
                        }
                    }
                }
            } else if (that.walkSpeed < 0) {
                var platformFound2 = false;
                that.game.currentMap.platforms.forEach(function(currentPlatform2) {
                    if (currentPlatform.hitBox.x - 2 >= currentPlatform2.hitBox.x) {
                        if (currentPlatform.hitBox.x - 2 <= currentPlatform2.hitBox.x + currentPlatform2.hitBox.width) {
                            if (currentPlatform.hitBox.y + 2 + that.hitBox.height / 2 >= currentPlatform2.hitBox.y) {
                                if (currentPlatform.hitBox.y + 2 <= currentPlatform2.hitBox.y + currentPlatform2.hitBox.height) {
                                    if (currentPlatform2.hSpeed == 0 && currentPlatform2.vSpeed == 0) {
                                        platformFound2 = true;
                                    }
                                }
                            }
                        }
                    }
                });
                
                if (platformFound2) {
                    if (that.hitBox.x <= currentPlatform.hitBox.x && that.hitBox.x + that.hitBox.width >= currentPlatform.hitBox.x) {
                        if (that.hitBox.x + that.hitBox.width <= (currentPlatform.hitBox.x + currentPlatform.hitBox.width)) {
                            if (that.hitBox.y + that.hitBox.height / 2 <= currentPlatform.hitBox.y) {
                                if (that.hitBox.y + that.hitBox.height >= currentPlatform.hitBox.y) {
                                    platformFound = true;
                                }
                            }
                        }
                    }
                }
            } else if (that.walkSpeed > 0) {
                var platformFound2 = false;
                that.game.currentMap.platforms.forEach(function(currentPlatform2) {
                    if (currentPlatform.hitBox.x + currentPlatform.hitBox.width + 2 >= currentPlatform2.hitBox.x + currentPlatform2.hitBox.width) {
                        if (currentPlatform.hitBox.x + currentPlatform.hitBox.width + 2 <= currentPlatform2.hitBox.x + currentPlatform2.hitBox.width * 2) {
                            if (currentPlatform.hitBox.y + 2 + that.hitBox.height / 2 >= currentPlatform2.hitBox.y) {
                                if (currentPlatform.hitBox.y + 2 <= currentPlatform2.hitBox.y + currentPlatform2.hitBox.height) {
                                    if (currentPlatform2.hSpeed == 0 && currentPlatform2.vSpeed == 0) {
                                        platformFound2 = true;
                                    }
                                }
                            }
                        }
                    }
                });
                
                if (platformFound2) {
                    if (that.hitBox.x <= currentPlatform.hitBox.x && that.hitBox.x + that.hitBox.width >= currentPlatform.hitBox.x) {
                        if (that.hitBox.x <= (currentPlatform.hitBox.x + currentPlatform.hitBox.width)) {
                            if (that.hitBox.y + that.hitBox.height / 2 <= currentPlatform.hitBox.y) {
                                if (that.hitBox.y + that.hitBox.height >= currentPlatform.hitBox.y) {
                                    platformFound = true;
                                }
                            }
                        }
                    }
                }
            }
        }
    });
    
    if (this.hitBox.y + this.hitBox.height >= 380) {
        platformFound = true;
    }
    if (!platformFound) {
        switchDirection = true;
    }
    if ((this.x + this.walkSpeed <= this.game.liveCamera.x && this.walkSpeed < 0) ||
    		(this.x + this.hitBox.width >= this.game.liveCamera.x + this.game.liveCamera.width && this.walkSpeed > 0)) {
    	switchDirection = true;
    }
    if (switchDirection) {
    	//console.log("voidling at "+this.x+", "+this.y+" SWAP");
    	that.walkSpeed *= -1;
    }
    this.x += this.walkSpeed;
    if (this.walkSpeed < 0) {
        this.lastDirection = "Left";
    } else {
        this.lastDirection = "Right";
    }
    
	Entity.prototype.update.call(this);
}

Voidling.prototype.draw = function (ctx) {
	ctx.globalAlpha = 1;
    if (!this.attackable) {
        ctx.globalAlpha = 0.5;
    }
	if (!this.dead) {
		if (this.walkSpeed > 0) {
			this.walkAnimation = this.walkAnimationRight;
		} else {
			this.walkAnimation = this.walkAnimationLeft;
        }
        this.walkAnimation.drawFrame(this.game.clockTick, ctx, this.x + this.walkAnimation.offsetX, this.y + this.walkAnimation.offsetY);
	}
	drawHitBox(this, ctx);
	Entity.prototype.draw.call(this);
	ctx.globalAlpha = 1;
}

/**
    Malzahar (MALZAHAR ID)
*/

function Malzahar(game) {
	// Number Variables
	this.alpha = 1;
	this.step = 0;
    this.walkSpeed = 4;
    this.autoDamage = 30;
    this.spawnCount = 0;
    this.spawnTimer = 0;
    this.destinationX = -1;
    this.attackIndex = 0;
    this.attackCount = 0;
    this.energy = 0; //denotes if an attack is charged
    this.idleTimerMax = 110;
    this.idleTimer = this.idleTimerMax;
    this.maxHealth = 40.0;
    this.currentHealth = this.maxHealth;
    this.currentHealthTemp = this.currentHealth;   
    // String Variables
    this.state = "idle";
	this.lastDirection = "Left";    
    // Boolean Variables
    this.attackEnabled = false;
    this.dead = false;
    this.solid = false;
    this.attackable = true;
    this.walkToDestination = false;
    
    /**
     * Initial cooldowns of skills.
     * Skill ids:
     * 1) Walk to nearest edge, scream, and throw a barrage of void balls.
     * 2) Undefined...
     */
    this.cooldown = [500, 0, 0, 0];
    
    // Animations
	this.idleRight = new Animation(ASSET_MANAGER.getAsset("./img/Malzahar/IdleRight.png"), 0, 0, 85, 150, 0.2, 12, true, false, 0, -20);
	this.idleLeft = new Animation(ASSET_MANAGER.getAsset("./img/Malzahar/IdleLeft.png"), 0, 0, 85, 150, 0.2, 12, true, false, 0, -20);
    this.idleAnimation = this.idleLeft;
    this.walkAnimationRight = this.idleRight;
    this.walkAnimationLeft = this.idleLeft;
    this.walkAnimation = this.walkAnimationLeft;
    this.attackAnimationRight = new Animation(ASSET_MANAGER.getAsset("./img/Malzahar/ERight.png"), 0, 0, 114, 180, 0.1, 9, false, false, -10, -40);
    this.attackAnimationLeft = new Animation(ASSET_MANAGER.getAsset("./img/Malzahar/ELeft.png"), 0, 0, 114, 180, 0.1, 9, false, false, 0, -40);
    this.attackAnimation = this.attackAnimationLeft;  
    this.currentAnimation = this.idleLeft;
 
    Entity.call(this, game, 1400, 235);
    
    this.hitBoxDef = {
    	width: 80, height: 150, offsetX: 5, offsetY: -5, growthX: 0, growthY: 0
    };
    drawHitBox(this);
}

Malzahar.prototype.update = function() {
    for (i = 0; i < this.cooldown.length; i++) {
        if (this.cooldown[i] > 0)
            this.cooldown[i]--;
    }
	if (this.alpha < 1 && !this.dead && this.energy === 0) {
		this.alpha += 0.01;
		if (this.alpha >= 1) {
			this.alpha = 1;
			this.game.currentPhase = 14;
		}
		console.log("REAPPEARING INTO THE WORLD! "+this.x+","+this.y+", player is "+this.game.player1.x+", "+this.game.player1.y+", gamephase="+this.game.currentPhase);
        this.state = "idle";
	    var newParticle = new Particle(PART_SECONDARY, this.x + Math.random() * 100, this.y + Math.random() * 160, 
				-2, 2, -2, 2, 0, 0.1, 0, 30, 0, 15, .7, .2, true, this.game);
	    var element = new CircleElement(6 + Math.random() * 3, "#240340", "#131d4f");
	   	newParticle.other = element;
	    this.game.addEntity(newParticle);
	}
    if (this.spawnTimer >= 0 && this.spawnCount > 0) {
        if (this.spawnTimer <= 0) {
            this.spawnTimer = 50;
            this.spawnCount--;
            playSound(spawnSound);
            var random = Math.floor(Math.random() * 2);
            var random2 = Math.floor(Math.random() * 41) - 20;
            if (random == 0) {
                var voidling = new Voidling(this.game, this.hitBox.x + random2, this.hitBox.y + this.hitBox.height - 50, "touch");
                voidling.attackable = false;
                if (this.game.player1.hitBox.x + this.game.player1.hitBox.width < this.hitBox.x) {
                    voidling.lastDirection = "left";
                    voidling.walkSpeed *= -1;
                }
                voidling.attackableTimer = 50;
                this.game.addEntity(voidling);
            } else {
                var voidling = new Voidling(this.game, this.hitBox.x + random2, this.hitBox.y + this.hitBox.height - 50, "explode");
                voidling.attackable = false;
                if (this.game.player1.hitBox.x + this.game.player1.hitBox.width < this.hitBox.x) {
                    voidling.lastDirection = "left";
                    voidling.walkSpeed *= -1;
                }
                voidling.attackableTimer = 50;
                this.game.addEntity(voidling);
            }
        }
        this.spawnTimer--;
    }
    if (this.game.currentPhase === 1) {
    	this.game.currentBoss = this;
    }
	if (this.game.currentPhase === 2 && this.currentHealth <= 0) { // Phase transition
		this.game.currentPhase = 3;
		this.dead = true;
        this.attackable = false;
        this.attackEnabled = false;
		var chat = new TextBox(this.game, "./img/Chat/MalzSquare.png", "HEhHehEEhHe...");
		this.game.addEntity(chat);
        playSound(disappearSound);
	}
    if (this.game.currentPhase === 3) {
    	if (this.alpha > 0) {
    		this.alpha -= 0.01;
    	    var newParticle = new Particle(PART_SECONDARY, this.x + Math.random() * 100, this.y + Math.random() * 160, 
    				-2, 2, -2, 2, 0, 0.1, 0, 30, 0, 15, .7, .2, true, this.game);
    	    var element = new CircleElement(6 + Math.random() * 3, "#240340", "#131d4f");
    	   	newParticle.other = element;
    	    this.game.addEntity(newParticle);
            if (this.alpha <= 0) {
                this.x = 3000;
            }
    	}
    } else if (this.game.currentPhase === 4) {
    	this.energy = 0;
        this.maxHealth = 100.0;
        this.currentHealth = this.maxHealth;
    } else if (this.game.currentPhase === 11) {
        this.lastDirection = "left";
    	this.y = -1460;
    	this.x = 1400;
        this.energy = 0;
        this.game.player1.canControl = false;
		var chat = new TextBox(this.game, "./img/Chat/MalzSquare.png", "So you're still alive... but I foresee no longer!");
		this.game.addEntity(chat);
		this.game.currentPhase = 12;
		this.dead = false;
    } else if (this.game.currentPhase === 12) {
        //fadeClimbMusicOut();
        earthRumble.pause();
    } else if (this.game.currentPhase === 14) {
        //fadeClimbMusicOut();
        //fadeBossMusicIn();
    }
    if ((this.game.currentPhase === 2 || this.game.currentPhase === 14) && this.attackEnabled) { // Malz attack code
	    if (this.state == "attacking") {
	        if (this.attackAnimation.currentFrame() >= this.attackAnimation.frames) {
	            this.state = "idle";
                if (this.attackIndex == 2) {
                    this.idleTimer = this.idleTimerMax * 1.5;
                } else {
                    this.idleTimer = this.idleTimerMax;
                }                    
	            this.attackAnimation.elapsedTime = 0;
	        }
	    }
	    if (this.state != "attacking") {
	        if (this.idleTimer > 0) {
	            this.idleTimer--;
	            if (this.lastDirection == "Left") {
	                this.idleAnimation = this.idleLeft;
	            } else {
	                this.idleAnimation = this.idleRight;
	            }
	        } else {
	            var distance = getXDistance(this.game.player1, this);
	            if (this.energy === 4)
	            	this.energy = 0;
	            if (this.energy === 3) { //blast attack
	            	this.energy = 4; //to prevent an autoattack
                    var particle = new Particle(VOID_STORM, this.x + this.hitBox.width / 2, this.y + 25, 
                            0, 0, 0, 0, 0, 0, 0, 50, 0, 10, 0, 0, false, this.game);
                    playSound(laserSound);
                    this.state = "attacking";
                    this.attackIndex = 1; //basic attack
                    if (this.lastDirection == "Left") {
                        this.attackAnimation = this.attackAnimationLeft;
                        particle.direction = "Left";
                    } else {
                        this.attackAnimation = this.attackAnimationRight;
                        particle.direction = "Right";
                    }
                    this.game.addEntity(particle);
	            } else if (this.energy === 2) { //teleport
			        console.log("supposedly teleporting?");
	            	if (this.x != this.destinationX && this.destinationX != -1) {
                        if (this.destinationX > this.hitBox.x + this.hitBox.width) {
                            this.lastDirection = "Right";
                            this.walkAnimation = this.idleRight;
                        } else if (this.destinationX < this.hitBox.x) {
                            this.lastDirection = "Left";
                            this.walkAnimation = this.idleLeft;
                        }
	            		//particles on the current body
	            	    var newParticle = new Particle(PART_SECONDARY, this.x + Math.random() * 100, this.y + Math.random() * 160, 
	            				-2, 2, -2, 2, 0, 0.1, 0, 30, 0, 15, .7, .2, true, this.game);
	            	    var element = new CircleElement(6 + Math.random() * 3, "#240340", "#131d4f");
	            	   	newParticle.other = element;
	            	    this.game.addEntity(newParticle);
	            	    //particles on the teleport location
	            	    newParticle = new Particle(PART_SECONDARY, this.destinationX + Math.random() * 100, this.y + Math.random() * 160, 
	            				-1, 1, -1, 1, 0, 0.1, 0, 30, 0, 15, .7, .2, true, this.game);
	            	    element = new CircleElement(6 + Math.random() * 3, "#240340", "#131d4f");
	            	   	newParticle.other = element;
	            	    this.game.addEntity(newParticle);
	            		this.alpha -= 0.01;
	            		console.log("TELEPORTING from "+this.x+" to "+this.destinationX+", alpha = "+this.alpha);
	            		if (this.alpha <= 0) {
	            			this.alpha = 0;
                            if (this.x < this.destinationX) {
                                this.lastDirection = "Left";
                                this.idleAnimation = this.idleLeft;
                                this.walkAnimation = this.idleLeft;
                            } else {
                                this.lastDirection = "Right";
                                this.idleAnimation = this.idleRight;
                                this.walkAnimation = this.idleRight;
                            }
	            			this.x = this.destinationX;
	            			this.destinationX = -1;
	            		}
	            	} else {
	            		console.log("TELEPORTING ARRIVAL from "+this.x+" to "+this.destinationX+", alpha = "+this.alpha);
	            		if (this.alpha < 1) {
	            			this.alpha += .02;
		            	    var newParticle = new Particle(PART_SECONDARY, this.x + Math.random() * 100, this.y + Math.random() * 160, 
		            				-2, 2, -2, 2, 0, 0.1, 0, 30, 0, 15, .7, .2, true, this.game);
		            	    var element = new CircleElement(6 + Math.random() * 3, "#240340", "#131d4f");
		            	   	newParticle.other = element;
		            	    this.game.addEntity(newParticle);
	            		} else {
	            			this.energy = 3; //blast attack
	            		}
	            	}
	            } else if (this.energy === 1) { //spawn voidlings
                	this.energy = 0;
                    this.spawnCount = 3;
                    this.spawnTimer = 0;
                    this.state = "attacking";
                    this.attackIndex = 2;
                } else if (this.cooldown[0] == 0 && !this.walkToDestination) {
	                this.energy = 1;
	                this.walkToDestination = true;
	                if (this.x < 325 + 800) {
	                    this.destinationX = 600 + 800;
	                } else {
	                    this.destinationX = 50 + 800;
	                }
	                this.cooldown[0] = 750;
	            } else if (this.cooldown[1] == 0 && !this.walkToDestination && this.game.currentPhase >= 14) {
	            	this.cooldown[1] = 1500;
	                this.energy = 2; //teleporting
	                if (this.x < 325 + 800) {
	                    this.destinationX = 600 + 800;
	                } else {
	                    this.destinationX = 50 + 800;
	                }
	                this.walkToDestination = false;
	                this.state = "idle";
	                console.log("TELEPORTIONG TO "+this.destinationX);
                    playSound(teleportSound);
	            }
	            if (this.walkToDestination)
	                distance = this.destinationX - this.x;
	            else
	            	distance = 0;
	            if (distance === 0 && this.energy === 0) { //destination must be the same as current location
	                this.destinationX = -1;
	                this.walkToDestination = false;
	            }
	            if (distance < 0) {
	                this.state = "walking";
	                this.lastDirection = "Left";
	                this.walkAnimation = this.walkAnimationLeft;
	                this.x -= this.walkSpeed;
	                if (this.walkToDestination && this.x <= this.destinationX) { //destination reached
	                    this.destinationX = -1;
	                    this.walkToDestination = false;
	                }
	            } else if (distance > 0) {
	                this.state = "walking";
	                this.lastDirection = "Right";
	                this.walkAnimation = this.walkAnimationRight;
	                this.x += this.walkSpeed;
	                if (this.walkToDestination && this.x >= this.destinationX) { //destination reached
	                    this.destinationX = -1;
	                    this.walkToDestination = false;
	                }
	            } else if (distance === 0 && !this.walkToDestination && this.energy === 0) { //attack if not walking or charging attack
                    var particle = new Particle(VOID_PORTAL, this.game.player1.x + this.game.player1.hitBox.width / 2, this.y + 150, 
                            0, 0, 0, 0, 0, 0, 0, 200, 0, 10, 0, 0, false, this.game);
                    var element = new CircleElement(20 + Math.random() * 8, "#240340", "#131d4f");
                    particle.other = element;
                    particle.attackId = 1; //void ball
                    this.game.addEntity(particle);
                    playSound(chargedBurstSound);
                    this.state = "attacking";
                    this.attackIndex = 1; //basic attack
                    if (this.game.player1.hitBox.x > this.hitBox.x + (this.hitBox.width / 2)) {
                        this.lastDirection = "Right";
                    } else {
                        this.lastDirection = "Left";
                    }
                    if (this.lastDirection == "Left") {
                        this.attackAnimation = this.attackAnimationLeft;
                    } else {
                        this.attackAnimation = this.attackAnimationRight;
                    }
	            }
	            
	        }
	    }
    }
    Entity.prototype.update.call(this);
}

Malzahar.prototype.draw = function (ctx) {
    ctx.globalAlpha = this.alpha;
    if (!this.dead) {
        if (this.state === "idle") {
            this.idleAnimation.drawFrame(this.game.clockTick, ctx, this.x + this.idleAnimation.offsetX, this.y + this.idleAnimation.offsetY);
            this.currentAnimation = this.idleAnimation;
        } else if (this.state === "walking") {
            this.walkAnimation.drawFrame(this.game.clockTick, ctx, this.x + this.walkAnimation.offsetX, this.y + this.walkAnimation.offsetY);
            this.currentAnimation = this.walkAnimation;
        } else if (this.state === "attacking") {
            this.attackAnimation.drawFrame(this.game.clockTick, ctx, this.x + this.attackAnimation.offsetX, this.y + this.attackAnimation.offsetY);
            this.currentAnimation = this.attackAnimation;
        }
    }
    ctx.globalAlpha = 1;    
    drawHitBox(this, ctx);
    Entity.prototype.draw.call(this);
};

/**
    Reksai (REKSAI ID)
*/

function Reksai(game) {
    // Number Variables
	this.step = 0;
    this.walkSpeed = 2;
    this.autoDamage = 30;
    this.destinationX = -1;
    this.attackIndex = 0;
    this.attackCount = 0;
    this.energy = 0; // Denotes if an attack is charged
    this.idleTimerMax = 110;
    this.idleTimer = this.idleTimerMax;
    this.maxHealth = 100.0;
    this.currentHealth = this.maxHealth;
    this.currentHealthTemp = this.currentHealth;  
    // String Variables
    this.state = "idle";
	this.lastDirection = "Left";
    // Boolean Variables
    this.dead = false;
    this.solid = true;
    this.attackable = true;
    this.walkToDestination = false;
    
    /**
     * Initial cooldowns of skills.
     * Skill ids:
     * 1) Walk to nearest edge, scream, and throw a barrage of void balls.
     * 2) Burrow attack
     */
    this.cooldown = [250, 750, 0, 0];
    
    // Animations
	this.idleRight = new Animation(ASSET_MANAGER.getAsset("./img/Reksai/ReksaiIdleRight.png"), 0, 0, 151, 100, 0.1, 10, true, false, 0, 0);
	this.idleLeft = new Animation(ASSET_MANAGER.getAsset("./img/Reksai/ReksaiIdleLeft.png"), 0, 0, 151, 100, 0.1, 10, true, false, 0, 0);
    this.idleAnimation = this.idleLeft;
    this.walkAnimationRight = new Animation(ASSET_MANAGER.getAsset("./img/Reksai/ReksaiWalkRight.png"), 0, 0, 192, 107, 0.1, 17, true, false, -10, 0);
    this.walkAnimationLeft = new Animation(ASSET_MANAGER.getAsset("./img/Reksai/ReksaiWalkLeft.png"), 0, 0, 192, 107, 0.1, 17, true, false, -20, 0);
    this.walkAnimation = this.walkAnimationLeft;
    this.attackAnimationRight = new Animation(ASSET_MANAGER.getAsset("./img/Reksai/AttackRight.png"), 0, 0, 198, 135, 0.1, 13, false, false, 0, -40);
    this.attackAnimationLeft = new Animation(ASSET_MANAGER.getAsset("./img/Reksai/AttackLeft.png"), 0, 0, 198, 135, 0.1, 13, false, false, -50, -40);
    this.attackAnimation = this.attackAnimationLeft;  
    this.screamAnimationRight = new Animation(ASSET_MANAGER.getAsset("./img/Reksai/ScreamRight.png"), 0, 0, 177, 180, 0.1, 17, false, true, -40, -80);
    this.screamAnimationLeft = new Animation(ASSET_MANAGER.getAsset("./img/Reksai/ScreamLeft.png"), 0, 0, 177, 180, 0.1, 17, false, true, 0, -80);
    this.currentAnimation = this.idleLeft;      
    
    Entity.call(this, game, 600, 295);
    
    this.hitBoxDef = {
    	width: 140, height: 100, offsetX: 5, offsetY: 0, growthX: 0, growthY: 0
    };
    drawHitBox(this);
}

Reksai.prototype.update = function() {
	this.step++;
    if (this.currentHealth <= 0 && !this.dead) {
    	if (this.game.currentPhase === 0) {
            playSound(screamSound);
    	}
        this.dead = true;
        this.attackable = false;
        this.solid = false;
        var particle = new Particle(PART_GENERATOR,
                this.x + this.hitBox.width / 2,
                this.y + this.hitBox.height / 2, 
                0, 0, 0, 0, 0, 0, 0, 100, 0, 0, 0, 0, false, this.game);
        var element = new CircleElement(8 + Math.random() * 6, "#290d4c", "#160f3d");
        particle.other = element;
        this.game.addEntity(particle);
        this.removeFromWorld = true;
        this.game.addEntity(new Powerup(this.game, this.hitBox.x + this.hitBox.width / 2, this.hitBox.y + this.hitBox.height / 2, 0));
    }
    for (i = 0; i < this.cooldown.length; i++) {
        if (this.cooldown[i] > 0)
            this.cooldown[i]--;
    }
    if (this.energy === 3 && this.attackCount > 0 && this.step % 5 === 0) {
        var originX = this.lastDirection === "Right" ? this.x + this.hitBox.width : this.x;
        var originY = this.y + 50;
        var speed = this.lastDirection === "Left" ? -10 : 10;
        var particle = new Particle(VOID_BALL, originX, originY, 
                speed, speed, -1.5 * this.attackCount, -1.5 * this.attackCount, 0.3, 0, 0, 100, 0, 10, 1, 0, false, this.game);
        var element = new CircleElement(20 + Math.random() * 8, "#240340", "#131d4f");
        particle.other = element;
        particle.attackId = 1; // Void ball
        this.game.addEntity(particle);
        this.attackCount--;
        if (this.attackCount === 0)
            this.energy = 0;
        playSound(shootSound);
    }
    if (this.state == "attacking") {
        this.attackable = false;
        if (this.attackAnimation.currentFrame() >= this.attackAnimation.frames) {
            this.state = "idle";
            if (this.attackIndex != 2) //no delay after scream
                this.idleTimer = this.idleTimerMax;   
            this.attackAnimation.elapsedTime = 0;
            this.attackIndex = 0;
            this.hitBoxDef.growthX = 0;
            this.hitBoxDef.growthY = 0;
            this.attackable = true;
            this.game.player1.hitByAttack = false;
	        if (this.energy === 4) { //burrow 
	        	this.energy = 5; //burrowed
	            var particle = new Particle(BURROW_PART, this.x + this.hitBox.width / 2, this.y + 50, 
	                    0, 0, 0, 0, 0, 0, 0, 400, 0, 10, 0, 0, false, this.game);
	            for (i = 0; i < 10; i++) {
	    		    var newParticle = new Particle(PART_SECONDARY, this.x + this.hitBox.width / 2, this.y + this.hitBox.height / 2, 
	    					-3, 3, -7, 4, 0, 0.1, 0, 30, 0, 15, .7, .2, true, this.game,
	    		        	new Animation(ASSET_MANAGER.getAsset("./img/Particle/smoke.png"), 0, 0, 256, 256, 0.03 + Math.random() * 0.04, 20, true, false, 0, 0));
	    		    newParticle.absoluteSizeScale = .2 + Math.random() * .2;
	    		    this.game.addEntity(newParticle);
	            }
                playSound(burrowingSound);
                playSound(rocksSound);
	            this.game.addEntity(particle);
	        	this.y += 1000; //that's one way to do it!
	        }
        } else { 
            if (this.attackIndex === 1 && this.attackAnimation.currentFrame() >= 4 && this.attackAnimation.currentFrame() <= this.attackAnimation.frames - 8) {
                if (this.attackAnimation.currentFrame() < 6) {
                    this.hitBoxDef.growthY = -20;
                } else {
                    this.hitBoxDef.growthY = 0;
                }
                if (checkCollision(this, this.game.player1) && !this.game.player1.hitByAttack) {
                    
                    if (this.game.player1.vulnerable) {
                        this.game.player1.vulnerable = false;
                        var damageParticle = new Particle(TEXT_PART, this.game.player1.hitBox.x, this.game.player1.hitBox.y, 
                                0.2, -0.2, -3, -3, 0, 0.1, 0, 5, 10, 50, 1, 0, false, this.game);
                        var damageText = new TextElement("", "Lucida Console", 25, "red", "black");
                        var damage = this.autoDamage;
                        this.game.player1.invulnTimer = this.game.player1.invulnTimerMax;
                        damageText.text = damage;
                        damageParticle.other = damageText;
                        this.game.addEntity(damageParticle);
                        this.game.player1.currentHealth -= damage;
                        this.game.player1.hitByAttack = true;
                        playSound(hitSound);
                        if (this.lastDirection == "Left") {
                            this.game.player1.xVelocity = -2;
                            this.game.player1.lastDirection = "Right";
                            this.game.player1.hurtAnimation = this.game.player1.hurtAnimationRight;
                        } else if (this.lastDirection == "Right") {
                            this.game.player1.xVelocity = 2;
                            this.game.player1.lastDirection = "Left";
                            this.game.player1.hurtAnimation = this.game.player1.hurtAnimationLeft;
                        }
                    }
                    
                }
            } else if (this.attackIndex === 4 && this.attackAnimation.currentFrame() <= 2) {
                rocksSound.pause();
                if (!isPlaying(unburrowingSound)) {
                    playSound(unburrowingSound);
                }
                if (checkCollision(this, this.game.player1) && !this.game.player1.hitByAttack) {
                    if (this.game.player1.vulnerable) {
                        this.game.player1.vulnerable = false;
                        var damageParticle = new Particle(TEXT_PART, this.game.player1.hitBox.x, this.game.player1.hitBox.y, 
                                0.2, -0.2, -3, -3, 0, 0.1, 0, 5, 10, 50, 1, 0, false, this.game);
                        var damageText = new TextElement("", "Lucida Console", 25, "red", "black");
                        var damage = 20;
                        this.game.player1.invulnTimer = this.game.player1.invulnTimerMax * 2.5;
                        this.game.player1.yVelocity = 13;
                        this.game.player1.jumping = true;
                        damageText.text = damage;
                        damageParticle.other = damageText;
                        this.game.addEntity(damageParticle);
                        this.game.player1.currentHealth -= damage;
                        this.game.player1.hitByAttack = true;
                        playSound(hitSound);
                        if (this.lastDirection == "Left") {
                            this.game.player1.xVelocity = -5;
                            this.game.player1.lastDirection = "Right";
                            this.game.player1.hurtAnimation = this.game.player1.hurtAnimationRight;
                        } else if (this.lastDirection == "Right") {
                            this.game.player1.xVelocity = 5;
                            this.game.player1.lastDirection = "Left";
                            this.game.player1.hurtAnimation = this.game.player1.hurtAnimationLeft;
                        }
                    }
                }
            }
        }
    }
    if (this.walkToDestination) {
        this.walkSpeed = 4;
    } else {
        this.walkSpeed = 2;
    }
    if (this.state != "attacking") {
    	if (this.energy === 5) { //currently burrowed into the ground
    	} else if (this.idleTimer > 0) {
            this.idleTimer--;
            if (this.lastDirection == "Left") {
                this.idleAnimation = this.idleLeft;
            } else {
                this.idleAnimation = this.idleRight;
            }
        } else {
            var distance = getXDistance(this.game.player1, this);
            if (this.cooldown[0] == 0 && !this.walkToDestination) {
                this.energy = 1;
                this.walkToDestination = true;
                if (this.x < 325) {
                    this.destinationX = 600;
                } else {
                    this.destinationX = 50;
                }
                this.cooldown[0] = 1000;
            }
            if (this.walkToDestination)
                distance = this.destinationX - this.x;
            if (distance === 0) { //destination must be the same as current location
                this.destinationX = -1;
                this.walkToDestination = false;
            }
            if (this.cooldown[1] == 0 && !this.walkToDestination) {
                this.energy = 4; //start burrow - scream first
                this.cooldown[1] = 1500;
                this.state = "attacking";
                distance = 0;
                playSound(screamSound);
                this.attackIndex = 2; //scream - this doesn't actually do any damage.
                if (this.lastDirection == "Left") {
                    this.attackAnimation = this.screamAnimationLeft;
                } else {
                    this.attackAnimation = this.screamAnimationRight;
                }
            } else if (this.energy === 1 && !this.walkToDestination && !this.dead) { //destination reached!
                this.energy = 2; //screaming
                this.state = "attacking";
                this.attackIndex = 2; //scream - this doesn't actually do any damage.
                playSound(screamSound);
                if (this.x < 325) {
                    this.lastDirection = "Right";
                } else {
                    this.lastDirection = "Left";
                }
                if (this.lastDirection == "Left") {
                    this.attackAnimation = this.screamAnimationLeft;
                } else {
                    this.attackAnimation = this.screamAnimationRight;
                }
            } else if (this.energy === 2) {
                this.state = "attacking";
                this.attackIndex = 3; //another attack that doesn't actually hit
                if (this.lastDirection == "Left") {
                    this.attackAnimation = this.attackAnimationLeft;
                } else {
                    this.attackAnimation = this.attackAnimationRight;
                }
                this.energy = 3; //start swipe
                this.attackCount = 10;
            } else if (distance < 0) {
                this.state = "walking";
                this.lastDirection = "Left";
                this.walkAnimation = this.walkAnimationLeft;
                this.x -= this.walkSpeed;
                if (this.walkToDestination && this.x <= this.destinationX) { //destination reached
                    this.destinationX = -1;
                    this.walkToDestination = false;
                }
            } else if (distance > 0) {
                this.state = "walking";
                this.lastDirection = "Right";
                this.walkAnimation = this.walkAnimationRight;
                this.x += this.walkSpeed;
                if (this.walkToDestination && this.x >= this.destinationX) { //destination reached
                    this.destinationX = -1;
                    this.walkToDestination = false;
                }
            } else if (distance === 0 && !this.walkToDestination && this.energy === 0) { //attack if not walking or charging attack
                this.state = "attacking";
                this.attackIndex = 1; //basic attack
                if (this.game.player1.hitBox.x > this.hitBox.x + (this.hitBox.width / 2)) {
                    this.lastDirection = "Right";
                } else {
                    this.lastDirection = "Left";
                }
                if (this.lastDirection == "Left") {
                    this.attackAnimation = this.attackAnimationLeft;
                } else {
                    this.attackAnimation = this.attackAnimationRight;
                }
            }
        }
    } 
    Entity.prototype.update.call(this);
}

Reksai.prototype.draw = function (ctx) {
    if (!this.dead) {
        if (this.state === "idle") {
            this.idleAnimation.drawFrame(this.game.clockTick, ctx, this.x + this.idleAnimation.offsetX, this.y + this.idleAnimation.offsetY);
            this.currentAnimation = this.idleAnimation;
        } else if (this.state === "walking") {
            this.walkAnimation.drawFrame(this.game.clockTick, ctx, this.x + this.walkAnimation.offsetX, this.y + this.walkAnimation.offsetY);
            this.currentAnimation = this.walkAnimation;
        } else if (this.state === "attacking") {
            this.attackAnimation.drawFrame(this.game.clockTick, ctx, this.x + this.attackAnimation.offsetX, this.y + this.attackAnimation.offsetY);
            this.currentAnimation = this.attackAnimation;
        }
    }
    
    drawHitBox(this, ctx);
    
    Entity.prototype.draw.call(this);
};

/**
    Character
*/

function Character(game) {
    // Number Variables
	this.runSpeed = 3;
	this.jumpSpeed = 0; // X Velocity when jumping
    this.yVelocity = 0;
    this.xVelocity = 0; // X Velocity when hit
    this.jumpYVelocity = 9; // Max Y upwards velocity when jumping
    this.gravity = 0.55;
    this.strongAttackCost = 20; // Stamina cost of strong attacks
    this.wCost = 30;
    this.eCost = 40;
    this.staminaRegen = 0.2; // 0.2
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
    this.invulnTimerMax = 20;
    this.invulnTimer = 0;
    this.ground = 370; 
    this.autoDamage = 2;
    this.autoScaling = 1;
    this.qDamage = 4;
    this.qScaling = 2;
    this.wDamage = 4;
    if (testingMode) {
        this.wDamage = 700;
    }
    // String Variables
	this.lastDirection = "Right";
    // Boolean Variables
	this.running = false;
    this.dead = false;
    this.jumping = false;
    this.falling = true;
	this.attacking = false;
    this.vulnerable = true;
    this.canControl = true;
    this.hurt = false;
    this.hitByAttack = false;
    this.leftDown = false;
    this.rightDown = false;
    this.jumpDown = false;
    this.downDown = false;
    
    this.targetHit = []; // The targets you've currently hit with your attack
      
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
    this.attackAnimationLight1Right = new Animation(ASSET_MANAGER.getAsset("./img/Riven/RivenAA1Right.png"), 0, 0, 109, 110, 0.05, 16, false, false, 2, -20);
    this.attackAnimationLight1Left = new Animation(ASSET_MANAGER.getAsset("./img/Riven/RivenAA1Left.png"), 0, 0, 109, 110, 0.05, 16, false, false, -45, -25 + 2);
    this.attackAnimationLight2Right = new Animation(ASSET_MANAGER.getAsset("./img/Riven/RivenAA2Right.png"), 0, 0, 94, 110, 0.05, 12, false, false, 4, 8 + 6);
    this.attackAnimationLight2Left = new Animation(ASSET_MANAGER.getAsset("./img/Riven/RivenAA2Left.png"), 0, 0, 94, 110, 0.05, 12, false, false, -35, 8 + 2);
    this.attackAnimationLight3Right = new Animation(ASSET_MANAGER.getAsset("./img/Riven/RivenAA3Right.png"), 0, 0, 128, 110, 0.05, 13, false, false, -20, -12);
    this.attackAnimationLight3Left = new Animation(ASSET_MANAGER.getAsset("./img/Riven/RivenAA3Left.png"), 0, 0, 138, 110, 0.05, 13, false, false, -55, -17);
    
    // Strong Side Attacks
    this.attackAnimation = null;
    this.attackAnimation1Right = new Animation(ASSET_MANAGER.getAsset("./img/Riven/RivenQ1Right.png"), 0, 0, 92, 110, 0.06, 10, false, false, -18, -29);
    this.attackAnimation1Left = new Animation(ASSET_MANAGER.getAsset("./img/Riven/RivenQ1Left.png"), 0, 0, 92, 110, 0.06, 10, false, false, -18, -29);
    this.attackAnimation2Right = new Animation(ASSET_MANAGER.getAsset("./img/Riven/RivenQ2Right.png"), 0, 0, 123.887, 97, 0.06, 9, false, false, -20, -9);
    this.attackAnimation2Left = new Animation(ASSET_MANAGER.getAsset("./img/Riven/RivenQ2Left.png"), 0, 0, 123.887, 97, 0.06, 9, false, false, -50, -9);
    this.attackAnimation3Right = new Animation(ASSET_MANAGER.getAsset("./img/Riven/RivenQ3Right.png"), 0, 0, 141.665, 123, 0.06, 12, false, false, -20, -30);
    this.attackAnimation3Left = new Animation(ASSET_MANAGER.getAsset("./img/Riven/RivenQ3Left.png"), 0, 0, 141.665, 123, 0.06, 12, false, false, -65, -30);
    
    // Down Skill (E)
    this.attackAnimationDownRight = new Animation(ASSET_MANAGER.getAsset("./img/Riven/ERight.png"), 0, 0, 87, 70, 0.08, 6, false, false, 0, 0);
    this.attackAnimationDownLeft = new Animation(ASSET_MANAGER.getAsset("./img/Riven/ELeft.png"), 0, 0, 87, 70, 0.08, 6, false, false, 0, 0);
    
    // No Directional Skill (W)
    this.attackAnimationStillRight = new Animation(ASSET_MANAGER.getAsset("./img/Riven/WRight.png"), 0, 0, 64, 125, 0.06, 9, false, false, 0, -40);
    this.attackAnimationStillLeft = new Animation(ASSET_MANAGER.getAsset("./img/Riven/WLeft.png"), 0, 0, 64, 125, 0.06, 9, false, false, 0, -40);
    
    // Hurt
    this.hurtAnimationRight = new Animation(ASSET_MANAGER.getAsset("./img/Riven/HurtRight.png"), 0, 0, 47, 80, 1, 1, false, false, 0, 10);
    this.hurtAnimationLeft = new Animation(ASSET_MANAGER.getAsset("./img/Riven/HurtLeft.png"), 0, 0, 47, 80, 1, 1, false, false, 0, 10);
    this.hurtAnimation = this.hurtAnimationLeft;
    
    this.currentAnimation = this.idleAnimationRight; // Setting starting animation
    
    Entity.call(this, game, 100, 300);
    
    this.hitBoxDef = {
    	width: 45, height: 70, offsetX: 8, offsetY: 10, growthX: 0, growthY: 0, originalOffsetX: 8
    };
    drawHitBox(this);
}

Character.prototype = new Entity();
Character.prototype.constructor = Character;

/**
 * Whether or not you can animation-cancel (the last 50% of an attack animation)
 * You can animation cancel any skill with W and E, except themself (W can cancel E or Q, it can't cancel itself).
 */
Character.prototype.canCancel = function() {
	return (this.attacking && this.attackAnimation.elapsedTime >= 0.25);
}

Character.prototype.update = function () {
	var that = this;
	if (this.game.currentPhase >= 0 && this.game.currentPhase <= 10) {
	    /*var newParticle = new Particle(VOID_GOOP, this.game.liveCamera.x + Math.random() * this.game.liveCamera.width, this.game.liveCamera.y + this.game.liveCamera.height - 1, 
				-4, 4, -6, -4, .2, 0, 0, 60, 10, 15, .5, .2, true, this.game);
        this.game.addEntity(newParticle);*/
	}
	if (this.game.currentPhase === 7) {
 		var chat = new TextBox(this.game, "./img/Chat/RivenSquare.png", "???");
 		this.game.addEntity(chat);
 		this.game.currentPhase = 8;
	}
    if (this.game.currentPhase === 10) {
        if (this.game.liveCamera.y <= -120 && this.hitBox.y + this.hitBox.height >= this.game.liveCamera.y + 500) {
            this.currentHealth = 0;
        }
    }
    if (this.currentHealth <= 0 && !this.dead) {
        playSound(lightningSound);
        this.dead = true;
        this.vulnerable = false;
        var particle = new Particle(PART_GENERATOR,
                this.game.player1.hitBox.x + this.game.player1.hitBox.width / 2,
                this.game.player1.hitBox.y + this.game.player1.hitBox.height / 2, 
                0, 0, 0, 0, 0, 0, 0, 50, 0, 0, 0, 0, false, this.game);
        var element = new SquareElement(6 + Math.random() * 4, 6 + Math.random() * 4, "#00f6cb", "#70fe37");
        particle.other = element;
        this.game.addEntity(particle);
    }
    if (!this.dead) {
        if (!this.vulnerable) {
            this.canControl = false;
            if (this.attackIndex !== 7) { //E doesn't count
                this.attacking = false;
                this.hurt = true;
            }
            this.running = false;
            this.jumpSpeed = 0;
            this.hitBoxDef.growthX = 0;
        }
        if (!this.vulnerable && this.invulnTimer > 0) {
            this.invulnTimer--;
            if (this.invulnTimer <= 0) {
                this.vulnerable = true;
                this.canControl = true;
                this.xVelocity = 0;
                this.hurt = false;
                this.hitByAttack = false;
            }
        }
        if (!this.canControl && !this.vulnerable) {
            this.x += this.xVelocity;
        }
        if (this.jumpDown && !this.attacking && !this.jumping && !this.falling && this.canControl) {
            this.jumping = true;
            playSound(jumpSound);
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
        if ((this.rightDown || this.leftDown) && !this.attacking && !this.jumping && !this.falling && this.canControl) {
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
            this.lastComboStage = 0;
        }
        
        // Process the raw attack input into the appropriate skill
        if (this.attackInput > 0 && this.canControl) { 
            switch(this.attackInput) {
                case 1: // Light attack
                    if (!this.attacking && !this.jumping && !this.falling) {
                        if (this.lastComboType != this.attackInput) { // Last Combo was different (e.g. AA vs Q) - drop combo
                            this.lastComboStage = 0;		    				
                        }
                        playSound(autoSound);
                        this.targetHit = [];
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
                    if (!this.jumping && !this.falling) {
                        if (!this.attacking && (this.rightDown || this.leftDown)) {
                            if (this.currentStamina >= this.strongAttackCost) {
                                this.currentStamina -= this.strongAttackCost;
                                if (this.lastComboType != this.attackInput) { // Last Combo was different (e.g. AA vs Q) - drop combo
                                    this.lastComboStage = 0;		    				
                                }
                                this.targetHit = [];
                                this.attacking = true;
                                // Q will take attack indexes 1, 2, and 3
                                if (this.lastComboStage < 3)
                                    this.attackIndex = this.lastComboStage + 1;
                                else
                                    this.attackIndex = 1;
                                if (this.attackIndex == 1) {
                                    playSound(q1Sound);
                                } else if (this.attackIndex == 2) {
                                    playSound(q2Sound);
                                } else if (this.attackIndex == 3) {
                                    playSound(q3Sound);
                                }
                                this.lastComboType = this.attackInput;
                                this.lastComboStage = this.attackIndex;
                                this.comboTime = COMBO_DROPOFF_TIME;
                            }
                        } else if ((!this.attacking || (this.canCancel() && this.attackIndex != 7)) && this.downDown) { //E
                            if (this.currentStamina >= this.eCost) {
                                this.currentStamina -= this.eCost;
                                this.attacking = true;
                                this.invulnTimer = 40;
                                this.vulnerable = false;
                                this.attackIndex = 7;
                                var particle;
                        		playSound(eSound);
                                if (this.lastDirection === "Left") {
                                    this.hurtAnimation = this.hurtAnimationLeft;
                                    particle = new Particle(IMG_PART, 0, 0, 0, 0,
                                            0, 0, 0, 0, 0, 5, 5, 30, 0.5, 0, false, this.game,
                                        new Animation(ASSET_MANAGER.getAsset("./img/Particle/bubbleleft.png"), 0, 0, 47, 94, 1, 1, true, false, -30, 0));
                                } else {
                                    this.hurtAnimation = this.hurtAnimationRight;
                                    particle = new Particle(IMG_PART, 0, 0, 0, 0,
                                            0, 0, 0, 0, 0, 5, 5, 30, 0.5, 0, false, this.game,
                                        new Animation(ASSET_MANAGER.getAsset("./img/Particle/bubbleright.png"), 0, 0, 47, 94, 1, 1, true, false, 60, 0));
                                }
                                particle.snapEntity = this;
                                this.game.addEntity(particle);
                            }
                        } else if ((!this.attacking || (this.canCancel() && this.attackIndex != 8)) 
                                && !(this.rightDown || this.leftDown)) { //W
                            if (this.currentStamina >= this.wCost) {
                                this.currentStamina -= this.wCost;
                                this.targetHit = [];
                                this.attacking = true;
                                this.attackIndex = 8;
                                playSound(wSound);
                                for (i = 0; i < 10; i++) {
                                    var particle = new Particle(SHAPE_PART,
                                            this.game.player1.hitBox.x + this.game.player1.hitBox.width / 2 - 10 + Math.random() * 20,
                                            this.game.player1.hitBox.y + this.game.player1.hitBox.height / 2 - 10 + Math.random() * 20, 
                                            3, -3, 3, -3, 0, 0.1, 0, 5, 10, 50, 1, 0, false, this.game);
                                    var element = new SquareElement(4 + Math.random() * 4, 4 + Math.random() * 4, "#00f6cb", "#70fe37");
                                    particle.other = element;
                                    this.game.addEntity(particle);
                                }
                            }
                        }
                    }
                break;
            }
        }
        
        if (this.attackIndex > 0 && this.canControl) {
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
                case 7:
                    if (this.lastDirection === "Right") {
                        this.attackAnimation = this.attackAnimationDownRight;
                    } else {
                        this.attackAnimation = this.attackAnimationDownLeft;
                    }
                break;
                case 8:
                    if (this.lastDirection === "Right") {
                        this.attackAnimation = this.attackAnimationStillRight;
                    } else {
                        this.attackAnimation = this.attackAnimationStillLeft;
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
            if (this.canControl) {
                this.idleAnimation = this.idleAnimationLeft;
            }
            this.runAnimation = this.runAnimationLeft;
        }
        
        var collision = false;
        if (this.attackIndex == 7 || //e
                ((this.attackIndex >= 1 && this.attackIndex <= 3) && this.attackAnimation.elapsedTime <= 0.5)) { // Q first part - has movement on first half
            if (this.lastDirection === "Right") {
                this.game.entities.forEach(function(entity) {
                    if (entity.solid) {
                        if (checkCollision(that, entity)) {
                            collision = true;
                        }
                    }
                });
                if (this.attacking) {
                    if (collision && this.game.currentPhase != 0 || !collision || this.hitBox.x >= this.game.currentBoss.hitBox.x + (this.game.currentBoss.hitBox.width / 2)) {
                        this.x += this.runSpeed;
                    } 
                }
            } else {
                this.game.entities.forEach(function(entity) {
                    if (entity.solid) {
                        if (checkCollision(that, entity)) {
                            collision = true;
                        }
                    }
                });
                if (this.attacking) {
                    if (!collision && this.game.currentPhase != 0 || !collision || this.hitBox.x < this.game.currentBoss.hitBox.x + (this.game.currentBoss.hitBox.width / 2)) {
                        this.x -= this.runSpeed;
                    }
                }            
            }
        }
        if (this.attacking) {            
            this.game.entities.forEach(function(entity) {
                if (entity.attackable && that.targetHit.indexOf(entity) === -1) {
                    if (checkCollision(that, entity)) {
                        that.targetHit.push(entity);
    	                var damageParticle = new Particle(TEXT_PART, entity.hitBox.x + entity.hitBox.width / 2, 
    	                		entity.hitBox.y, 0.2, -0.2, -3, -3, 0, 0.1, 0, 5, 10, 50, 1, 0, false, that.game);
    	                var damageText = new TextElement("", "Lucida Console", 25, "white", "black");
    	                var damage = 0;
    	                if (that.attackIndex >= 1 && that.attackIndex <= 3) {
    	                   damage = that.attackIndex * that.qScaling + that.qDamage;
    	                } else if (that.attackIndex >= 4 && that.attackIndex <= 6) {
    	                    damage = (that.attackIndex - 3) * that.autoScaling + that.autoDamage;
    	                } else if (that.attackIndex == 8) {
    	                    damage = that.wDamage;
    	                }
    	                entity.currentHealth -= damage;
    	                damageText.text = damage;
    	                damageParticle.other = damageText;
    	                if (damage > 0)
    	                	that.game.addEntity(damageParticle);
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
            if (this.attackIndex == 8 && this.attackAnimation.elapsedTime <= 0.5) { //E
                this.hitBoxDef.offsetX -= 0.4;
                this.hitBoxDef.growthX += 0.8;
            }
            if (this.attackAnimation != null && this.attackAnimation.isDone()) {
                this.attackAnimation.elapsedTime = 0;
                this.attacking = false;
                this.attackIndex = 0;
                this.hitBoxDef.growthX = 0; //reset
                this.hitBoxDef.offsetX = this.hitBoxDef.originalOffsetX;
            }
        }
    }
	
    var platformFound = false;
    this.game.currentMap.platforms.forEach(function(currentPlatform) {
    	currentPlatform.update();
        if ((that.hitBox.x + that.hitBox.width) > currentPlatform.hitBox.x) {
            if (that.hitBox.x < (currentPlatform.hitBox.x + currentPlatform.hitBox.width)) {
                if ((that.hitBox.y + that.hitBox.height) + currentPlatform.vSpeed <= currentPlatform.hitBox.y) {
                    if ((that.hitBox.y + that.hitBox.height - (that.yVelocity - that.gravity )) >= currentPlatform.hitBox.y) {
                        platformFound = true;
                        if (currentPlatform.specialId === 1) { //bouncy platform
                        	that.yVelocity = 15;
                        	that.jumpSpeed = 0;
                            that.jumping = true;
                            playSound(jumpSound);
                        } else {
	                    	that.x += currentPlatform.hSpeed;
	                    	that.y += currentPlatform.vSpeed;
	                    	that.yVelocity = 0;
	                        if (that.falling) {
	                            that.falling = false;
	                            that.yVelocity = 0;
	                            that.y = currentPlatform.hitBox.y - that.hitBox.height - that.hitBoxDef.offsetY;
	                        }
                        }
                    }
                }
            }
        }
    });
    
    if (this.running) {
        footsteps.volume = 0.8;
        if (this.lastDirection === "Right") {
            this.x += this.runSpeed;
        } else if (this.lastDirection === "Left") {
            this.x -= this.runSpeed;
        }
    } else if ((this.jumping || this.falling) && !this.attacking) {
        this.x += this.jumpSpeed;
    }
    
    if (!this.running) {
        if (footsteps.volume > 0.05) {
            footsteps.volume -= 0.05;
        }
        if (footsteps.volume <= 0.05) {
            footsteps.volume = 0;
            footsteps.currentTime = 0;
        }
    }
    
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
    
    if (this.hitBox.x + this.hitBoxDef.width >= this.game.camera.maxX + this.game.surfaceWidth && (this.lastDirection === "Right" || this.hurt)) {
        this.x = this.game.camera.maxX + this.game.surfaceWidth - this.hitBoxDef.width - this.hitBoxDef.offsetX;
    }
    if (this.hitBox.x + this.hitBox.width - this.hitBoxDef.width <= this.game.camera.minX && (this.lastDirection === "Left" || this.hurt)) {
        this.x = this.game.camera.minX + 0 - this.hitBoxDef.offsetX;
    }
    if (this.x >= 820) {
        if (this.game.currentPhase === 1) {
        	this.game.currentPhase = 2;
	        this.game.cameraLock = false;
	        this.game.camera.minX = 800;
	        this.game.camera.maxX = 800;
    		var chat = new TextBox(this.game, "./img/Chat/MalzSquare.png", "I have been expecting you.");
    		this.game.addEntity(chat);
            this.game.player1.canControl = false;
        }
    }
    Entity.prototype.update.call(this);
};

Character.prototype.draw = function (ctx) {
	if (!this.dead) {
		if ((this.jumping || this.falling) && !this.attacking && !this.hurt) { // Jumping
			this.jumpAnimation.drawFrame(this.game.clockTick, ctx, this.x + this.jumpAnimation.offsetX, this.y + this.jumpAnimation.offsetY, 1, true);
	        this.currentAnimation = this.jumpAnimation;        
	    } else if (this.attacking && this.attackAnimation != null) { // Attacking
	        this.attackAnimation.drawFrame(this.game.clockTick, ctx, this.x + this.attackAnimation.offsetX, this.y + this.attackAnimation.offsetY);
	        this.currentAnimation = this.attackAnimation;
	    } else if (this.running) { // Running
			this.runAnimation.drawFrame(this.game.clockTick, ctx, this.x + this.runAnimation.offsetX, this.y + this.runAnimation.offsetY);	
	        this.currentAnimation = this.runAnimation;
	    } else if (this.hurt) {
			this.hurtAnimation.drawFrame(this.game.clockTick, ctx, this.x + this.hurtAnimation.offsetX, this.y + this.hurtAnimation.offsetY, 1, true);
	        this.currentAnimation = this.hurtAnimation;  
	    } else if (!this.dead) { // Idle
			this.idleAnimation.drawFrame(this.game.clockTick, ctx, this.x + this.idleAnimation.offsetX, this.y + this.idleAnimation.offsetY);
	        this.currentAnimation = this.idleAnimation;
	    }
	    drawHitBox(this, ctx);
	}
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

ASSET_MANAGER.queueDownload("./img/Particle/bubbleleft.png");
ASSET_MANAGER.queueDownload("./img/Particle/bubbleright.png");
ASSET_MANAGER.queueDownload("./img/Particle/smoke.png");

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
ASSET_MANAGER.queueDownload("./img/Riven/WRight.png");
ASSET_MANAGER.queueDownload("./img/Riven/WLeft.png");
ASSET_MANAGER.queueDownload("./img/Riven/ELeft.png");
ASSET_MANAGER.queueDownload("./img/Riven/ERight.png");
ASSET_MANAGER.queueDownload("./img/Riven/HurtLeft.png");
ASSET_MANAGER.queueDownload("./img/Riven/HurtRight.png");

ASSET_MANAGER.queueDownload("./img/Reksai/ReksaiIdleRight.png");
ASSET_MANAGER.queueDownload("./img/Reksai/ReksaiIdleLeft.png");
ASSET_MANAGER.queueDownload("./img/Reksai/ReksaiWalkLeft.png");
ASSET_MANAGER.queueDownload("./img/Reksai/ReksaiWalkRight.png");
ASSET_MANAGER.queueDownload("./img/Reksai/ReksaiPortrait.png");
ASSET_MANAGER.queueDownload("./img/Reksai/AttackLeft.png");
ASSET_MANAGER.queueDownload("./img/Reksai/AttackRight.png");
ASSET_MANAGER.queueDownload("./img/Reksai/ScreamLeft.png");
ASSET_MANAGER.queueDownload("./img/Reksai/ScreamRight.png");

ASSET_MANAGER.queueDownload("./img/Malzahar/IdleRight.png");
ASSET_MANAGER.queueDownload("./img/Malzahar/IdleLeft.png");
ASSET_MANAGER.queueDownload("./img/Malzahar/ERight.png");
ASSET_MANAGER.queueDownload("./img/Malzahar/ELeft.png");
ASSET_MANAGER.queueDownload("./img/Malzahar/VoidlingRight.png");
ASSET_MANAGER.queueDownload("./img/Malzahar/VoidlingLeft.png");
ASSET_MANAGER.queueDownload("./img/Malzahar/VoidlingLeftExplode.png");
ASSET_MANAGER.queueDownload("./img/Malzahar/VoidlingRightExplode.png");
ASSET_MANAGER.queueDownload("./img/Malzahar/MalzaharPortrait.png");

ASSET_MANAGER.queueDownload("./img/Background.png");
ASSET_MANAGER.queueDownload("./img/Background2.png");
ASSET_MANAGER.queueDownload("./img/Background3.png");
ASSET_MANAGER.queueDownload("./img/ArrowGoUp.png");
ASSET_MANAGER.queueDownload("./img/ArrowGoRight.png");
ASSET_MANAGER.queueDownload("./img/UI/Bottom.png");
ASSET_MANAGER.queueDownload("./img/UI/BarBack.png");
ASSET_MANAGER.queueDownload("./img/UI/HealthBar.png");
ASSET_MANAGER.queueDownload("./img/UI/HealthBarLight.png");
ASSET_MANAGER.queueDownload("./img/UI/StaminaBar.png");
ASSET_MANAGER.queueDownload("./img/UI/StaminaBarLight.png");
ASSET_MANAGER.queueDownload("./img/UI/Platform.png");
ASSET_MANAGER.queueDownload("./img/UI/PlatformBouncy.png");
ASSET_MANAGER.queueDownload("./img/Reksai/ScreamLeft.png");
ASSET_MANAGER.queueDownload("./img/Chat/ChatSquare.png");
ASSET_MANAGER.queueDownload("./img/Chat/MalzSquare.png");
ASSET_MANAGER.queueDownload("./img/Chat/RivenSquare.png");

ASSET_MANAGER.downloadAll(function () {
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');

    var gameEngine = new GameEngine();
    var bg = new Background(gameEngine);
	var reksai = new Reksai(gameEngine);
	var malzahar = new Malzahar(gameEngine);
    var character = new Character(gameEngine);
    var ui = new UI(gameEngine);
    var map = new Map(gameEngine);
    var voidling = new Voidling(gameEngine, 313, 330, "touch");
    
    gameEngine.addEntity(bg);
    gameEngine.addEntity(map);
    gameEngine.addEntity(character);
    gameEngine.addEntity(reksai);
    gameEngine.addEntity(malzahar);
    gameEngine.addEntity(ui);
    gameEngine.addEntity(voidling);
 
    gameEngine.init(ctx);
    gameEngine.setPlayer1(character);
    gameEngine.setBoss(reksai);
    gameEngine.setMap(map);
    gameEngine.setUI(ui);
    gameEngine.start();
});