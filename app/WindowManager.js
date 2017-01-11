import { BrowserWindow } from 'electron';

const defaultWindowOptions = {
  show: false,
  width: 1600,
  height: 900,
  minWidth: 800,
  minHeight: 400
};
const windowOffset = 50;

export default class WindowManager {
  constructor() {
    this.windows = new Map();
  }

  createWindow() {
    const w = new BrowserWindow(this.windowOptions());
    const id = w.id;

    w.loadURL(`file://${__dirname}/app.html`);
    w.webContents.on('did-finish-load', () => {
      w.setTitle(`${w.getTitle()} #${id}`);
      w.show();
      w.focus();
    });

    w.on('closed', () => this.windows.delete(id));

    this.windows.set(id, w);

    return w;
  }

  windowOptions() {
    if (this.isEmpty()) {
      return defaultWindowOptions;
    }
    // copy current window's properties to new window
    const currentWindow = BrowserWindow.getFocusedWindow();
    const [width, height] = currentWindow.getSize();
    const [x, y] = currentWindow.getPosition();
    const relativeOptions = { width, height, x: x + windowOffset, y: y + windowOffset };

    return Object.assign({}, defaultWindowOptions, relativeOptions);
  }

  isEmpty() {
    return this.windows.size === 0;
  }
}
