// @flow
import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import ui from './ui';
import favorites from './favorites';
import tables from './tables';
import contextMenu from './contextMenu';

const rootReducer = combineReducers({
  ui,
  favorites,
  tables,
  form: formReducer,
  contextMenu,
});

export default rootReducer;
