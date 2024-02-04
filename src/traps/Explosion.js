import { AnimatedSprite, Assets } from 'pixi.js';

export default class Explosion {
  constructor(manager, layer, id) {
    this.id = id;
    this.manager = manager;
    this.layer = layer;
  }

  async spawn({ x, y, triggerOffset, triggerInterval }) {
    this.xPos = x;
    this.yPos = y;
    const explosionSS = Assets.get('explosion');
    this.sprite = new AnimatedSprite(explosionSS.animations.explode);
    this.sprite.anchor.set(0.5, 0.5);
    this.layer.addChild(this.sprite);
    this.sprite.loop = false;
    this.triggerOffset = triggerOffset;
    this.triggerInterval = triggerInterval;

    this.updateSprite();
  }

  logicStep({ tickCount }) {
    if ((tickCount - this.triggerOffset) % this.triggerInterval === 0) {
      this.sprite.gotoAndPlay(0);

      for (const bounder of this.manager.gameWorld.bounderManager
        .activeBounders) {
        const distSq =
          Math.pow(this.yPos - bounder.yPos, 2) +
          Math.pow(this.xPos - bounder.xPos, 2);
        if (distSq < 64 * 64) {
          bounder.die();
        }
      }

      /* */
    }
  }

  updateSprite() {
    this.sprite.position.set(this.xPos, this.yPos);
  }
}
