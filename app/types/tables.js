// @flow
import type { IdString, RowsIds, RowsIndexedMap, FieldsIds, FieldsIndexedMap } from './';

export type TablesIds = Array<IdString>;

export type Table = {
  id: ?IdString,
  tableName: string,
  // if save data about fields and rows
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

export type TablesMetaState = {
  tableNameSearchKey: ?string,
  currentTableId: ?string
};
