// @flow

export type MeasureType = {
  name: string,
  value: string,
  isMeasured: boolean,
  width: ?number
};

export type dataForMeasure = {
  [number | string]: MeasureType
};

export type uiState = {
  isConnected: boolean,
  isMenuOpen: boolean,
  isLoading: boolean,
  connectionError: string,
  isTablesFetched: boolean,
  dataForMeasure: dataForMeasure | {}
};
