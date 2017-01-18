import * as types from './actionTypes';
import { schema, normalize } from 'normalizr';
import path from 'path';
import electron from 'electron';
import { readFileSync, writeFileSync } from 'fs';
import storage from 'electron-json-storage';
import jwt from 'jwt-simple';

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

const favorite = new schema.Entity('favorites');

export function getFavorites() { // Done

  return (dispatch, getState) => {

    storage.get('postglass_favorites', (error, favorites) => {
      if (error) throw error;

      if (!Array.isArray(favorites)) {
        storage.set('postglass_favorites', [], (error) => {
          if (error) throw error;
        })}

        for (const favorite of favorites) {
          let decodedPassword;
          let decodedSSHPassword;
          if (favorite.password) {
            try {
              decodedPassword = jwt.decode(favorite.password, key);
            } catch (error) {
              decodedPassword = favorite.password;
            }
            favorite.password = decodedPassword;
          }
          if (favorite.sshPassword) {
            try {
              decodedSSHPassword = jwt.decode(favorite.sshPassword, key);
            } catch (error) {
              decodedSSHPassword = favorite.sshPassword;
            }
            favorite.sshPassword = decodedSSHPassword;
          }
        }

        const normalizedFavs = Object.keys(favorites).length === 0
          ? {entities: {}, result: []}
          :  normalize(favorites, [favorite]);

        dispatch(
          {
            type: types.FILL_FAVORITES,
            payload: {
              favoritesIds: normalizedFavs.result,
              favoritesById: normalizedFavs.entities.favorites,
            }
          }
        );
    });

    storage.get('selected_favorite', (error, selectedFavorite) => {
      dispatch({
        type: types.SET_SELECTED_FAVORITE,
        payload: typeof selectedFavorite === 'number' ? selectedFavorite : null
      })
    });
  };
}

export function setCurrent(currentId) { // Done

    storage.set('selected_favorite', currentId, error => {
      if (error) throw error;
    });

    return (dispatch, getState) => {

      console.log('STATE: ', getState().newFavorite.favoritesById.toJS());
      storage.getAll((e, fav) => {
        console.log('ELECTRON STATE: ', fav);
      });

      dispatch({
          type: types.SET_SELECTED_FAVORITE,
          payload: currentId,
      })
  };
}

export function addFavorite(favorite, currentId = false, callback) { // done

  (favorite.password) ? jwt.encode(favorite.password, key) : null;
  (favorite.sshPassword) ? jwt.encode(favorite.sshPassword, key) : null;

  return (dispatch) => {

    dispatch({
      type: types.ADD_FAVORITE,
      payload: {
        favoriteId: favorite.id,
        favoriteById: favorite,
        callback
      }
    });

  storage.get('postglass_favorites', (err, fav) => {

    fav.push(favorite);
    storage.set('postglass_favorites', fav, (error) => {
      if (error) throw error;
    if (callback) callback();
    });

    if (currentId) {
      dispatch(setCurrent(currentId));
    }
  })
  }
}

export function updateFavorite(favorite) { // done

  (favorite.passowrd) ? jwt.encode(favorite.password, key) : null;
  (favorite.sshPassword) ? jwt.encode(favorite.sshPassword, key) : null;

  storage.set('postglass_favorites', favorite, (error) => {
    if (error) throw error;
    if (callback) callback();
  });

  return {
    type: types.UPDATE_FAVORITE,
    payload: {
      favoriteId: favorite.id,
      favoriteById: favorite
    }
  };
}

export function removeFavorite(favoriteId) {
  return {
    type: types.REMOVE_FAVORITE,
    payload: {
      favoriteId
    }
  };
}

export function toggleFavoriteSwitcher() {
  return {
    type: types.TOGGLE_FAV_SWITCHER
  };
}
