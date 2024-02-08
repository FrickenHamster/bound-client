import { createBufferFromProtocol, decodeProtocol, Protocol } from '#net';
import { getConfig } from '#config';

import levelData from '../../config/level.json';

const config = getConfig();

export default class Client {
  constructor(gameManager) {
    this.gameManager = gameManager;
    this.state = 'initial';
  }

  connect(host) {
    this.log(`connecting to host ${host}`);
    this.state = 'connecting';

    this.name = getRandomName();
    this.socket = new WebSocket(host);
    this.socket.binaryType = 'arraybuffer';
    this.socket.onopen = () => {
      this.log(`connected to host ${host}`);

      if (config.autoConnect) {
        console.log('meowwoooo');
        this.sendJoin();
      } else {
        this.sendAddPlayer(
          this.gameManager.name,
          this.gameManager.kumaData.kumaId,
          this.gameManager.kumaData.key,
        );
        this.sendJoin();
      }

      /*setInterval(() => {
        this.sendPing();
      }, 3000);*/
    };
    this.socket.onmessage = this.handleMessage;
  }

  sendAddPlayer(name, kumaId, key) {
    console.log('miu', name, kumaId, key);
    const buffer = createBufferFromProtocol(Protocol.ADD_PLAYER, {
      name,
      kumaId,
      key,
    });
    this.sendBuffer(buffer);
  }

  sendJoin() {
    const buffer = createBufferFromProtocol(
      Protocol.JOIN,
      this.gameManager.kumaData,
    );
    this.sendBuffer(buffer);
  }

  sendOrderMove(xPos, yPos) {
    const buffer = createBufferFromProtocol(Protocol.ORDER_MOVE, {
      xPos,
      yPos,
    });
    this.sendBuffer(buffer);
  }

  sendPing() {
    const buffer = createBufferFromProtocol(Protocol.PING, {
      time: Date.now() % 999999,
    });
    this.sendBuffer(buffer);
  }

  sendBuffer(buffer) {
    if (!this.socket) {
      console.error('trying to send buffer when no connection');
    }
    try {
      this.socket.send(buffer);
    } catch (e) {
      console.error('error sending buffer', e);
    }
  }

  handleMessage = message => {
    const json = decodeProtocol(message.data);
    if (config.logNet) {
      this.log(json);
    }
    switch (json.protocol) {
      case Protocol.SYNC_PLAYERS: {
        this.gameManager.playerManager.addPlayer({
          self: true,
          playerId: json.selfId,
          name: this.name,
        });
        this.gameManager.playerManager.syncPlayers(json.players);
        this.gameManager.initGame(levelData);
        break;
      }

      case Protocol.PLAYER_JOINED: {
        this.gameManager.playerManager.addPlayer({
          playerId: json.id,
          name: json.name,
        });
        break;
      }

      case Protocol.PLAYER_LEFT: {
        this.gameManager.playerManager.playerLeft(json.id);
        break;
      }

      case Protocol.GAME_INITIAL_SYNC: {
        console.log('got shit', Date.now(), json.tickCount);
        this.gameManager.gameWorld.syncInitialGame(json);
        break;
      }

      case Protocol.INIT_BOUNDER: {
        this.gameManager.gameWorld.bounderManager.initBounder(json);
        break;
      }

      case Protocol.BOUNDER_SPAWNED: {
        this.gameManager.gameWorld.bounderManager.bounderMap[json.id].spawn(
          json.xPos,
          json.yPos,
        );
        break;
      }

      case Protocol.BOUNDER_DEACTIVATED: {
        this.gameManager.gameWorld.bounderManager.deactivateBounder(json.id);
        break;
      }

      case Protocol.BOUNDER_MOVE: {
        const bounder =
          this.gameManager.gameWorld.bounderManager.bounderMap[json.id];
        bounder.orderMoveTarget(json.tarX, json.tarY);
        break;
      }

      case Protocol.PING: {
        console.log(
          'ping',
          (Date.now() % 999999) - json.time,
          json.tick,
          this.gameManager.gameWorld.tickCount,
          'diff',
          json.tick - this.gameManager.gameWorld.tickCount,
        );
        break;
      }
    }
  };

  log = msg => {
    console.log('Client', msg);
  };
}

export const getRandomName = () => {
  const nn = Math.floor(Math.random() * 5);
  const nonce = Math.floor(Math.random() * 999);
  switch (nn) {
    case 0:
      return 'Piske' + nonce;
    case 1:
      return 'Usagi' + nonce;
    case 2:
      return 'Brown' + nonce;
    case 3:
      return 'Sally' + nonce;
    case 4:
      return 'Edward' + nonce;
  }
};
