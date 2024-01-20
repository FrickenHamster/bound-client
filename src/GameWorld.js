import Bounder from './runner/Bounder.js';
import { AnimatedSprite, Assets, Container, Sprite } from 'pixi.js';
import GameMap from './map/GameMap.js';
import TrapManager from './traps/TrapManager.js';
import ZoneManager from './zones/ZoneManager.js';

const SCROLL_SPEED = 8;
export default class GameWorld {
  constructor(gameManager, layer) {
    this.gameManager = gameManager;
    this.container = new Container();
    layer.addChild(this.container);
    this.mapLayer = new Container();
    this.container.addChild(this.mapLayer);
    this.bounderLayer = new Container();
    this.container.addChild(this.bounderLayer);
    this.trapLayer = new Container();
    this.container.addChild(this.trapLayer);

    this.gameMap = new GameMap(this, this.mapLayer);

    this.trapManager = new TrapManager(this, this.trapLayer);

    this.zoneManager = new ZoneManager();

    this.viewX = 0;
    this.viewY = 0;
  }

  initGame(levelData) {
    this.gameMap.init(levelData.map);

    for (const trapData of levelData.traps.traps) {
      this.trapManager.spawnExplosion(trapData);
    }

    this.zoneManager.init(levelData.zones);

    this.bounder = new Bounder(this, this.bounderLayer);

    const startPos = this.zoneManager.randomStartPosition();

    this.bounder.spawn(startPos.x, startPos.y);

    this.tickCount = 0;
  }

  logicStep() {
    this.bounder.logicStep();
    this.trapManager.logicStep({ tickCount: this.tickCount });

    if (this.gameManager.gameKeys.controls.gameViewUp.isDown) {
      this.viewY -= SCROLL_SPEED;
    }
    if (this.gameManager.gameKeys.controls.gameViewDown.isDown) {
      this.viewY += SCROLL_SPEED;
    }
    if (this.gameManager.gameKeys.controls.gameViewLeft.isDown) {
      this.viewX -= SCROLL_SPEED;
    }
    if (this.gameManager.gameKeys.controls.gameViewRight.isDown) {
      this.viewX += SCROLL_SPEED;
    }

    this.container.position.set(-this.viewX, -this.viewY);

    this.tickCount++;
  }
}
