import * as types from '../constants/ui';

const InitialState = Immutable.Record({
  isConnected: false,
});

const initialState = new InitialState();

export default function ui(state = initialState, action) {
  switch (action.type) {
    case types.SET_CONNECTED_STATE:
      return state.set('isConnected', action.payload);
    default:
      return state;
  }
}
