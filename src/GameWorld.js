import Bounder from './runner/Bounder.js';
import { AnimatedSprite, Assets, Container, Sprite } from 'pixi.js';
import GameMap from './map/GameMap.js';
import TrapManager from './traps/TrapManager.js';

export default class GameWorld {
  constructor(gameManager, layer) {
    this.mapLayer = new Container();
    layer.addChild(this.mapLayer);
    this.bounderLayer = new Container();
    layer.addChild(this.bounderLayer);
    this.trapLayer = new Container();
    layer.addChild(this.trapLayer);

    this.gameMap = new GameMap(this, this.mapLayer);

    this.trapManager = new TrapManager(this, this.trapLayer);
  }

  initGame() {
    this.bounder = new Bounder(this, this.bounderLayer);

    this.bounder.spawn(200, 200);
    this.trapManager.spawnExplosion({
      x: 100,
      y: 100,
      explodeTimerMax: 40,
      explodeTimerOffset: 20,
    });
  }

  logicStep() {
    this.bounder.logicStep();
    this.trapManager.logicStep();
  }
}
