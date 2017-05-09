// @flow
import React from 'react';
import { Provider } from 'react-redux';

import App from '../../containers/App';

type BaseType = {
  store: {}
};

const Base = ({ store }: BaseType) =>
  <Provider store={store}>
    <App />
  </Provider>;

export default Base;
