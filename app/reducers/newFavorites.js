import { Map, List, fromJS } from 'immutable';
import * as types from '../actions/actionTypes';
import { combineReducers } from 'redux';

import path from 'path';
import electron from 'electron';
import { readFileSync, writeFileSync } from 'fs';
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

const favoritesIds = (state = new List(), action) => {
  switch (action.type) {
    case types.FILL_FAVORITES: {
      return fromJS(action.payload.favoritesIds);
    }

    default:
      return state;
  }
};

const favoritesById = (state = new Map(), action) => {
  switch (action.type) {
    case types.FILL_FAVORITES: {
      const favoritesForDecoding = fromJS(action.payload.favoritesById);

      console.log('Not decoded: ', favoritesForDecoding);
      console.log(favoritesForDecoding.map( (item, i) => {
        console.log(i, item.get('password'));
          console.log(i, item.get('sshPassword'));
      }
      ));

      let decoded = favoritesForDecoding.map( favorite => {
        let decodedPassword;
        let decodedSSHPassword;

        if (favorite.get('password')) {
          try {
            decodedPassword = jwt.decode(favorite.get('password', key));
          } catch (error) {
            decodedPassword = favorite.get('password');
          }
          favorite.set('password', decodedPassword);
        }
        if (favorite.get('sshPassword')) {
          try {
            decodedSSHPassword = jwt.decode(favorite.get('sshPassword'), key);
          } catch (error) {
          decodedSSHPassword = favorite.get('sshPassword');
          }
          favorite.set('sshPassword', decodedSSHPassword);
        }
      });

      // console.log('decoded: ', decoded);
      // console.log(decoded.map( (item, i) => {
      //     console.log(i, item.get('password'));
      //     console.log(i, item.get('sshPassword'));
      //   }
      // ));

      return decoded;
    }

    default:
      return state;
  }
};

const meta = (state = new Map({selectedFavorite: null}), action) => {
  switch (action.type) {
    case types.FILL_FAVORITES: {
      return state.set('selectedFavorite', action.payload.selectedFavorite);
    }

    default:
      return state;
  }
};

// const setCurrentFavorite = (state = null, action) => {
//   switch (action.type) {
//     case types.SET_CURRENT_FAVORITE: {
//       // saveSelectedFavorite(action.payload.currentId);
//       return state = action.payload.currentId;
//     }
//
//     default:
//       return state;
//   }
// };

export const newFavorite = combineReducers({
  favoritesIds,
  favoritesById,
  meta,
  // setCurrentFavorite
});
