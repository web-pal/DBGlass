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

  storage.getAll((e, data) => {console.log('ALL STORAGE: ', data)}); // mock

  return (dispatch) => {
    storage.get('postglass_favorites', (error, favs) => {

      (!Array.isArray(favs))
        ? storage.set('postglass_favorites', []) // mock
        : console.log('array');

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


        console.log('+++++++++++');
        console.log('STORAGE FAVS: ', favs);
        console.log('FOR NORMALIZATION: ', favorites); // mock
        console.log('+++++++++++');

      const normalizedFavs = Object.keys(favorites).length === 0
          ? { entities: {favorites: {}}, result: [] }
          : normalize(favorites, [favoriteSchema]);

      storage.get('selected_favorite', (error2, selectedFavorite) => {

        console.log('+++++++++++');
        console.log('STORAGE SELECTED: ', selectedFavorite); // mock
        console.log('+++++++++++');

        dispatch({
          type: types.SET_SELECTED_FAVORITE,
          payload: selectedFavorite
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
  storage.get('postglass_favorites', (err, fav) => {
    storage.set('postglass_favorites',
      fav.filter(item => item.id !== favoriteId),
      (error) => {
        if (error) throw error;
      });
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
