import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form/immutable';

import tables from './tables';
import currentTable from './currentTable';
import favorites from './favorites';
import newFavorite from './newFavorites';

const rootReducer = combineReducers({
  form: formReducer,
  tables,
  currentTable,
  favorites,
  newFavorite
});

export default rootReducer;
