import React, { PropTypes } from 'react';

import { connect } from 'react-redux';

import LeftFooterBlock from './Blocks/Left/LeftFooterBlock';
import CenterFooterBlock from './Blocks/Center/CenterFooterBlock';
import RightFooterBlock from './Blocks/Right/RightFooterBlock';
import ConfirmationModal from '../Modals/ConfirmationModal/ConfirmationModal';


const propTypes = {
  tableName: PropTypes.string
};


const Footer = ({ tableName }) =>
  <div>
    { tableName ?
      <div className="footer flex-row flex--s-between flex--vertical-center">
        <LeftFooterBlock />
        <CenterFooterBlock />
        <RightFooterBlock />
        <ConfirmationModal />
      </div> :
        <div className="empty-footer flex-row">
          <CenterFooterBlock />
        </div>
    }
  </div>;


Footer.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    tableName: state.currentTable.tableName
  };
}

export default connect(mapStateToProps, null)(Footer);
