// @flow
import type {
  IdString,
  Action, Favorite, FavoriteNormalizePayload,
} from '../types';

export const fetchFavoritesRequest = (): Action =>
  ({ type: 'favorites/FETCH_REQUEST' });

export const addFavoriteRequest = (favorite: Favorite): Action =>
  ({
    type: 'favorites/ADD_REQUEST',
    payload: favorite,
  });

export const removeFavoriteRequest = (payload: IdString): Action =>
  ({
    type: 'favorites/REMOVE_REQUEST',
    payload,
  });

export const selectFavoriteRequest = (payload: ?IdString): Action =>
  ({
    type: 'favorites/SELECT_REQUEST',
    payload,
  });


export const fillFavorites = (payload: FavoriteNormalizePayload): Action =>
  ({
    type: 'favorites/FILL',
    payload,
  });


export const selectFavorite = (payload: ?IdString): Action =>
  ({
    type: 'favorites/SELECT',
    payload,
  });

export const removeFavorite = (payload: IdString): Action =>
  ({
    type: 'favorites/REMOVE',
    payload,
  });

