import { put, take, cps } from 'redux-saga/effects';
import { startSubmit, stopSubmit } from 'redux-form';

import sshConnect from '../utils/sshForward';
import { configureConnect, connectDB } from '../utils/pgDB';
import { setConnectedState, toggleConnectingLadda, setConnectionError } from '../actions/ui';


export function* startConnect() {
  while (true) {
    const { payload: { data } } = yield take('connect/CONNECT_REQUEST');
    yield put(toggleConnectingLadda(true));
    const {
      useSSH, sshHost, sshPort, sshUsername, sshPassword,
      sshKeyPassword, sshAuthType, privateKey, port, address,
    } = data;
    let isConnected = false;
    configureConnect(data);
    yield put(startSubmit('connectForm'));
    if (useSSH) {
      if (sshAuthType === 'key' && !privateKey) {
        yield put(setConnectionError('Missing private key'));
        yield put(stopSubmit('connectForm', { _error: 'Missing private key' }));
        yield put(toggleConnectingLadda(false));
      }
      const sshParams = {
        host: sshHost,
        port: sshPort,
        username: sshUsername,
        sshAuthType,
        password: sshPassword,
        passphrase: sshKeyPassword,
        privateKey,
      };
      try {
        const freePort = yield cps(sshConnect, { ...sshParams, dbPort: port, dbAddress: address });
        configureConnect({ ...data, port: freePort });
        isConnected = yield cps(connectDB);
      } catch (err) {
        yield put(setConnectionError(err));
        isConnected = false;
      }
    } else {
      yield put(setConnectionError(''));
      isConnected = yield cps(connectDB);
    }
    yield put(setConnectedState(isConnected));
    yield put(toggleConnectingLadda(false));
  }
}
