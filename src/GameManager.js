import { Application, Container, Graphics } from 'pixi.js';
import { preloadGame } from './preloader.js';
import GameWorld from './GameWorld.js';
import { LOCAL_TICK_TIME } from '#config/gameConstants';
import GameKeys from './GameKeys.js';

import levelData from '../config/level.json';
import boboData from '../config/bobo.json';

export default class GameManager {
  constructor() {
    this.app = new Application({
      width: 800,
      height: 600,
      transparent: false,
    });

    this.app.renderer.backgroundColor = 0x887755;

    const gameContainer = document.getElementById('gameContainer');
    gameContainer.appendChild(this.app.view);
    this.gameLayer = new Container();
    this.app.stage.addChild(this.gameLayer);
    this.app.stage.eventMode = 'static';
    this.app.stage.hitArea = this.app.screen;

    this.app.stage.addEventListener('pointerup', e => {
      this.gameWorld.bounder.orderMoveTarget(
        e.global.x + this.gameWorld.viewX,
        e.global.y + this.gameWorld.viewY,
      );
    });

    this.app.stage.addEventListener('globalpointermove', e => {
      /*const xx = Math.floor(e.global.x / 16);
      const yy = Math.floor(e.global.y / 16);
      const free = this.gameWorld.gameMap.grid.isWalkableAt(xx, yy);
      gg.clear();
      if (free) {
        gg.beginFill(0x0000ff);
      } else {
        gg.beginFill(0xff0000);
      }
      gg.drawRect(xx * 16, yy * 16, 16, 16);
      gg.endFill();*/
    });

    this.gameWorld = new GameWorld(this, this.app.stage);

    this.gameKeys = new GameKeys();

    this.gameKeys.addKey('gameViewUp', ['KeyW']);
    this.gameKeys.addKey('gameViewDown', ['KeyS']);
    this.gameKeys.addKey('gameViewLeft', ['KeyA']);
    this.gameKeys.addKey('gameViewRight', ['KeyD']);

    this.initGame(levelData);
  }

  async initGame(levelData) {
    await preloadGame();

    this.gameWorld.initGame(levelData);

    setInterval(() => {
      this.gameWorld.logicStep();
    }, LOCAL_TICK_TIME);
  }
}
