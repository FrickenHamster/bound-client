const logMessage = () => {};

export default class Player {
  constructor(manager) {
    this.manager = manager;
    this.active = false;
  }

  init({ playerId, name, kumaId }) {
    this.playerId = playerId;
    this.name = name;
    this.kumaId = kumaId;

    this.active = true;
    this.log('initiated');
  }

  leave() {
    this.active = false;
    this.log('left');
  }

  log(msg) {
    logMessage(`Player(${this.playerId}:${this.name})`, msg);
  }
}
