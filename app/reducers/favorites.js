import { Record, fromJS, List } from 'immutable';
import * as types from '../constants/favoriteConstants';


const path = require('path');
const electron = require('electron');
const fs = require('fs');
const storage = require('electron-json-storage');
const jwt = require('jwt-simple');

const readFileSync = fs.readFileSync;
const writeFileSync = fs.writeFileSync;
const app = electron.app || electron.remote.app;
const userData = app.getPath('userData');

let key = '';
const storageKeyPath = path.join(userData, 'storageKey');

try {
  key = readFileSync(storageKeyPath);
} catch (e) {
  key = Math.random().toString(36).slice(-8);
  writeFileSync(storageKeyPath, key);
}

/* eslint-disable new-cap */
const InitialState = Record({
  selectedFavorite: null,
  favSwitcherOpen: false,
  favorites: List()
});
/* eslint-enable new-cap */
const initialState = new InitialState();


export default function favorites(state = initialState, action) {
  switch (action.type) {
    case types.GET_FAVORITES: {
      const newFavorites = [...action.favorites];
      for (const favorite of newFavorites) {
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
      const newState = state.set('selectedFavorite', action.selectedFavorite);
      return newState.set(
        'favorites',
        fromJS(newFavorites)
      );
    }

    case types.SET_CURRENT_FAVORITE: {
      saveSelectedFavorite(action.currentId);
      return state.set(
        'selectedFavorite',
        action.currentId
      );
    }

    case types.ADD_FAVORITE: {
      const newFavorites = state.favorites.toArray().slice();
      newFavorites.push(Object.assign({}, action.favorite));
      saveFavorites(newFavorites, action.callback);
      return state.update(
        'favorites',
        favoritesList => favoritesList.push(fromJS(action.favorite))
      );
    }

    case types.UPDATE_FAVORITE: {
      const newState = state.update(
        'favorites',
        favoritesList => favoritesList.map((favorite) => {
          if (favorite.get('id') === action.favorite.id) {
            return fromJS(action.favorite);
          }
          return favorite;
        })
      );
      saveFavorites(newState.favorites.toJS());
      return newState;
    }

    case types.REMOVE_FAVORITE : {
      const indexToDelete = state.favorites.findIndex(x => x.get('id') === action.favoriteId);
      if (indexToDelete > -1) {
        const newState = state.update(
          'favorites',
          favoritesList => favoritesList.remove(indexToDelete)
        );
        saveFavorites(newState.favorites.toJS());
        return newState;
      }
      return state;
    }

    case types.TOGGLE_FAV_SWITCHER:
      return state.set(
        'favSwitcherOpen',
        !state.get('favSwitcherOpen')
      );

    default:
      return state;
  }
}

function saveSelectedFavorite(selectedFavorite) {
  storage.set('selected_favorite', selectedFavorite, err => {
    if (err) throw err;
  });
}

function saveFavorites(nextfavorites, callback) {
  for (const favorit of nextfavorites) {
    if (favorit.password) {
      favorit.password = jwt.encode(favorit.password, key);
    }
    if (favorit.sshPassword) {
      favorit.sshPassword = jwt.encode(favorit.sshPassword, key);
    }
  }
  storage.set('postglass_favorites', nextfavorites, error => {
    if (error) throw error;
    if (callback) callback();
  });
}
