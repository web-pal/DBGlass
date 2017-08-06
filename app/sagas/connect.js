// @flow
import { ipcRenderer } from 'electron';
import { put, take, call, cps } from 'redux-saga/es/effects';
import { startSubmit, stopSubmit } from 'redux-form';

import sshConnect from '../utils/sshForward';
import { configureConnect, connectDB } from '../utils/pgDB';
import { setConnectedState, toggleConnectingLadda, setConnectionError } from '../actions/ui';
import { saveLastSelectedTable } from './tables';
import {
  fetchTablesRequest as fetchTablesRequestAction,
} from '../actions/tables';

import type { Favorite } from '../types';

const remote = require('electron').remote;

export function* connect(data: Favorite): Generator<*, *, *> {
  try {
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
    if (isConnected) {
      yield put(fetchTablesRequestAction());
    }
  } catch (err) {
    console.log(`Error(connect), ${err.message}`);
  }
}

export function* appQuit(): Generator<*, *, *> {
  while (true) {
    yield take('ui/APP_QUIT_REQUEST');
    ipcRenderer.send('set-should-quit');
    yield call(saveLastSelectedTable);
    remote.getCurrentWindow().destroy();
  }
}

export function* onDisconnect(): Generator<*, *, *> {
  while (true) {
    const { payload } = yield take('ui/SET_CONNECTED_STATE');
    if (!payload) {
      yield call(saveLastSelectedTable);
    }
  }
}

export function* connectRequest(): Generator<*, *, *> {
  while (true) {
    const { payload: { data } } = yield take('connect/CONNECT_REQUEST');
    yield call(connect, data);
  }
}
