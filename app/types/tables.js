// @flow
import type { IdString, RowsIds, RowsIndexedMap, FieldsIds, FieldsIndexedMap } from './';

export type TablesNames = Array<IdString>;

export type Table = {
  tableName: string,
  rowsIds: [] | RowsIds,
  rows: {} | RowsIndexedMap,
  fieldsIds: [] | FieldsIds,
  fields: {} | FieldsIndexedMap,
  isFetched: ?boolean,
  structureTable: ?{},
  dataForMeasure: {} | DataForMeasure,
  rowsCount: ?number
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
  currentTableName: ?string
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
