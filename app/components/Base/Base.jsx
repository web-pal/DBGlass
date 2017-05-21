// @flow
import React from 'react';
import { Provider } from 'react-redux';

import App from '../../containers/App';

type Props = {
  store: {}
};

const Base = ({ store }: Props) =>
  <Provider store={store}>
    <App />
  </Provider>;

export default Base;
