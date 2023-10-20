import Phaser from "phaser";
import FallingObject from "../ui/FallingObject";
import Laser from "../ui/Laser";
import BlueMeat from "../ui/bluemeat";
export default class CoronaBusterScene extends Phaser.Scene {
  constructor() {
    super("corona-buster-scene");
  }
  init() {
    this.nav_left = false;
    this.nav_right = false;
    this.shoot = false;
    this.player = undefined;
    this.speed = 100;
    this.smurfcat = undefined;
    this.anoanowilkum = undefined;
    this.enemySpeed = 1000;
    this.lasers = undefined;
    this.lastFired = 10;
    this.hungerLabel = undefined;
    this.hunger = 100;
    this.bluemeat = undefined;
    this.backsound = undefined;
    this.timer = 100
    this.timerLabel = undefined; 
    this.countdown = undefined
  }
  preload() {
    this.load.image("background", "images/background1.png");
    this.load.image("anoanowilkum", "images/anoanowilkum.png");
    this.load.image("right-btn", "images/right-btn.png");
    this.load.image("left-btn", "images/left-btn.png");
    this.load.image("shoot-btn", "images/shoot-btn.png");
    this.load.image("smurfcat", "images/smurfcat.png");
    this.load.spritesheet("player", "images/anitamorbulet.png", {
      frameWidth: 202,
      frameHeight: 202,
    });
    this.load.spritesheet("bluemeat", "images/blue-meat.png",{
      frameWidth:16,
      frameHeight:16,
    });
    
    this.load.spritesheet("laser", "images/laser-bolts.png", {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.audio("bgsound", "sfx/Smurf cat.mp3");
    this.load.audio("bgsound2", "sfx/anoanowilkam.mp3");
    this.load.audio("eat", "sfx/eat.mp3");
    this.load.audio("shoot", "sfx/JUGUJUGU.mp3");
  }
  create() {
    this.countdown = this.time.addEvent
    const gameWidth = this.scale.width * 0.5;
    const gameHeight = this.scale.height * 0.5;
    this.add.image(gameWidth, gameHeight, "background");
    // @ts-ignore
    this.createButton();
    // @ts-ignore
    this.player = this.createPlayer();
    this.smurfcat = this.physics.add.group({
      classType: FallingObject,
      maxSize: 10,
      runChildUpdate: true,
    });
    this.anoanowilkum = this.physics.add.group({
      classType: FallingObject,
      maxSize: 1,
      runChildUpdate: true,
    });

    this.time.addEvent({
      delay: Phaser.Math.Between(1000, 5000),
      callback: this.smurfcat,
      callbackScope: this,
      loop: true,
    });
    this.time.addEvent({
      delay: Phaser.Math.Between(3000, 10000),
      callback: this.anoanowilkum,
      callbackScope: this,
      loop: true,
    });
    this.lasers = this.physics.add.group({
      classType: Laser,
      maxSize: 10,
      runChildUpdate: true,
    });
    this.physics.add.overlap(
      this.lasers,
      this.anoanowilkum,
      this.hitAnoanowilkum
      undefined,
      this
    );
    this.physics.add.overlap(
      this.lasers,
      this.smurfcat,
      this.hitSmurfcat
      undefined,
      this
    );
    // @ts-ignore
    this.hungerLabel = this.add
      .text(10, 30, "Hunger ", {
        fontSize: "18px",
        fill: "black",
        backgroundColor: "white",
      })
      .setDepth(1);
    this.physics.add.overlap(
      this.player,
      this.anoanowilkum,
      this.decreaseHunger,
      null,
      this
    );
    this.physics.add.overlap(
      this.player,
      this.smurfcat,
      this.decreaseHunger2,
      null,
      this
    );
    this.bluemeat = this.physics.add.group({
      classType:BlueMeat,
      runChildUpdate: true,
    });
    this.time.addEvent({
      delay: 10000,
      callback: this.spawnHandsanitizer,
      callbackScope: this,
      loop: true,
    });
    this.physics.add.overlap(
      this.player,
      this.handsanitizer,
      this.increaseLife,
      null,
      this
    );
    this.backsound = this.sound.add("bgsound");
    var soundConfig = {
      loop: true,
      volume: 0.5,
    };
    this.backsound.play(soundConfig);
    this.timerLabel = this.add.text(380,10,'Time :', {
      fill:'white', backgroundColor: 'black'
    }).setDepth(1)
    this.countdown = this.time.addEventEvent({
      delay:500,
      callback:this.gameOver,
      callbackScope: this,
      loop: true
    })
  }

  // @ts-ignore
  update(time) {
    // @ts-ignore
    this.clouds.children.iterate((child) => {
      // @ts-ignore
      child.setVelocityY(20);
      // @ts-ignore
      if (child.y > this.scale.height) {
        // @ts-ignore
        child.x = Phaser.Math.Between(10, 4);
        child.y = 0;
      }
    });
    this.movePlayer(this.player, time);
    this.hungerLabel.setText('Hunger : ' + this.hunger)
    this.timerLabel.setText('Timer :'+this.timer) 
  }
  // @ts-ignore
  createButton() {
    // @ts-ignore
    this.input.addPointer(3);

    // @ts-ignore
    let shoot = this.add
      .image(320, 550, "shoot-btn")
      .setInteractive()
      .setDepth(0.5)
      .setAlpha(0.8);

    // @ts-ignore
    let nav_left = this.add
      .image(50, 550, "left-btn")
      .setInteractive()
      .setDepth(0.5)
      .setAlpha(0.8);

    // @ts-ignore
    let nav_right = this.add
      .image(nav_left.x + nav_left.displayWidth + 40, 550, "right-btn")
      .setInteractive()
      .setDepth(0.5)
      .setAlpha(0.8);
    nav_left.on(
      "pointerdown",
      () => {
        // @ts-ignore
        this.nav_left = true;
      },
      this
    );
    nav_left.on(
      "pointerout",
      () => {
        // @ts-ignore
        this.nav_left = false;
      },
      this
    );
    nav_right.on(
      "pointerdown",
      () => {
        // @ts-ignore
        this.nav_right = true;
      },
      this
    );
    nav_right.on(
      "pointerout",
      () => {
        // @ts-ignore
        this.nav_right = false;
      },
      this
    );
    shoot.on(
      "pointerdown",
      () => {
        // @ts-ignore
        this.shoot = true;
      },
      this
    );
    shoot.on(
      "pointerout",
      () => {
        // @ts-ignore
        this.shoot = false;
      },
      this
    );
  }

  createPlayer() {
    const player = this.physics.add.sprite(200, 450, "player");
    player.setCollideWorldBounds(true);
    this.anims.create({
      key: "left",
      frames: [
        {
          key: "player",
          frame: 0,
        },
      ],
    });
    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("player", {
        start: 0,
        end: 1,
      }),
    });
    return player;
  }
  movePlayer(player, time) {
    if (this.nav_left) {
      this.player.setVelocityX(this.speed * -1);
      this.player.anims.play("left", true);
      this.player.setFlipX(false);
    } else if (this.nav_right) {
      this.player.setVelocityX(this.speed);
      this.player.anims.play("right", true);
      this.player.setFlipX(true);
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play("left");
    }
    if (this.shoot && time > this.lastFired) {
      const laser = this.lasers.get(0, 0, "laser");
      if (laser) {
        laser.fire(this.player.x, this.player.y);
        this.lastFired = time + 600;
        this.sound.play("laser");
      }
    }
  } // @ts-ignore
  spawnEnemy() {
    const config = {
      speed: 30,
      rotation: 0.06,
    };
    const anoanowilkum = this.anoanowilkum.get(0, 0, "anoanowilkum", config);
    const smurfcat = this.smurfcat.get(0, 0, "smurfcat", config);
    const positionX = Phaser.Math.Between(50, 350);
    if (anoanowilkum || smurfcat) {
      anoanowilkum.spawn(positionX);
      smurfcat.spawn(positionX);
    }
  }
  hitAnoanowilkum(laser, anoanowilkum) {
    laser.die();
    anoanowilkum.die();
    this.sound.play("destroy");
  }
  hitSmurfcat(laser, smurfcat) {
    laser.die();
    const bluemeat = this.bluemeat.get(0,0,'bluemeat')
    if (bluemeat){
      bluemeat.spawn(smurfcat.x,smurfcat.y)
    }
    smurfcat.die();
    this.sound.play("destroy");
  }
  spawnBluemeat(){
    
  }
  decreaseHunger(player, anoanowilkum) {
    anoanowilkum.die();
    this.hunger-=60
     if (this.hunger <= 0) {
      this.sound.stopAll();
      this.scene.start("over-scene");
    }
  }
  decreaseHunger2(player, smurfcat) {
    smurfcat.die();
    this.hunger-=10
     if (this.hunger <= 0) {
      this.sound.stopAll();
      this.scene.start("over-scene");
    }
  }
  spawnHandsanitizer() {
    const config = {
      speed: 60,
      rotation: 0,
    };
    const handsanitizer = this.handsanitizer.get(0, 0, "handsanitizer", config);
    const positionX = Phaser.Math.Between(70, 330);
    if (handsanitizer) {
      handsanitizer.spawn(positionX);
    }
  }
  increaseLife(player, handsanitizer) {
    handsanitizer.die();
    this.life++;
    if (this.life >= 3) {
      player.clearTint().setAlpha(2);
      this.sound.play("life");
    }
  }
  gameOver() {
    this.timer--
    if(this.timer<0){
      this.scene.start('over-scene')
    }
  }
}
