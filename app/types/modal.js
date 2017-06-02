// @flow
import type { IdString } from './';

export type ModalState = {
  component: ?IdString,
  show: boolean,
  values: ?Object,
  error: ?Object,
  payload: Object
};
