export default class CheckpointZone {
  constructor(id, x, y, width, height) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  pointInZone(x, y) {
    return (
      x > this.x - this.width / 2 &&
      x < this.x + this.width / 2 &&
      y > this.y - this.height / 2 &&
      y < this.y + this.height / 2
    );
  }
}
