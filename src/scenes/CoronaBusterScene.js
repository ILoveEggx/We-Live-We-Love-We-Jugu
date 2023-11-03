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
    this.bluemeat = undefined;
    this.hungerLabel = undefined;
    this.hunger = 100;
  }
  preload() {
    this.load.image("background", "images/bg_layer2.png");
    this.load.image("right-btn", "images/right-btn.png");
    this.load.image("left-btn", "images/left-btn.png");
    this.load.image("shoot-btn", "images/shoot-btn.png");

    this.load.spritesheet("player", "images/anitamorbulet.png", {
      frameWidth: 120,
      frameHeight: 120,
    });
    this.load.image("anoanowilkum", "images/anoanowilkum.png");
    this.load.image("smurfcat", "images/smurfcat.png");
    this.load.image("bluemeat", "images/blue-meat.png");
    this.load.spritesheet("laser", "images/laser-bolts.png", {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.audio("shoot", "sfx/JUGUJUGU.mp3");
  }
  create() {
    const gameWidth = this.scale.width * 0.5;
    const gameHeight = this.scale.height * 0.5;
    this.add.image(gameWidth, gameHeight, "background");
    this.createButton();
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
    this.bluemeat = this.physics.add.group({
      classType: FallingObject,
      maxSize: 10,
      runChildUpdate: true,
    });

    this.time.addEvent({
      delay: Phaser.Math.Between(7000, 10000),
      callback: this.spawnAnoanowilkum,
      callbackScope: this,
      loop: true,
    });
    this.time.addEvent({
      delay: Phaser.Math.Between(1000, 3000),
      callback: this.spawnSmurfcat,
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
      this.hitAnoanowilkum,
      undefined,
      this
    );
    this.physics.add.overlap(
      this.lasers,
      this.smurfcat,
      this.hitSmurfcat,
      undefined,
      this
    );
    this.hungerLabel = this.add
      .text(10, 30, "Hunger ", {
        fontSize: "18px",
        fill: "black",
        backgroundColor: "white",
      })
      .setDepth(1);
    this.countdown = this.time.addEvent({
      delay: 500,
      callback: this.gameOver,
      callbackScope: this,
      loop: true,
    });
    this.physics.add.overlap(
      this.player,
      this.smurfcat,
      this.overlapSmurfcat,
      null,
      this
    );
    this.physics.add.overlap(
      this.player,
      this.anoanowilkum,
      this.overlapAnoanowilkum,
      null,
      this
    );
    this.physics.add.overlap(
      this.player,
      this.bluemeat,
      this.overlapBluemeat,
      null,
      this
    );
  }

  // @ts-ignore
  update(time) {
    this.movePlayer(this.player, time);
    this.hungerLabel.setText("Hunger : " + this.hunger);
  }
  // @ts-ignore
  createButton() {
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
      frames: [
        {
          key: "player",
          frame: 1,
        },
      ],
    });
    return player;
  }
  movePlayer(player, time) {
    if (this.nav_left) {
      this.player.setVelocityX(this.speed * -1);
      this.player.anims.play("left", true);
      this.player.setFlipX(false);
    } else if (this.nav_right) {
      this.player.setFlipX(true);
      this.player.setVelocityX(this.speed);
      this.player.anims.play("right", true);
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play("right");
    }
    if (this.shoot && time > this.lastFired) {
      const laser = this.lasers.get(0, 0, "laser");
      if (laser) {
        laser.fire(this.player.x, this.player.y);
        this.lastFired = time + 600;
        this.sound.play("shoot");
      }
    }
  } // @ts-ignore
  spawnSmurfcat() {
    const config = {
      speed: 50,
      rotation: 0.0,
    };
    const smurfcat = this.smurfcat.get(0, 0, "smurfcat", config);
    smurfcat.spawn(Phaser.Math.Between(50, 350));
  }
  spawnAnoanowilkum() {
    const config = {
      speed: 200,
      rotation: 0.0,
    };
    const anoanowilkum = this.anoanowilkum.get(0, 0, "anoanowilkum", config);
    anoanowilkum.spawn(Phaser.Math.Between(50, 350));
  }
  hitAnoanowilkum(laser, anoanowilkum) {
    laser.die();
    anoanowilkum.die();
  }
  hitSmurfcat(laser, smurfcat) {
    const config = {
      speed: 30,
      rotation: 0.06,
    };
    laser.die();
    const bluemeat = this.bluemeat.get(0, 0, "bluemeat", config);
    if (bluemeat) {
      bluemeat.spawn(smurfcat.x, smurfcat.y);
    }
    smurfcat.die();
  }

  spawnBluemeat() {}
  overlapAnoanowilkum(player, anoanowilkum) {
    this.hunger -= 60;
    anoanowilkum.die();
  }
  overlapSmurfcat(player, smurfcat) {
    this.hunger -= 10;
    smurfcat.die();
  }
  overlapBluemeat(player, bluemeat) {
    this.hunger += 10;
    bluemeat.die();
  }

  gameOver() {
    this.hunger--;
    if (this.hunger < 0) {
      this.scene.start("over-scene", { hunger: this.hunger });
    }
  }
}
