/* eslint global-require: 1, flowtype-errors/show-errors: 0 */
// @flow
import path from 'path';
import storage from 'electron-json-storage';
import { app, Tray, ipcMain, BrowserWindow, screen } from 'electron';
import MenuBuilder from './menu';

let mainWindow;
let tray;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (process.env.NODE_ENV === 'development') {
  require('electron-debug')();
  const p = path.join(__dirname, '..', 'app', 'node_modules');
  require('module').globalPaths.push(p);
}

process.on('uncaughtExecption', (err) => {
  console.error('Uncaught exception in main process', err);
});


const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = [
    'REACT_DEVELOPER_TOOLS',
    'REDUX_DEVTOOLS'
  ];

  return Promise
    .all(extensions.map(name => installer.default(installer[name], forceDownload)))
    .catch(console.log);
};


app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
    tray.destroy();
  }
});


function createWindow(callback) {
  // disabling chrome frames differ on OSX and other platforms
  // https://github.com/electron/electron/blob/master/docs/api/frameless-window.md
  const noFrameOption = {};
  switch (process.platform) {
    case 'darwin':
      noFrameOption.titleBarStyle = 'hidden';
      break;
    case 'linux':
    case 'windows':
      noFrameOption.frame = true;
      break;
    default:
      break;
  }
  storage.get('lastWindowSize', (err, data) => {
    if (err) {
      console.log(err);
    }
    const workAreaSize = screen.getPrimaryDisplay().workAreaSize;
    const lastWindowSize = Object.keys(data).length ?
      data : { width: workAreaSize.width, height: workAreaSize.height };
    mainWindow = new BrowserWindow({
      show: false,
      minWidth: 800,
      minHeight: 400,
      ...lastWindowSize,
      ...noFrameOption,
    });
    if (callback) {
      callback();
    }

    mainWindow.loadURL(`file://${__dirname}/app.html`);
    mainWindow.on('closed', () => {
      mainWindow = null;
    });

    mainWindow.on('ready-to-show', () => {
      if (mainWindow) {
        if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
          mainWindow.webContents.openDevTools();
        }
        mainWindow.show();
        mainWindow.focus();
      }
    });
  });
}

ipcMain.on('minimize', () => {
  if (mainWindow) {
    mainWindow.minimize();
  }
});

ipcMain.on('maximize', () => {
  if (mainWindow) {
    mainWindow.maximize();
  }
});

ipcMain.on('unmaximize', () => {
  if (mainWindow) {
    mainWindow.unmaximize();
  }
});

ipcMain.on('errorInWindow', (e, error) => {
  console.log(`${error[0]} @ ${error[1]} ${error[2]}:${error[3]}`);
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  } else {
    mainWindow.show();
  }
});

app.on('ready', async () => {
  if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
    await installExtensions();
  }

  tray = new Tray(path.join(__dirname, './assets/images/icon.png'));
  tray.setToolTip('Open DBGlass');
  tray.on('click', () => {
    if (mainWindow) {
      mainWindow.show();
    }
  });
  createWindow(() => {
    const menuBuilder = new MenuBuilder(mainWindow);
    menuBuilder.buildMenu();
  });
});
