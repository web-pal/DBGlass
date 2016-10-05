import React from 'react';

import Structure from './Structure/Structure';
import Content from './Content/Content';
import Confirmation from './Confirmation/Confirmation';
import Footer from './Footer/Footer';
import LoadingOverlay from '../../Base/LoadingOverlay/LoadingOverlay';
import EditorModal from './Modals/EditorModal/EditorModal';

const MainContent = () =>
  <div className="full-width max-height flex-col" id="pace-container">
    <LoadingOverlay />
    <EditorModal />
    <div id="table-wrapper" className="flex-col max-height">
      <Content />
      <Structure />
    </div>
    <div className="flex-item--end full-width">
      <Confirmation />
      <Footer />
    </div>
  </div>;

export default MainContent;
