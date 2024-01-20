import CheckpointZone from './CheckpointZone.js';

export default class ZoneManager {
  constructor() {}

  init(zones) {
    this.checkpoints = [];

    for (const zone of zones) {
      switch (zone.type) {
        case 'startZone':
          this.startZone = zone;
          break;

        case 'checkpointZone':
          const checkpoint = new CheckpointZone(
            this.checkpoints.length,
            zone.x,
            zone.y,
            zone.width,
            zone.height,
          );
          this.checkpoints.push(checkpoint);
          break;
      }
    }
  }

  randomStartPosition() {
    return {
      x: Math.round(this.startZone.x + this.startZone.width * Math.random()),
      y: Math.round(this.startZone.y + this.startZone.height * Math.random()),
    };
  }

  randomCheckpointPosition(index) {
    const checkpoint = this.checkpoints[index];
    return {
      x: Math.round(checkpoint.x + checkpoint.width * Math.random()),
      y: Math.round(checkpoint.y + checkpoint.height * Math.random()),
    };
  }

  pointInCheckpoint(x, y) {
    return this.checkpoints.find(c => c.pointInZone(x, y));
  }
}
