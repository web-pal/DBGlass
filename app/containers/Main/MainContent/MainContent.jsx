// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';
import type { State, FieldsIndexedMap } from '../../../types';

import { getTableFieldsNames, getTableRows } from '../../../selectors/tables';

import {
  ContentWrapper,
  TableHeader,
  ColumnName,
  TableContent,
  Row,
} from './styled';

type Props = {
  fieldsNames: any,
  rows: any
};

class MainContent extends Component {
  props: Props;

  render() {
    const { fieldsNames, rows }: Props = this.props;
    console.log(fieldsNames, rows);
    return (
      <ContentWrapper>
        <TableHeader>
          {
            fieldsNames.length ?
            fieldsNames.map((field, index) =>
              <ColumnName key={index}>
                {field.fieldName}
              </ColumnName>)
              :
              null
          }
        </TableHeader>
        <TableContent>
          {
            rows.length ?
            rows.map((row, index) =>
              <Row key={index}>
                {row[fieldsNames[index].fieldName]}
              </Row>)
              :
              null
          }
        </TableContent>
      </ContentWrapper>
    );
  }
}

function mapStateToProps(state: State) {
  return {
    fieldsNames: getTableFieldsNames({ tables: state.tables }),
    rows: getTableRows({ tables: state.tables }),
  };
}

const connector: Connector<{}, Props> = connect(
  mapStateToProps,
  null,
);

export default connector(MainContent);
