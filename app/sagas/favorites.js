import storage from 'electron-json-storage';
import { take, cps, put, select, call } from 'redux-saga/effects';
import { initialize } from 'redux-form';

import {
  selectFavoriteRequest as selectFavoriteRequestAction,
  selectFavorite as selectFavoriteAction,
  removeFavorite as removeFavoriteAction,
  fillFavorites as fillFavoritesAction,
} from '../actions/favorites';

import sshConnect from '../utils/sshForward';
import { configureConnect, connectDB } from '../utils/pgDB';

export function* saveFavorite() {
  while (true) {
    const { payload } = yield take('favorites/ADD_REQUEST');
    const favorites = yield cps(storage.get, 'DBGlassFavorites');

    favorites[payload.id] = payload;
    yield cps(storage.set, 'DBGlassFavorites', favorites);
    yield put(fillFavoritesAction({
      ids: [payload.id.toString()],
      map: { [payload.id]: payload },
    }));
    yield put(selectFavoriteRequestAction(payload.id));
  }
}

export function* removeFavorite() {
  while (true) {
    const { payload } = yield take('favorites/REMOVE_REQUEST');
    const favorites = yield cps(storage.get, 'DBGlassFavorites');

    delete favorites[payload];
    yield cps(storage.set, 'DBGlassFavorites', favorites);
    yield put(removeFavoriteAction(payload));

    const restFavoritesIds = Object.keys(favorites);
    const selectFavoriteId = restFavoritesIds.length ? restFavoritesIds[0] : null;
    yield put(selectFavoriteRequestAction(selectFavoriteId));
  }
}

export function* selectFavorite() {
  while (true) {
    const { payload } = yield take('favorites/SELECT_REQUEST');
    const favorite = yield select(state => state.favorites.byId[payload]);

    if (favorite) {
      yield put(initialize('connectForm', favorite));
      yield cps(storage.set, 'LastSelectedFavorite', favorite.id);
    } else {
      yield put(initialize('connectForm', {
        port: 5432,
        sshPort: 22,
        ssl: false,
        useSSH: false,
        sshAuthType: 'password',
      }));
    }
    yield put(selectFavoriteAction(payload));
  }
}


export function* fetchFavorites() {
  while (true) {
    yield take('favorites/FETCH_REQUEST');
    const favorites = yield cps(storage.get, 'DBGlassFavorites');
    const ids = Object.keys(favorites);
    yield put(fillFavoritesAction({ ids, map: favorites }));
    const lastSelectedFavorite = yield cps(storage.get, 'LastSelectedFavorite');
    if (typeof lastSelectedFavorite === 'string') {
      yield put(selectFavoriteRequestAction(lastSelectedFavorite));
    } else {
      yield put(selectFavoriteRequestAction(null));
    }
  }
}

export function* saveFavouriteTablesQuantity() {
  while (true) {
    const { payload } = yield take('favorites/ADD_FAVORITE_TABLES_QUANTITY');
    const favorites = yield cps(storage.get, 'DBGlassFavorites');
    favorites[payload.currentFavoriteId].tablesQuantity = payload.quantity;
    yield cps(storage.set, 'DBGlassFavorites', favorites);
  }
}

export function* submitConnectionForm() {
  while (true) {
    const { payload } = yield take('favorites/SUBMIT_CONNECTION_FORM');
    configureConnect(payload);
    console.log('payload', payload);
    const { payload: { resolve } } = yield take('favorites/CONNECT_TO_DB');
    console.log('resolve', resolve);
    const callback = (isConnected, err) => {
      resolve({ err, isConnected });
    };
    const data = yield cps(connectDB, callback);
    // const data = yield call(connectDB);
    console.log('data', data);

    // const data = resolve({ err, isConnected });
    // const data = cps(resolve.payload.resolve, isConnected, err);
    // console.log('data', resolve(data));
  }
}
