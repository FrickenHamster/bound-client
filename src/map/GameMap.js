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

  findPath(x, y, tarX, tarY) {
    const sx = Math.floor(x / pathNodeWidth);
    const sy = Math.floor(y / pathNodeHeight);
    const ex = Math.floor(tarX / pathNodeWidth);
    const ey = Math.floor(tarY / pathNodeHeight);

    const path = this.pf.findPath(sx, sy, ex, ey, this.grid.clone());

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
    return finalPath;
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
      //this.pg.drawRect(bx * pathNodeWidth, by * pathNodeHeight, 16, 16);
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

    /*let xx = sx;
		let yy = sy;
		const rad = Math.atan2(ey - sy, ex - sx);
		let dx = Math.cos(rad)
		let dy = Math.sin(rad)

		let t = 0;

		if (debug)
			this.pg.clear()

		while (Math.abs(ex - xx) > 1 || Math.abs(ey - yy) > 1) {
			xx += dx / 2;
			yy += dy / 2;

			const bx = Math.floor(xx);
			const by = Math.floor(yy)

			if (debug) {
				this.pg.beginFill(0x3423e1)
				this.pg.drawRect(bx * pathNodeWidth, by * pathNodeHeight, 16, 16);
				this.pg.endFill()
			}
			/!*const bx = Math.floor(xx / 2);
			const by = Math.floor(yy / 2);*!/
			if (debug)
			console.log('checking', Math.floor(xx), Math.floor(yy), this.grid.isWalkableAt(Math.floor(xx), Math.floor(yy)))
			/!*if (!this.grid.isWalkableAt(Math.floor(xx), Math.floor(yy)))
			//if (this.blockMap[by * 30 + bx] === 1)
				return false*!/
			let cx = Math.floor(xx)
			let cy = Math.floor(yy)

			for (let i = -1; i <= 1; i++) {
				for (let j = -1; j <= 1; j++) {
					if (!this.grid.isWalkableAt(cx + i, cy + j)) {
						return false
					}
				}
			}

			t++
			if (t > 100) {
				console.log('reeee')
				return true
			}
		}
		return true*/
  }
}
