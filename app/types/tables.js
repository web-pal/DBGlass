// @flow
import type { IdString, RowsIds, RowsIndexedMap, FieldsIds, FieldsIndexedMap } from './';

export type TablesIds = Array<IdString>;

export type Table = {
  id: ?IdString,
  tableName: string,
  rowsIds: ?RowsIds,
  rows: ?RowsIndexedMap,
  fieldsIds: ?FieldsIds,
  fieldsNames: ?FieldsIndexedMap,
  isFetched: ?boolean
};
export type Tables = Array<Table>;

export type TablesIndexedMap = {
  [number]: Table
};

export type TableNormalizePayload = {
  ids: TablesIds,
  map: TablesIndexedMap
};
