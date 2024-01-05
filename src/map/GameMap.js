import { Graphics } from 'pixi.js';
import { AStarFinder, Grid } from 'pathfinding';
import {
  mapNodeHeight,
  mapNodeWidth,
  pathNodeHeight,
  pathNodeWidth,
} from '#config/mapConstants';

import Collisions from 'collisions';

export default class GameMap {
  constructor(gameWorld, layer) {
    this.gameWorld = gameWorld;
    this.layer = layer;

    this.mapGraphics = new Graphics();
    this.layer.addChild(this.mapGraphics);
    this.blockMap = [];

    this.grid = new Grid(60, 60);

    this.debugGraphics = new Graphics();
    this.layer.addChild(this.debugGraphics);

    this.pg = new Graphics();
    this.layer.addChild(this.pg);

    this.pf = new AStarFinder();

    this.lineColSystem = new Collisions();

    for (let i = 0; i < 30; i++) {
      for (let j = 0; j < 30; j++) {
        if (Math.random() < 0.3) {
          this.blockMap[i * 30 + j] = 1;
          const points = [
            [j * mapNodeWidth, i * mapNodeHeight],
            [(j + 1) * mapNodeWidth, i * mapNodeHeight],
            [(j + 1) * mapNodeWidth, (i + 1) * mapNodeHeight],
            [j * mapNodeWidth, (i + 1) * mapNodeHeight],
          ];
          this.lineColSystem.createPolygon(
            j * mapNodeWidth,
            i * mapNodeHeight,
            points,
          );
          this.mapGraphics.beginFill(0x24352e);
          this.mapGraphics.drawRect(
            j * mapNodeWidth,
            i * mapNodeHeight,
            mapNodeWidth,
            mapNodeHeight,
          );
          this.mapGraphics.endFill();
          this.grid.setWalkableAt(j * 2, i * 2, false);
          this.grid.setWalkableAt(j * 2 + 1, i * 2, false);
          this.grid.setWalkableAt(j * 2, i * 2 + 1, false);
          this.grid.setWalkableAt(j * 2 + 1, i * 2 + 1, false);
        } else {
          this.blockMap[i * 30 + j] = 0;
        }
      }
    }

    this.lineColSystem.update();
  }

  getClosestTarget(xPos, yPos, tarX, tarY) {
    let gx = Math.floor(tarX / pathNodeWidth);
    let gy = Math.floor(tarY / pathNodeHeight);
    if (this.grid.isWalkableAt(gx, gy)) {
      return { x: tarX, y: tarY };
    }
    const rad = Math.atan2(yPos - tarY, xPos - tarX);
    const dx = Math.cos(rad);
    const dy = Math.sin(rad);
    let t = 0;
    while (
      !this.grid.isWalkableAt(Math.floor(gx), Math.floor(gy)) &&
      (Math.abs(xPos - gx) > 1 || Math.abs(yPos - gy) > 1)
    ) {
      gx += dx;
      gy += dy;
      t++;
      if (t > 50) break;
    }

    return { x: gx * pathNodeWidth, y: gy * pathNodeHeight };
  }

  findPath(x, y, tarX, tarY) {
    const sx = Math.floor(x / pathNodeWidth);
    const sy = Math.floor(y / pathNodeHeight);
    let ex = Math.floor(tarX / pathNodeWidth);
    let ey = Math.floor(tarY / pathNodeHeight);

    let path = this.pf.findPath(sx, sy, ex, ey, this.grid.clone());
    let tarEnd = true;
    if (path.length === 1) return { path, tarX, tarY };
    if (path.length === 0) {
      tarEnd = false;
      const rad = Math.atan2(sy - ey, sx - ex);
      const dx = Math.cos(rad);
      const dy = Math.sin(rad);
      let t = 0;
      while (path.length === 0) {
        ex += dx;
        ey += dy;
        path = this.pf.findPath(
          sx,
          sy,
          Math.floor(ex),
          Math.floor(ey),
          this.grid.clone(),
        );
        t++;
        if (t > 10) return;
      }
      tarX = path[path.length - 1][0] * pathNodeWidth;
      tarY = path[path.length - 1][1] * pathNodeHeight;
    }

    let n = 0;
    let c = 1;

    const finalPath = [path[0]];
    while (c < path.length) {
      if (
        !this.checkLineClear(path[n][0], path[n][1], path[c][0], path[c][1])
      ) {
        n = c - 1;
        finalPath.push(path[c - 1]);
      }
      c++;
    }
    finalPath.push(path[path.length - 1]);

    this.debugGraphics.clear();
    this.debugGraphics.lineStyle({
      width: 2,
      color: 'black',
    });

    this.debugGraphics.moveTo(sx * pathNodeWidth + 8, sy * pathNodeHeight + 8);

    for (const [x, y] of finalPath) {
      this.debugGraphics.lineTo(x * pathNodeWidth + 8, y * pathNodeHeight + 8);
    }
    return { path: finalPath, tarX, tarY };
  }

  checkLineClear(sx, sy, ex, ey, debug) {
    const smx = sx * mapNodeWidth;
    const smy = sy * mapNodeHeight;
    const emx = ex * mapNodeWidth;
    const emy = ey * mapNodeHeight;
    const rad = Math.atan2(emy - smy, emx - smx);
    const length = Math.sqrt(Math.pow(emy - smy, 2) + Math.pow(emx - smx, 2));
    const points = [
      [0, -mapNodeHeight],
      [length, -mapNodeHeight],
      [length, mapNodeHeight],
      [0, mapNodeHeight],
    ];

    if (debug) {
      this.pg.clear();
      this.pg.beginFill(0x3423e1);
      this.pg.moveTo(smx + points[0][0], smy + points[0][1]);
      for (const pp of points) {
        this.pg.lineTo(smx + pp[0], smy + pp[1]);
      }
      this.pg.endFill();
      this.pg.rotation = rad;
    }

    const checkPoly = this.lineColSystem.createPolygon(smx, smy, points);
    checkPoly.angle = rad;
    this.lineColSystem.update();

    const potentials = checkPoly.potentials();
    const results = this.lineColSystem.createResult();

    for (const wall of potentials) {
      if (checkPoly.collides(wall, results)) {
        checkPoly.remove();
        return false;
      }
    }
    checkPoly.remove();
    return true;
  }
}
