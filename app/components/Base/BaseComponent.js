import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import MainSidebar from '../Main/Sidebar/MainSidebar';
import ConnectSidebar from '../Connect/Sidebar/ConnectSidebar';
import ReduxFormBase from '../Connect/Content/ReduxFormBase';
import MainContent from '../Main/Content/MainContent';
import Header from '../Base/Header/Header';
import ContextMenu from '../Base/ContextMenu/ContextMenu';

const propTypes = {
  isConnected: PropTypes.bool
};

const BaseComponent = props =>
  <div id="wrapper" className="">
    <ContextMenu />
    {props.isConnected ?
      <div className="flex-row max-height">
        <div className="flex-col left-pane">
          <Header />
          <MainSidebar />
        </div>
        <MainContent />
      </div> :
      <div className="flex-col max-height">
        <Header />
        <div className="flex-row max-height">
          <ConnectSidebar />
          <ReduxFormBase />
        </div>
      </div>
    }
  </div>;

BaseComponent.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    isConnected: state.currentTable.isConnected
  };
}

export default connect(mapStateToProps, null)(BaseComponent);
