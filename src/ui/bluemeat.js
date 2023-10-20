import Phaser from "phaser";
export default class BlueMeat extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
  }

  spawn(positionX, positionY) {
    this.setPosition(positionX, positionY);
    this.setActive(true);
    this.setVisible(true);
  }

  die() {
    this.destroy();
  }

  update(time) {
    this.setVelocityY(100);

    if (this.y < -10) {
      this.die();
    }
  }
}
