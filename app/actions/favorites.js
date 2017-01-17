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


export function getFavorites() {
  return (dispatch) => {
    storage.get('postglass_favorites', (error, favorites) => {
      if (error) throw error;
      storage.get('selected_favorite', (error2, selectedFavorite) => {
        if (error2) throw error2;


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


        console.log('Initial favorites: ', favorites);
        const normalizedFavs = normalize(favorites, [favorite]);
        console.log('NORMALIZED FAVS: ', normalizedFavs);

        dispatch(
          {
            type: types.FILL_FAVORITES,
            favorites: Object.keys(favorites).length === 0 ? [] : favorites,
            selectedFavorite: typeof selectedFavorite === 'number' ? selectedFavorite : null,

            // new structure
            payload: {
              favoritesIds: normalizedFavs.result,
              favoritesById: normalizedFavs.entities.favorites,
              selectedFavorite: typeof selectedFavorite === 'number' ? selectedFavorite : null,
            }
          }
        );
      });
    });
  };
}

export function addFavorite(favorite, currentId = false, callback) {
  return (dispatch) => {
    if (currentId) {
      dispatch(setCurrent(currentId));
    }
    dispatch({
      type: types.ADD_FAVORITE,
      favorite,
      currentId,
      callback
    });
  };
}

export function updateFavorite(favorite) {
  return {
    type: types.EDIT_FAVORITE,
    favorite
  };
}

export function removeFavorite(favoriteId) {
  return {
    type: types.REMOVE_FAVORITE,
    favoriteId
  };
}

export function setCurrent(currentId) {
  return {
    type: types.SET_CURRENT_FAVORITE,
    payload: currentId,
    currentId };
}


export function toggleFavoriteSwitcher() {
  return {
    type: types.TOGGLE_FAV_SWITCHER
  };
}
