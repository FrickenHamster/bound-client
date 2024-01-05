import { Assets, Sprite } from 'pixi.js';
import { pathNodeHeight, pathNodeWidth } from '#config/mapConstants';

export default class Bounder {
  constructor(gameWorld, layer) {
    this.gameWorld = gameWorld;
    this.layer = layer;
    this.sprite = new Sprite();
    layer.addChild(this.sprite);
    this.alive = false;
  }

  async spawn(x, y) {
    this.xPos = x;
    this.yPos = y;
    const bounderSprites = await Assets.loadBundle('bounders');

    this.state = 'idle';

    this.tarX = this.xPos;
    this.tarY = this.yPos;

    this.moveSpeed = 4;

    this.sprite.texture = bounderSprites.usagibobo;
    this.sprite.anchor.set(0.5, 0.5);
    this.sprite.alpha = 0.2;

    this.updateSprite();
    this.alive = true;
  }

  die() {
    this.xPos = Math.random() * 500;
    this.yPos = Math.random() * 500;
    this.state = 'idle';
    this.updateSprite();
  }

  logicStep() {
    if (!this.alive) return;

    switch (this.state) {
      case 'moving':
        let moveLeft = this.moveSpeed;
        const distSq =
          Math.pow(this.nextY - this.yPos, 2) +
          Math.pow(this.nextX - this.xPos, 2);
        if (distSq < this.moveSpeed * this.moveSpeed) {
          this.pathPosition++;
          if (this.pathPosition === this.path.length) {
            this.xPos = this.tarX;
            this.yPos = this.tarY;
            this.state = 'idle';
          } else if (this.pathPosition >= this.path.length - 1) {
            this.nextX = this.tarX;
            this.nextY = this.tarY;
            moveLeft -= Math.sqrt(distSq);
          } else {
            this.nextX = this.path[this.pathPosition][0] * pathNodeWidth + 8;
            this.nextY = this.path[this.pathPosition][1] * pathNodeHeight + 8;
            moveLeft -= Math.sqrt(distSq);
          }
        }
        const moveRad = Math.atan2(
          this.nextY - this.yPos,
          this.nextX - this.xPos,
        );

        this.xPos += Math.cos(moveRad) * moveLeft;
        this.yPos += Math.sin(moveRad) * moveLeft;

        this.updateSprite();
        break;
    }
  }

  orderMoveTarget(tarX, tarY) {
    const final = this.gameWorld.gameMap.getClosestTarget(
      this.xPos,
      this.yPos,
      tarX,
      tarY,
    );
    tarX = final.x;
    tarY = final.y;
    this.tarX = tarX;
    this.tarY = tarY;
    const res = this.gameWorld.gameMap.findPath(
      this.xPos,
      this.yPos,
      tarX,
      tarY,
    );
    this.path = res.path;
    this.tarX = res.tarX;
    this.tarY = res.tarY;
    if (this.path?.length <= 1) return;

    this.state = 'moving';
    this.pathPosition = 1;

    this.nextX = this.path[1][0] * pathNodeWidth + 8;
    this.nextY = this.path[1][1] * pathNodeHeight + 8;
  }

  updateSprite() {
    this.sprite.position.set(this.xPos, this.yPos);
  }
}
