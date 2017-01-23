import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as Actions from '../actions/currentTable';
import * as favActions from '../actions/favorites';
import getFavorites from '../selectors';

import Header from '../components/Base/Header/Header';
import UpdatesModal from '../components/Connect/Content/UpdatesModal/UpdatesModal';
import ConnectSidebar from '../components/Connect/Sidebar/ConnectSidebar';
import ReduxFormBase from '../components/Connect/Content/ReduxFormBase';

class ConnectContainer extends Component {
  static propTypes = {
    actions: PropTypes.object,
    favorites: PropTypes.object,
    selectedFavorite: PropTypes.string,
    favSwitcherOpen: PropTypes.bool,
    isConnected: PropTypes.bool
  };

  render() {
    const { favorites, selectedFavorite, favSwitcherOpen, isConnected, actions } = this.props;
    return (
      <div className="flex-col max-height">
        <Header
          favorites={favorites}
          selectedFavorite={selectedFavorite}
          favSwitcherOpen={favSwitcherOpen}
          isConnected={isConnected}
          actions={actions}
        />
        <div className="flex-row max-height">
          <UpdatesModal />
          <ConnectSidebar
            favorites={favorites}
            selectedFavorite={selectedFavorite}
            actions={actions}
          />
          <ReduxFormBase />
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ favorites, currentTable }) => ({
  favorites: getFavorites(favorites),
  selectedFavorite: favorites.meta.get('selectedFavorite'),
  favSwitcherOpen: favorites.meta.get('favSwitcherOpen'),
  isConnected: currentTable.isConnected
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({ ...Actions, ...favActions }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ConnectContainer);

