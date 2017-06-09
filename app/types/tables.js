// @flow
import type { IdString, RowsIds, RowsIndexedMap, FieldsIds, FieldsIndexedMap } from './';

export type TablesIds = Array<IdString>;

export type Table = {
  id: ?IdString,
  tableName: string,
  rowsIds: [] | RowsIds,
  rows: {} | RowsIndexedMap,
  fieldsIds: [] | FieldsIds,
  fields: {} | FieldsIndexedMap,
  isFetched: ?boolean,
  structureTable: ?{},
  dataForMeasure: {} | DataForMeasure
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
  currentTableId: ?string,
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
