import React from 'react';

import LeftFooterBlock from './Blocks/Left/LeftFooterBlock';
import CenterFooterBlock from './Blocks/Center/CenterFooterBlock';
import RightFooterBlock from './Blocks/Right/RightFooterBlock';
import ConfirmationModal from '../Modals/ConfirmationModal/ConfirmationModal';


const Footer = () =>
  <div className="footer flex-row flex--s-between flex--vertical-center">
    <LeftFooterBlock />
    <CenterFooterBlock />
    <RightFooterBlock />
    <ConfirmationModal />
  </div>;

export default Footer;
