import { BrowserWindow } from 'electron'; // eslint-disable-line import/extensions

const defaultWindowSetting = {
  show: false,
  width: 1600,
  height: 900,
  minWidth: 800,
  minHeight: 400
};

export default class WindowManager {
  constructor() {
    this.windows = new Map();
  }

  createWindow() {
    const w = new BrowserWindow(defaultWindowSetting);
    const id = w.id;

    w.loadURL(`file://${__dirname}/app/app.html`);
    w.webContents.on('did-finish-load', () => {
      w.show();
      w.focus();
    });

    w.on('closed', () => this.windows.delete(id));

    this.windows.set(id, w);

    return w;
  }

  isEmpty() {
    return this.windows.size === 0;
  }
}
