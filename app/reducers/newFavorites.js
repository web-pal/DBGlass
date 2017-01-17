import { Map, List, fromJS } from 'immutable';
import * as types from '../actions/actionTypes';
import { combineReducers } from 'redux';

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
      return fromJS(action.payload.favoritesById);
    }

    default:
      return state;
  }
};

const meta = (state = new Map({selectedFavorite: null}), action) => {
  switch (action.type) {
    case types.SET_SELECTED_FAVORITE: {
      return state.set('selectedFavorite', action.payload);
    }

    default:
      return state;
  }
};

export const newFavorite = combineReducers({
  favoritesIds,
  favoritesById,
  meta
});
