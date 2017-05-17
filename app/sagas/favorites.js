import storage from 'electron-json-storage';
import { take, cps, put, select } from 'redux-saga/effects';
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
