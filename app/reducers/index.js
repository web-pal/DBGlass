import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form/immutable';

import tables from './tables';
import currentTable from './currentTable';
import favorites from './favorites';

const rootReducer = combineReducers({
  form: formReducer,
  tables,
  currentTable,
  favorites
});

export default rootReducer;
