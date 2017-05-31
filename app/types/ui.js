// @flow

export type dataForMeasure = {
  [number | string]: {
    name: string,
    value: string,
    isMeasured: boolean,
    width: ?number
  }
};

export type uiState = {
  isConnected: boolean,
  isMenuOpen: boolean,
  isLoading: boolean,
  connectionError: string,
  isTablesFetched: boolean,
  dataForMeasure: dataForMeasure | {}
};
