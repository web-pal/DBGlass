// @flow
import React from 'react';

import FavoritesSwitcher from './FavoritesSwitcher/FavoritesSwitcher';
import MainContent from './MainContent/MainContent';
import MeasureCells from './MeasureCells/MeasureCells';
import DropTableModal from './Modals/DropTableModal';
import TruncateTableModal from './Modals/TruncateTableModal';
import ErrorDisplayModal from './Modals/ErrorDisplayModal';
import Sidebar from './Sidebar/Sidebar';

import { MainContainer } from './styled';

const Main = () => (
  <MainContainer>
    <Sidebar />
    <FavoritesSwitcher />
    <MeasureCells />
    <DropTableModal />
    <TruncateTableModal />
    <ErrorDisplayModal />
    <MainContent />
  </MainContainer>
);

export default Main;
