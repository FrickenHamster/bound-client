import Bounder from './runner/Bounder.js';
import { Container } from 'pixi.js';
import GameMap from './map/GameMap.js';

export default class GameWorld {
  constructor(gameManager, layer) {
    this.mapLayer = new Container();
    layer.addChild(this.mapLayer);
    this.bounderLayer = new Container();
    layer.addChild(this.bounderLayer);

    this.gameMap = new GameMap(this, this.mapLayer);
  }

  initGame() {
    this.bounder = new Bounder(this, this.bounderLayer);

    this.bounder.spawn(200, 200);
  }

  logicStep() {
    this.bounder.logicStep();
  }
}
