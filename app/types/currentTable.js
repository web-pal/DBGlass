// @flow

import type { IdString } from './';

export type RowsIds = Array<IdString>;
export type FieldsIds = Array<IdString>;

export type RowsIndexedMap = {
  [number]: Object
};
export type FieldsIndexedMap = {
  [number]: Object
};

export type TableDataNormalizedPayload = {
  id: IdString,
  rowsIds: RowsIds,
  rows: RowsIndexedMap,
  fieldsIds: FieldsIds,
  fields: FieldsIndexedMap
};

export type TableMetaState = {
  currentTableId: ?string
};
