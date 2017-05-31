// @flow
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Measure from 'react-measure';
import type { Dispatch } from '../../../types';

import * as uiActions from '../../../actions/ui';
import { getDataForMeasure } from '../../../selectors/ui';

const MeasureCells = ({ forMeasure, setMeasureWidth }:
{ forMeasure: Array<Object>, setMeasureWidth: Function }) =>
  <div>
    {forMeasure.map((item) =>
      <Measure
        key={item.name}
        onResize={({ entry }) => setMeasureWidth({ width: entry.width, key: item.name })}
      >
        {({ measureRef }) =>
          <div
            ref={measureRef}
            style={{ left: '-99999px', position: 'absolute' }}
          >
            {item.value}
          </div>
        }
      </Measure>,
    )}
  </div>;

function mapStateToProps({ ui }) {
  return {
    forMeasure: getDataForMeasure({ ui }),
  };
}

function mapDispatchToProps(dispatch: Dispatch): { [key: string]: Function } {
  return bindActionCreators({ ...uiActions }, dispatch);
}

const connector: Connector<{}, Props> = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default connector(MeasureCells);
