// @flow
import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import ui from './ui';
import favorites from './favorites';

const rootReducer = combineReducers({
  ui,
  favorites,
  form: formReducer,
});

export default rootReducer;
