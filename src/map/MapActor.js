import { Sprite, Texture } from 'pixi.js';
import {
  MAP_NODE_HEIGHT,
  MAP_NODE_WIDTH,
  TileColor,
} from '#config/mapConstants';

export default class MapActor {
  constructor(gameMap, layer) {
    this.gameMap = gameMap;
    this.layer = layer;
    this.canvas = document.createElement('canvas');

    this.context = this.canvas.getContext('2d');
    this.sprite = new Sprite();
    this.sprite.texture = Texture.from(this.canvas);

    this.layer.addChild(this.sprite);
  }

  init({ mapWidth, mapHeight, mapTiles }) {
    this.canvas.width = mapWidth * MAP_NODE_WIDTH;
    this.canvas.height = mapHeight * MAP_NODE_HEIGHT;

    this.mapTiles = [];

    for (let i = 0; i < mapHeight; i++) {
      for (let j = 0; j < mapWidth; j++) {
        const id = i * mapWidth + j;
        let tile = 0;
        if (mapTiles) {
          tile = mapTiles[id];
        }
        const color = TileColor[tile];
        this.context.fillStyle = color;
        this.context.fillRect(
          j * MAP_NODE_WIDTH,
          i * MAP_NODE_HEIGHT,
          MAP_NODE_WIDTH,
          MAP_NODE_HEIGHT,
        );
        this.mapTiles[id] = 0;
      }
    }

    this.sprite.texture.update();
  }
}
