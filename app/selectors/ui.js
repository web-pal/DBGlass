import { createSelector } from 'reselect';

export const getDataForMeasure = createSelector(
  ({ ui }) => ui.dataForMeasure,
  (data) => {
    const measureArr = [];
    for (const key of Object.keys(data)) { // eslint-disable-line
      if (!data[key].isMeasured) {
        measureArr.push(data[key]);
      }
    }
    return measureArr;
  },
);
