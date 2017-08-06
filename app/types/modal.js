// @flow

export type ModalState = {
  dropTableName: ?string,
  dropTableErrorMessage: ?string,
  truncateTableName: ?string,
  truncateTableErrorMessage: ?string,
  errorMessage: ?string,
  showDropTableModal: boolean,
  showTruncateTableModal: boolean,
  showErrorModal: boolean
};

export type ModalAction =
  { type: 'modal/SHOW_DROP_TABLE_MODAL', +payload: { tableName: string } }
| { type: 'modal/HIDE_DROP_TABLE_MODAL' }
| { type: 'modal/SET_DROP_TABLE_MODAL_ERROR', +payload: { errorMessage: string } }
| { type: 'modal/SHOW_TRUNCATE_TABLE_MODAL', +payload: { tableName: string } }
| { type: 'modal/HIDE_TRUNCATE_TABLE_MODAL' }
| { type: 'modal/SET_TRUNCATE_TABLE_MODAL_ERROR', +payload: { errorMessage: string } }
| { type: 'modal/SHOW_ERROR_MODAL', +payload: { errorMessage: string } }
| { type: 'modal/HIDE_ERROR_MODAL' }
;
