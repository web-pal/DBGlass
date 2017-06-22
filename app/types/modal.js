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
