// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Measure from 'react-measure';

import type { Connector } from 'react-redux';
import type { Dispatch } from '../../../types';

import * as tablesActions from '../../../actions/tables';
import { getDataForMeasureCells } from '../../../selectors/tables';

import {
  Cell,
} from './styled';

type Props = {
  setMeasureWidth: (Object) => void,
  forMeasure: Array<{
    name: string,
    value: string,
    isMeasured: boolean,
    width: ?number,
    tableId: string
  }>
};

class MeasureCells extends Component {
  props: Props;

  render() {
    const { forMeasure, setMeasureWidth }: Props = this.props;
    return (
      <div>
        {forMeasure.map((item) =>
          <Measure
            key={item.name}
            onResize={({ entry }) => setMeasureWidth({
              tableId: item.tableId, width: entry.width > 350 ? 350 : entry.width, key: item.name,
            })}
          >
            {({ measureRef }) =>
              <div
                ref={measureRef}
                style={{ left: '-99999px', position: 'absolute' }}
              >
                <Cell>
                  {item.value}
                </Cell>
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
