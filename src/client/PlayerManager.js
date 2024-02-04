import Player from './Player';

import { MAX_PLAYERS } from '#config/gameConstants';

export default class PlayerManager {
  constructor(manager) {
    this.manager = manager;
    this.playerPool = [];
    this.playerMap = {};
    for (let i = 0; i < MAX_PLAYERS; i++) {
      const player = new Player(this, i);
      this.playerPool.push(player);
      this.playerMap[i] = player;
    }
    this.activePlayers = [];
  }

  init() {
    this.players = [];
  }

  addPlayer(props) {
    const { playerId, self } = props;
    if (this.playerMap[playerId].active) {
      console.error('adding player that already exists');
    }
    const player = this.playerMap[playerId];
    player.init(props);
    this.playerMap[props.playerId] = player;
    this.activePlayers.push(player);

    if (self) this.selfPlayer = player;

    return player;
  }

  playerLeft(playerId) {
    const player = this.playerMap[playerId];
    if (!player) {
      console.error('player left, not found', playerId);
    }
    const ind = this.activePlayers.indexOf(player);
    if (ind > -1) {
      this.activePlayers.splice(ind, 1);
    }
    player.leave();
  }

  syncPlayers(playerData) {
    for (const data of playerData) {
      this.addPlayer({
        playerId: data.id,
        name: data.name,
      });
    }
  }
}
