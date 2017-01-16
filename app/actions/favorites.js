import * as types from './actionTypes';
import storage from 'electron-json-storage';
import { schema, normalize } from 'normalizr';

storage.getAll((error, fav) => {
  console.log('Storage: ', fav);
});

// console.log('++++++++++BUILDING SCHEMA++++++++++');
//
import { createSelector } from 'reselect';
import { fromJS } from 'immutable';
//
// let favorite = new schema.Entity('favorites');
// let selectedFavorite = new schema.Entity('selectedFavorite');
//
// let favorites = null;
// storage.get('postglass_favorites', (e, fav) => {
//   storage.get('selected_favorite', (e2, selectedFav) => {
//     let r = normalize(fav, [favorite]);
//     let final = {
//       allIds: fromJS(r.result),
//       byId: fromJS(r.entities.favorites),
//       meta: selectedFav
//     };
//     console.log('Normalized Final: ', final);
//
//     const favID = (ids) => ids.allIds;
//     const favMAP = (map) => map.byId;
//     console.log(favID(final).toJS());
//     console.log(favMAP(final).toJS());
//
//     const getFavs = createSelector(
//       [favID, favMAP],
//       (ids, byId) => (ids.map(t => byId.get(t.toString())))
//     );
//
//     let selected = getFavs(final);
//     console.log('Reselected: ', selected.toJS());
//   });
// });
//
// console.log('++++++++++BUILDING SCHEMA++++++++++');

export function getFavorites() {
  return (dispatch) => {
    storage.get('postglass_favorites', (error, favorites) => {
      if (error) throw error;
      storage.get('selected_favorite', (error2, selectedFavorite) => {
        if (error2) throw error2;

        const normalizedFavs = normalize(favorites, [favorite]);

        dispatch(
          {
            type: types.FILL_FAVORITES,
            favorites: Object.keys(favorites).length === 0 ? [] : favorites,
            selectedFavorite: typeof selectedFavorite === 'number' ? selectedFavorite : null,

            // new structure
            favoritesIds: normalizedFavs.result,
            favoritesById: normalizedFavs.entities.favorites,
            meta: selectedFavorite
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
  return { type: types.SET_CURRENT_FAVORITE, currentId };
}


export function toggleFavoriteSwitcher() {
  return {
    type: types.TOGGLE_FAV_SWITCHER
  };
}
