import { app, BrowserWindow, Menu, shell, ipcMain } from 'electron';
const openSshTunnel = require('open-ssh-tunnel');
const readFileSync = require('fs').readFileSync;
let menu;
let template;
let mainWindow = null;
let sshServer = null;

if (process.env.NODE_ENV === 'development') {
  require('electron-debug')(); // eslint-disable-line global-require
}


app.on('window-all-closed', () => {
  if (sshServer) {
    sshServer.close();
  }
  if (process.platform !== 'darwin') app.quit();
});


const installExtensions = async () => {
  if (process.env.NODE_ENV === 'development') {
    const installer = require('electron-devtools-installer'); // eslint-disable-line global-require
    const extensions = [
      'REACT_DEVELOPER_TOOLS',
      'REDUX_DEVTOOLS'
    ];
    const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
    for (const name of extensions) {
      try {
        await installer.default(installer[name], forceDownload);
      } catch (e) {} // eslint-disable-line
    }
  }
};


ipcMain.on('ssh-connect', (event, params) => {
  if (sshServer) {
    sshServer.close();
  }
  const opts = {
    host: params.sshServer,
    port: params.sshPort,
    username: params.sshUser,
    dstPort: params.port,
    srcPort: 5433,
    srcAddr: '127.0.0.1',
    dstAddr: params.address,
    readyTimeout: 5000,
    forwardTimeout: 2000,
    localPort: 5433,
    localAddr: '127.0.0.1'
  };

  if (params.sshAuthType === 'key') {
    opts.privateKey = readFileSync(params.privateKey);
    if (params.passphrase) {
      opts.passphrase = params.passphrase;
    }
  } else {
    opts.password = params.sshPassword;
  }
  openSshTunnel(opts).then(server => {
    sshServer = server;
    event.sender.send('ssh-connect', true);
  }).catch(err => {
    event.sender.send('ssh-connect', false, `SSH ${err.level} error`);
  });
});


app.on('activate', () => {
  if (mainWindow === null) {
    mainWindow = new BrowserWindow({
      show: false,
      width: 1600,
      height: 900,
      minWidth: 800,
      minHeight: 400
    });

    mainWindow.loadURL(`file://${__dirname}/app/app.html`);

    mainWindow.webContents.on('did-finish-load', () => {
      mainWindow.show();
      mainWindow.focus();
    });

    mainWindow.on('closed', () => {
      mainWindow = null;
    });
  }
});


app.on('ready', async () => {
  await installExtensions();

  mainWindow = new BrowserWindow({
    show: false,
    width: 1600,
    height: 900,
    minWidth: 800,
    minHeight: 400
  });

  mainWindow.loadURL(`file://${__dirname}/app/app.html`);

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.show();
    mainWindow.focus();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.openDevTools();
  }

  if (process.platform === 'darwin') {
    template = [{
      label: 'DBGlass',
      submenu: [{
        label: 'About DBGlass',
        selector: 'orderFrontStandardAboutPanel:'
      }, {
        type: 'separator'
      }, {
        label: 'Hide DBGlass',
        accelerator: 'Command+H',
        selector: 'hide:'
      }, {
        label: 'Hide Others',
        accelerator: 'Command+Shift+H',
        selector: 'hideOtherApplications:'
      }, {
        label: 'Show All',
        selector: 'unhideAllApplications:'
      }, {
        type: 'separator'
      }, {
        label: 'Quit',
        accelerator: 'Command+Q',
        click() {
          app.quit();
        }
      }]
    }, {
      label: 'Edit',
      submenu: [{
        label: 'Undo',
        accelerator: 'Command+Z',
        selector: 'undo:'
      }, {
        label: 'Redo',
        accelerator: 'Shift+Command+Z',
        selector: 'redo:'
      }, {
        type: 'separator'
      }, {
        label: 'Cut',
        accelerator: 'Command+X',
        selector: 'cut:'
      }, {
        label: 'Copy',
        accelerator: 'Command+C',
        selector: 'copy:'
      }, {
        label: 'Paste',
        accelerator: 'Command+V',
        selector: 'paste:'
      }, {
        label: 'Select All',
        accelerator: 'Command+A',
        selector: 'selectAll:'
      }]
    }, {
      label: 'View',
      submenu: (process.env.NODE_ENV === 'development') ? [{
        label: 'Reload',
        accelerator: 'Command+R',
        click() {
          mainWindow.webContents.send('reload');
        }
      }, {
        label: 'Toggle Full Screen',
        accelerator: 'Ctrl+Command+F',
        click() {
          mainWindow.setFullScreen(!mainWindow.isFullScreen());
        }
      }, {
        label: 'Toggle Developer Tools',
        accelerator: 'Alt+Command+I',
        click() {
          mainWindow.toggleDevTools();
        }
      }] : [{
        label: 'Toggle Full Screen',
        accelerator: 'Ctrl+Command+F',
        click() {
          mainWindow.setFullScreen(!mainWindow.isFullScreen());
        }
      }]
    }, {
      label: 'Window',
      submenu: [{
        label: 'Minimize',
        accelerator: 'Command+M',
        selector: 'performMiniaturize:'
      }, {
        label: 'Close',
        accelerator: 'Command+W',
        selector: 'performClose:'
      }, {
        type: 'separator'
      }, {
        label: 'Bring All to Front',
        selector: 'arrangeInFront:'
      }]
    }, {
      label: 'Help',
      submenu: [{
        label: 'Learn More',
        click() {
          shell.openExternal('https://github.com/mic-fadeev/postglass');
        }
      }, {
        label: 'Hire me!',
        click() {
          shell.openExternal('https://www.upwork.com/freelancers/~019739a15313b8bd52');
        }
      }, {
        label: 'Search Issues',
        click() {
          shell.openExternal('https://github.com/mic-fadeev/postglass/issues');
        }
      }]
    }];
    menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
    mainWindow.toggleDevTools();
  } else {
    template = [{
      label: '&View',
      submenu: (process.env.NODE_ENV === 'development') ? [{
        label: '&Reload',
        accelerator: 'Ctrl+R',
        click() {
          mainWindow.reload();
        }
      }, {
        label: 'Toggle &Full Screen',
        accelerator: 'F11',
        click() {
          mainWindow.setFullScreen(!mainWindow.isFullScreen());
        }
      }, {
        label: 'Toggle &Developer Tools',
        accelerator: 'Alt+Ctrl+I',
        click() {
          mainWindow.toggleDevTools();
        }
      }] : [{
        label: 'Toggle &Full Screen',
        accelerator: 'F11',
        click() {
          mainWindow.setFullScreen(!mainWindow.isFullScreen());
        }
      }]
    }, {
      label: 'Help',
      submenu: [{
        label: 'Learn More',
        click() {
          shell.openExternal('https://github.com/mic-fadeev/postglass');
        }
      }, {
        label: 'Hire me!',
        click() {
          shell.openExternal('https://www.upwork.com/freelancers/~019739a15313b8bd52');
        }
      }, {
        label: 'Search Issues',
        click() {
          shell.openExternal('https://github.com/mic-fadeev/postglass/issues');
        }
      }]
    }];

    menu = Menu.buildFromTemplate(template);
    mainWindow.setMenu(menu);
  }
});
