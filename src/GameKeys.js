export default class GameKeys {
  constructor() {
    this.keyMap = {};
    this.controls = {};
    this.blockText = true;
    this.active = true;

    window.addEventListener('keydown', e => {
      if (!this.active) return;
      const control = this.keyMap[e.code];
      if (control && control.reset) {
        control.isDown = true;
        control.pressed = true;
        control.reset = false;
        if (this.blockText) e.preventDefault();
      }
    });

    window.addEventListener('keyup', e => {
      if (!this.active) return;
      const control = this.keyMap[e.code];
      if (control) {
        control.isDown = false;
        control.released = true;
        control.reset = true;
        if (this.blockText) e.preventDefault();
      }
    });
  }

  addKey(label, keys) {
    const control = {
      isDown: false,
      pressed: false,
      released: false,
      prevDown: false,
      reset: true,
    };
    this.controls[label] = control;
    for (let key of keys) {
      this.keyMap[key] = control;
    }
  }

  update() {
    for (const ckey in this.controls) {
      const control = this.controls[ckey];
      control.pressed = false;
      if (control.prevDown) control.pressed = false;
      if (!control.prevDown) control.released = false;
      control.prevDown = control.isDown;
    }
  }
}
