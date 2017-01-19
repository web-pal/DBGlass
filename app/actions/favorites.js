import { schema, normalize } from 'normalizr';
import path from 'path';
import electron from 'electron';
import { readFileSync, writeFileSync } from 'fs';
import storage from 'electron-json-storage';
import jwt from 'jwt-simple';
import * as types from './actionTypes';

const app = electron.app || electron.remote.app;
const userData = app.getPath('userData');

let key = '';
const storageKeyPath = path.join(userData, 'storageKey');

try {
  key = readFileSync(storageKeyPath);
} catch (e) {
  key = Math.random().toString(36).slice(-8);
  writeFileSync(storageKeyPath, key);
  window.firstInstall = true;
}
window.key = key.toString();

const favoriteSchema = new schema.Entity('favorites');

export function getFavorites() {

  return (dispatch) => {
    storage.get('postglass_favorites', (error, favs) => {
      const favorites = Array.isArray(favs) ?
        favs.map(favorite => {
          let decodedPassword;
          let decodedSSHPassword;
          if (favorite.password) {
            try {
              decodedPassword = jwt.decode(favorite.password, key);
            } catch (e) {
              decodedPassword = favorite.password;
            }
          }
          if (favorite.sshPassword) {
            try {
              decodedSSHPassword = jwt.decode(favorite.sshPassword, key);
            } catch (e) {
              decodedSSHPassword = favorite.sshPassword;
            }
          }
          return { ...favorite, password: decodedPassword, sshPassword: decodedSSHPassword };
        }) : [];

      const normalizedFavs = Object.keys(favorites).length === 0
          ? { entities: {}, result: [] }
          : normalize(favorites, [favoriteSchema]);

      dispatch({
        type: types.FILL_FAVORITES,
        payload: {
          favoritesIds: normalizedFavs.result,
          favoritesById: normalizedFavs.entities.favorites,
        } });
    });

    storage.get('selected_favorite', (error, selectedFavorite) => {
      dispatch({
        type: types.SET_SELECTED_FAVORITE,
        payload: typeof selectedFavorite === 'number' ? selectedFavorite : null
      });
    });
  };
}

export function setCurrent(currentId) {
  storage.set('selected_favorite', currentId, error => {
    if (error) throw error;
  });

  return (dispatch) => {
    dispatch({
      type: types.SET_SELECTED_FAVORITE,
      payload: currentId,
    });
  };
}

export function addFavorite(favorite, setAsCurrent = false) {
  storage.get('postglass_favorites', (err, fav) => {
    fav.push(favorite);
    storage.set('postglass_favorites', fav);
  });

  return (dispatch) => {
    dispatch({
      type: types.ADD_FAVORITE,
      payload: {
        ...favorite,
        password: favorite.password ? jwt.encode(favorite.password, key) : null,
        sshPassword: favorite.sshPassword ? jwt.encode(favorite.sshPassword, key) : null
      }
    });
    if (setAsCurrent) {
      dispatch(setCurrent(favorite.id));
    }
  };
}

export function updateFavorite(favorite) {
  storage.set('postglass_favorites', favorite, (error) => {
    if (error) throw error;
  });

  return {
    type: types.UPDATE_FAVORITE,
    payload: {
      ...favorite,
      password: favorite.password ? jwt.encode(favorite.password, key) : null,
      sshPassword: favorite.sshPassword ? jwt.encode(favorite.sshPassword, key) : null
    }
  };
}

export function removeFavorite(favoriteId) {
  return {
    type: types.REMOVE_FAVORITE,
    payload: favoriteId
  };
}

export function toggleFavoriteSwitcher() {
  return {
    type: types.TOGGLE_FAV_SWITCHER
  };
}
