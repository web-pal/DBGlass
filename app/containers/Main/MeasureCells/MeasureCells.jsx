// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Measure from 'react-measure';

import type { Connector } from 'react-redux';
import type { Dispatch, MeasureType } from '../../../types';

import * as tablesActions from '../../../actions/tables';
import { getCurrentTable, getDataForMeasureCells } from '../../../selectors/tables';

type Props = {
  setMeasureWidth: (Object) => void,
  forMeasure: Array<MeasureType>,
  currentTableId: string
};

class MeasureCells extends Component {
  props: Props;

  render() {
    const { forMeasure, currentTableId, setMeasureWidth }: Props = this.props;

    return (
      <div>
        {forMeasure.map((item) =>
          <Measure
            key={item.name}
            onResize={({ entry }) => setMeasureWidth({
              tableId: currentTableId, width: entry.width + 20, key: item.name,
            })}// width: entry.width + 20, because cells are positioned absolutely
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
      </div>
    );
  }
}

function mapStateToProps({ tables }) {
  return {
    forMeasure: getDataForMeasureCells({ tables }),
    currentTableId: getCurrentTable({ tables }),
  };
}

function mapDispatchToProps(dispatch: Dispatch): { [key: string]: Function } {
  return bindActionCreators({ ...tablesActions }, dispatch);
}

const connector: Connector<{}, Props> = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default connector(MeasureCells);
