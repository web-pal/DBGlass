import { Map, List, fromJS } from 'immutable';
import { combineReducers } from 'redux';
import * as types from '../actions/actionTypes';


const favoritesIds = (state = new List(), action) => {
  switch (action.type) {
    case types.FILL_FAVORITES: {
      return fromJS(action.payload.favoritesIds);
    }

    case types.ADD_FAVORITE: {
      return state.push(action.payload.id);
    }

    case types.REMOVE_FAVORITE: {
      return state.filter(item => item !== action.payload);
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

    case types.ADD_FAVORITE: {
      return state.set(action.payload.id, fromJS(action.payload));
    }

    case types.UPDATE_FAVORITE: {
      return state.update(
        action.payload.id,
        action.payload
      );
    }

    case types.REMOVE_FAVORITE: {
      return state.delete(action.payload);
    }

    default:
      return state;
  }
};

const meta = (state = new Map({ selectedFavorite: null, favSwitcherOpen: false }), action) => {
  switch (action.type) {
    case types.SET_SELECTED_FAVORITE: {
      return state.set('selectedFavorite', action.payload);
    }

    case types.TOGGLE_FAV_SWITCHER: {
      return state.set('favSwitcherOpen', !state.get('favSwitcherOpen'));
    }

    default:
      return state;
  }
};

export default combineReducers({
  favoritesIds,
  favoritesById,
  meta
});
