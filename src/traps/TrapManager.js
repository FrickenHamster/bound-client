import Explosion from './Explosion.js';
import { Container } from 'pixi.js';
import { MAX_EXPLOSIONS } from '#config/gameConstants';

export default class TrapManager {
  constructor(gameWorld, layer) {
    this.gameWorld = gameWorld;
    this.layer = layer;

    this.explosionLayer = new Container();
    this.layer.addChild(this.explosionLayer);

    this.explosionPool = [];
    this.explosionMap = [];
    this.activeExplosions = [];

    for (let i = 0; i < MAX_EXPLOSIONS; i++) {
      const explosion = new Explosion(this, this.explosionLayer, i);
      this.explosionPool.push(explosion);
      this.explosionMap[i] = explosion;
    }
  }

  spawnExplosion(data) {
    const explosion = this.explosionPool.pop();
    if (!explosion) {
      console.log('out of explosions');
      return;
    }

    explosion.spawn(data);
    this.activeExplosions.push(explosion);
  }

  logicStep() {
    for (const explosion of this.activeExplosions) {
      explosion.logicStep();
    }
  }
}
