// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Measure from 'react-measure';

import type { Connector } from 'react-redux';
import type { Dispatch, MeasureType } from '../../../types';

import * as tablesActions from '../../../actions/tables';
import { getCurrentTable, getDataForMeasureCells, getCurrentSelectedTable } from '../../../selectors/tables';

type Props = {
  setMeasureWidth: (Object) => void,
  forMeasure: Array<MeasureType>,
  currentTableId: string,
  currentTableIsFetched: boolean
};

class MeasureCells extends Component {
  props: Props;

  setMeasureWidth = (tableId, width, key) => {
    if (!this.props.currentTableIsFetched) {
      this.props.setMeasureWidth({ tableId, width, key });
    }
  }

  render() {
    const { forMeasure, currentTableId }: Props = this.props;

    return (
      <div>
        {forMeasure.map((item) =>
          <Measure
            key={item.name}
            onResize={({ entry }) => this.setMeasureWidth(
              currentTableId, entry.width, item.name,
            )}
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
    currentTableIsFetched: getCurrentSelectedTable({ tables }),
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
