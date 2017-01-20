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
      if (!Array.isArray(favs)) {
        storage.set('postglass_favorites', []);
      }
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
          return {
            ...favorite,
            id: favorite.id.toString(),
            password: decodedPassword,
            sshPassword: decodedSSHPassword
          };
        }) : [];

      const normalizedFavs = Object.keys(favorites).length === 0
          ? { entities: { favorites: {} }, result: [] }
          : normalize(favorites, [favoriteSchema]);
      storage.get('selected_favorite', (error2, selectedFavorite) => {
        dispatch({
          type: types.SET_SELECTED_FAVORITE,
          payload: typeof selectedFavorite === 'string' ? selectedFavorite : ''
        });

        dispatch({
          type: types.FILL_FAVORITES,
          payload: {
            favoritesIds: normalizedFavs.result,
            favoritesById: normalizedFavs.entities.favorites,
          } });
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
  storage.get('postglass_favorites', (err, favorites) => {
    favorites.push({
      ...favorite,
      password: favorite.password ? jwt.encode(favorite.password, key) : null,
      sshPassword: favorite.sshPassword ? jwt.encode(favorite.sshPassword, key) : null
    });
    storage.set('postglass_favorites', favorites);
  });
  return (dispatch) => {
    dispatch({
      type: types.ADD_FAVORITE,
      payload: favorite
    });
    if (setAsCurrent) {
      dispatch(setCurrent(favorite.id));
    }
  };
}

export function updateFavorite(favorite) {
  storage.get('postglass_favorites', (err, favorites) => {
    const favIndex = favorites.findIndex(item => item.id === favorite.id);
    favorites[favIndex] = { // eslint-disable-line
      ...favorite,
      password: favorite.password ? jwt.encode(favorite.password, key) : null,
      sshPassword: favorite.sshPassword ? jwt.encode(favorite.sshPassword, key) : null
    };
    storage.set('postglass_favorites', favorites);
  });

  return {
    type: types.UPDATE_FAVORITE,
    payload: favorite
  };
}

export function removeFavorite(favoriteId) {
  storage.get('postglass_favorites', (err, fav) => {
    storage.set(
      'postglass_favorites',
      fav.filter(item => item.id !== favoriteId)
    );
  });
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
