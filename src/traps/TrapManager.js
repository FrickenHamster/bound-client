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
    let explosion;
    if (data.id === undefined) {
      explosion = this.explosionPool.pop();
    } else {
      explosion = this.explosionMap[data.id];
      this.explosionPool.splice(this.explosionPool.indexOf(explosion));
    }
    if (!explosion) {
      console.log('out of explosions');
      return;
    }

    explosion.spawn(data);
    this.activeExplosions.push(explosion);
  }

  loadData(trapsData) {
    for (const trapData of trapsData) {
    }
  }

  logicStep(data) {
    for (const explosion of this.activeExplosions) {
      explosion.logicStep(data);
    }
  }
}
