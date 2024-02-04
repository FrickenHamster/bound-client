import { Assets, Container, Sprite, Text } from 'pixi.js';
import { pathNodeHeight, pathNodeWidth } from '#config/mapConstants';

export const BOUNDER_STATES = {
  IDLE: 0,
  MOVING: 1,
};

export default class Bounder {
  constructor(manager, layer, id) {
    this.manager = manager;
    this.id = id;
    this.layer = layer;

    this.container = new Container();
    layer.addChild(this.container);
    this.sprite = new Sprite();
    this.container.addChild(this.sprite);
    this.nameText = new Text('', {
      fontSize: 15,
      fill: 'white',
      stroke: 'black',
      strokeThickness: 3,
    });
    this.nameText.anchor.set(0.5);
    this.nameText.y = 28;
    this.container.addChild(this.nameText);
    this.alive = false;
  }

  async init({ xPos, yPos, ownerId, tarX, tarY, state }) {
    this.xPos = xPos;
    this.yPos = yPos;
    this.ownerId = ownerId;
    const bounderSprites = await Assets.loadBundle('bounders');

    const name =
      this.manager.gameWorld.gameManager.playerManager.playerMap[ownerId].name;
    this.nameText.text = name;

    this.state = 'idle';

    this.tarX = this.xPos;
    this.tarY = this.yPos;

    this.moveSpeed = 4;

    this.sprite.texture = bounderSprites.usagibobo;
    this.sprite.anchor.set(0.5, 0.5);
    // this.sprite.alpha = 0.2;

    this.checkpointIndex = -1;

    this.updateSprite();
    this.alive = true;
    this.active = true;

    if (state === BOUNDER_STATES.MOVING) {
      this.orderMoveTarget(tarX, tarY);
    }
  }

  spawn(xPos, yPos) {
    this.xPos = xPos;
    this.yPos = yPos;
    this.state = BOUNDER_STATES.IDLE;
    this.alive = true;
    this.updateSprite();
  }

  die() {
    /*let newPosition;
    if (this.checkpointIndex >= 0) {
      newPosition = this.gameWorld.zoneManager.randomCheckpointPosition(
        this.checkpointIndex,
      );
    } else {
      newPosition = this.gameWorld.zoneManager.randomStartPosition();
    }
    this.xPos = newPosition.x;
    this.yPos = newPosition.y;
    this.state = 'idle';
    this.updateSprite();*/
  }

  logicStep() {
    if (!this.alive) return;

    const startX = this.xPos;
    const startY = this.yPos;

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

    if (this.xPos !== startX || this.yPos !== startY) {
      const hitCheckpoint =
        this.manager.gameWorld.zoneManager.pointInCheckpoint(
          this.xPos,
          this.yPos,
        );
      if (hitCheckpoint && hitCheckpoint.id > this.checkpointIndex) {
        this.checkpointIndex = hitCheckpoint.id;
      }
    }
  }

  orderMoveTarget(tarX, tarY) {
    const final = this.manager.gameWorld.gameMap.getClosestTarget(
      this.xPos,
      this.yPos,
      tarX,
      tarY,
    );
    tarX = final.x;
    tarY = final.y;
    this.tarX = tarX;
    this.tarY = tarY;
    const res = this.manager.gameWorld.gameMap.findPath(
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
    this.container.position.set(this.xPos, this.yPos);
  }

  deactivate() {
    this.container.visible = false;
    this.active = false;
  }
}
