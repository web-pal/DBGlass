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
  [string]: Table
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

export type ColumnSchema = {
  character_maximum_length: ?number,
  character_octet_length: ?number,
  character_set_catalog: ?string,
  character_set_name: ?string,
  character_set_schema: ?string,
  collation_catalog: ?string,
  collation_name: ?string,
  collation_schema: ?string,
  column_default: ?string,
  column_name: string,
  data_type: ?string,
  datetime_precision: ?string,
  domain_catalog: ?string,
  domain_name: ?string,
  domain_schema: ?string,
  dtd_identifier: ?string,
  generation_expression: ?string,
  identity_cycle: ?string,
  identity_generation: ?string,
  identity_increment: ?string,
  identity_maximum: ?string,
  identity_minimum: ?string,
  identity_start: ?string,
  interval_precision: ?string,
  interval_type: ?string,
  is_generated: ?string,
  is_identity: ?string,
  is_nullable: ?string,
  is_self_referencing: ?string,
  is_updatable: ?string,
  maximum_cardinality: ?string,
  numeric_precision: ?number,
  numeric_precision_radix: ?number,
  numeric_scale: ?number,
  ordinal_position: ?number,
  scope_catalog: ?string,
  scope_name: ?string,
  scope_schema: ?string,
  table_catalog: ?string,
  table_name: ?string,
  table_schema: ?string,
  udt_catalog: ?string,
  udt_name: ?string,
  udt_schema: ?string
};

export type ColumnsArray = Array<ColumnSchema>;
