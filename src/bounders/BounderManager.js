import { MAX_BOUNDERS } from '#config/gameConstants';
import Bounder, { BOUNDER_STATES } from './Bounder.js';

export default class BounderManager {
  constructor(gameWorld, layer) {
    this.gameWorld = gameWorld;
    this.layer = layer;
    this.bounderMap = [];
    this.activeBounders = [];

    for (let i = 0; i < MAX_BOUNDERS; i++) {
      const bounder = new Bounder(this, layer, i);
      this.bounderMap[i] = bounder;
    }
  }

  initBounder(data) {
    const { id } = data;
    const bounder = this.bounderMap[id];
    if (bounder.active) {
      console.log('spawning living bounder');
    }

    bounder.init(data);
    if (
      data.ownerId ===
      this.gameWorld.gameManager.playerManager.selfPlayer.playerId
    ) {
      this.selfBounder = bounder;
    }

    this.activeBounders.push(bounder);

    return bounder;
  }

  logicStep() {
    for (const bounder of this.activeBounders) {
      bounder.logicStep();
    }
  }

  syncInitialBounders(boundersData) {
    for (const bd of boundersData) {
      const bounder = this.initBounder(bd);
      /* if (bd.state === BOUNDER_STATES.MOVING) {
          bounder.orderMoveTarget(bd.tarX, bd.tarY)
          console.log('meowwooo', bounder.state)
        }*/
    }
  }

  deactivateBounder(id) {
    const bounder = this.bounderMap[id];
    if (!bounder.active) {
      console.log('deactivating inactive bounder');
    }

    bounder.deactivate();
    this.removeBounder(bounder);
  }

  removeBounder(bounder) {
    const ind = this.activeBounders.indexOf(bounder);
    if (ind === -1) return;

    this.activeBounders.splice(ind, 1);
  }
}
