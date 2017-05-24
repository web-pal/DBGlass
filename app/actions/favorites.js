// @flow
import type {
  IdString,
  Action, Favorite, FavoriteNormalizePayload,
  FavoriteTablesQuantity,
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

export const addFavoriteTablesQuantity = (payload: FavoriteTablesQuantity): Action =>
  ({
    type: 'favorites/ADD_FAVORITE_TABLES_QUANTITY',
    payload,
  });

export const submitConnectionForm = (payload: Favorite): Action =>// test
  ({
    type: 'favorites/SUBMIT_CONNECTION_FORM',
    payload,
  });

export const connectToDB = (payload: any): Action =>// test
  ({
    type: 'favorites/CONNECT_TO_DB',
    payload,
  });
