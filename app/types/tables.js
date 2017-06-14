// @flow
import type { IdString, RowsIds, RowsIndexedMap, FieldsIds, FieldsIndexedMap } from './';

export type TablesNames = Array<IdString>;
export type ForeignKey = {
  column_name: string,
  constraint_name: string,
  constraint_type: string,
  initially_deferred: string,
  is_deferrable: string,
  match_type: string,
  on_delete: string,
  on_update: string,
  references_field: string,
  references_table: string,
  table_name: string
};
export type RowsCount = Array<{ tableName: string, count: number }>;

export type Table = {
  tableName: string,
  rowsIds: [] | RowsIds,
  rows: {} | RowsIndexedMap,
  fieldsIds: [] | FieldsIds,
  fields: {} | FieldsIndexedMap,
  isFetched: boolean,
  structureTable: ?{},
  dataForMeasure: {} | DataForMeasure,
  rowsCount: ?number,
  foreignKeys: Array<ForeignKey>
};

export type Tables = Array<Table>;

export type TablesIndexedMap = {
  [string]: {} | Table
};

export type TableNormalizePayload = {
  tablesNames: TablesNames,
  map: TablesIndexedMap
};

export type TablesMetaState = {
  tableNameSearchKey: ?string,
  currentTableName: ?string,
  isContent: boolean
};

export type MeasureType = {
  name: string,
  value: string,
  isMeasured: boolean,
  width: ?number
};

export type DataForMeasure = {
  [number | string]: MeasureType
};
