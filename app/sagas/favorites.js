import storage from 'electron-json-storage';
import { take, takeEvery, cps, put, select } from 'redux-saga/effects';
import { initialize } from 'redux-form';

import {
  selectFavoriteRequest as selectFavoriteRequestAction,
  selectFavorite as selectFavoriteAction,
  removeFavorite as removeFavoriteAction,
  fillFavorites as fillFavoritesAction,
} from '../actions/favorites';

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
        id: null,
        connectionName: null,
        user: null,
        password: null,
        address: 'localhost',
        database: null,
        port: 5432,
        ssl: false,
        sshUsername: null,
        sshHost: null,
        sshPort: 22,
        sshKeyPassword: null,
        sshAuthType: 'password',
        sshPassword: null,
        privateKey: null,
        useSSH: false,
        tablesQuantity: null,
      }));
    }
    yield put(selectFavoriteAction(payload));
  }
}

export function* selectLastSelectedFavorite() {
  try {
    const lastSelectedFavorite = yield cps(storage.get, 'LastSelectedFavorite');
    if (typeof lastSelectedFavorite === 'string') {
      yield put(selectFavoriteRequestAction(lastSelectedFavorite));
    }
  } catch (err) {
    console.log(`Error(selectLastSelectedFavorite), ${err.message}`);
  }
}

export function* fetchFavorites() {
  try {
    const favorites = yield cps(storage.get, 'DBGlassFavorites');
    const ids = Object.keys(favorites);
    yield put(fillFavoritesAction({ ids, map: favorites }));
  } catch (err) {
    console.log(`Error(fetchFavorites), ${err.message}`);
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

export function* fetchFavoritesRequest() {
  yield takeEvery('favrotes/FETCH_REQUEST', fetchFavorites);
}
