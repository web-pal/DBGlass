import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form/immutable';

import ui from './ui';


const rootReducer = combineReducers({
  form: formReducer,
  ui,
});

export default rootReducer;
