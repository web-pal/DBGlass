import * as types from '../constants/favoriteConstants';

const storage = require('electron-json-storage');

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
    type: types.UPDATE_FAVORITE,
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

export function getFavorites() {
  return (dispatch) => {
    storage.get('postglass_favorites', (error, favorites) => {
      if (error) throw error;
      storage.get('selected_favorite', (error2, selectedFavorite) => {
        if (error2) throw error2;
        dispatch(
          {
            type: types.GET_FAVORITES,
            favorites: Object.keys(favorites).length === 0 ? [] : favorites,
            selectedFavorite: typeof selectedFavorite === 'number' ? selectedFavorite : null
          }
        );
      });
    });
  };
}

export function toggleFavoriteSwitcher() {
  return {
    type: types.TOGGLE_FAV_SWITCHER
  };
}
