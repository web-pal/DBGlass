const openSSHTunnel = require('electron').remote.require('open-ssh-tunnel');
const readFileSync = require('fs').readFileSync;
const net = require('electron').remote.require('net');


function getFreePort(fn) {
  const srv = net.createServer();
  let calledFn = false;

  srv.on('error', (err) => {
    srv.close();
    if (!calledFn) {
      calledFn = true;
      fn(err);
    }
  });

  srv.listen(0, () => {
    const port = srv.address().port;

    srv.close();

    if (!calledFn) {
      calledFn = true;

      if (!port) {
        fn(new Error('Unable to get the server\'s given port'));
      } else {
        fn(null, port);
      }
    }
  });
}

let server = null;


function connect(params, freePort, callback) {
  const { dbPort, dbAddress, sshAuthType, passphrase, ...data } = params;
  const opts = {
    ...data,
    srcPort: freePort,
    dstPort: dbPort,
    srcAddr: dbAddress,
    dstAddr: 'localhost',
    localAddr: '127.0.0.1',
    localPort: freePort,
    readyTimeout: 5000,
    forwardTimeout: 2000,
  };
  if (sshAuthType === 'key') {
    opts.privateKey = readFileSync(params.privateKey);
    if (passphrase) {
      opts.passphrase = passphrase;
    }
  }
  openSSHTunnel(opts).then((conn) => {
    server = conn;
    callback(null, freePort);
  }).catch((err) => {
    callback(`SSH ERROR: ${err.level}`, freePort);
  });
}

export default function sshConnect(params, callback) {
  getFreePort((err, port) => {
    if (err) {
      callback(err);
    } else if (server) {
      server.close(() => {
        connect(params, port, callback);
      });
    } else {
      connect(params, port, callback);
    }
  });
}
