// @flow
import React from 'react';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';

import type { State } from '../../types';

import FavoritesSwitcher from './FavoritesSwitcher/FavoritesSwitcher';
import MainContent from './MainContent/MainContent';
import ModalContainer from '../../components/shared/Modal/ModalContainer';
import MeasureCells from './MeasureCells/MeasureCells';
import Sidebar from './Sidebar/Sidebar';

import { MainContainer } from './styled';

type Props = {
  currentTable: ?string
};

const Main = ({ currentTable }: Props) =>
  <MainContainer>
    <Sidebar />
    <FavoritesSwitcher />
    <MeasureCells />
    <ModalContainer />
    { currentTable && <MainContent /> }
  </MainContainer>;

function mapStateToProps(state: State) {
  return {
    currentTable: state.tables.meta.currentTableName,
  };
}

const connector: Connector<{}, Props> = connect(
  mapStateToProps,
  null,
);

export default connector(Main);
