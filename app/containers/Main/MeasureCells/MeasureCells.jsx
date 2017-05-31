import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Measure from 'react-measure';

import * as uiActions from '../../../actions/ui';
import { getDataForMeasure } from '../../../selectors/ui';

const MeasureCells = ({ forMeasure, setMeasureWidth }) =>
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

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...uiActions }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MeasureCells);
