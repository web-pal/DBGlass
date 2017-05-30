// @flow
import type { Action, Favorite } from '../types';

export const startSubmitRequest = (data: Favorite): Action =>
  ({ type: 'connect/CONNECT_REQUEST', payload: { data } });

