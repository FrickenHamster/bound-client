import { AnimatedSprite, Assets } from 'pixi.js';

export default class Explosion {
  constructor(manager, layer, id) {
    this.id = id;
    this.manager = manager;
    this.layer = layer;
  }

  async spawn({ x, y, explodeTimerOffset, explodeTimerMax }) {
    this.xPos = x;
    this.yPos = y;
    const explosionSS = Assets.get('explosion');
    this.sprite = new AnimatedSprite(explosionSS.animations.explode);
    this.layer.addChild(this.sprite);
    this.sprite.loop = false;
    this.explodeTimer = explodeTimerOffset;
    this.explodeTimerMax = explodeTimerMax;
  }

  logicStep() {
    if (this.explodeTimer <= 0) {
      this.sprite.gotoAndPlay(0);
      this.explodeTimer = this.explodeTimerMax;
      const distSq =
        Math.pow(this.yPos - this.manager.gameWorld.bounder.yPos, 2) +
        Math.pow(this.xPos - this.manager.gameWorld.bounder.xPos, 2);
      if (distSq < 64 * 64) {
        this.manager.gameWorld.bounder.die();
      }
    } else {
      this.explodeTimer--;
    }
  }

  updateSprite() {
    this.sprite.position.set(this.xPos, this.yPos);
  }
}
