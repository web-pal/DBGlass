import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

import MainSidebar from '../Main/Sidebar/MainSidebar';
import ConnectSidebar from '../Connect/Sidebar/ConnectSidebar';
import ReduxFormBase from '../Connect/Content/ReduxFormBase';
import MainContent from '../Main/Content/MainContent';
import Header from '../Base/Header/Header';
import ContextMenu from '../Base/ContextMenu/ContextMenu';
import UpdatesModal from '../Connect/Content/UpdatesModal/UpdatesModal';
import { startAppMixpanelEvent } from '../../helpers';

const propTypes = {
  isConnected: PropTypes.bool
};

class BaseComponent extends Component {
  componentDidMount() {
    startAppMixpanelEvent();
  }

  render() {
    const { isConnected } = this.props;
    return (
      <div id="wrapper">
        <ContextMenu />
        {isConnected ?
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
                <UpdatesModal />
                <ConnectSidebar />
                <ReduxFormBase />
              </div>
            </div>
        }
      </div>
    );
  }
}


BaseComponent.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    isConnected: state.currentTable.isConnected
  };
}

export default connect(mapStateToProps, null)(BaseComponent);
