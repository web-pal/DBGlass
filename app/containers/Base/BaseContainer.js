import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { lifecycle } from 'recompose';

import ConnectContainer from '../../containers/ConnectContainer';

import MainSidebar from '../../components/Main/Sidebar/MainSidebar';
import MainContent from '../../components/Main/Content/MainContent';
import Header from '../../components/Base/Header/Header';
import ContextMenu from '../../components/Base/ContextMenu/ContextMenu';
import { startAppMixpanelEvent } from '../../helpers';

import * as Actions from '../../actions/currentTable';
import * as favActions from '../../actions/favorites';
import getFavorites from '../../selectors';

const enhance = lifecycle({
  componentDidMount() {
    startAppMixpanelEvent();
  }
});

const BaseContainer = enhance(({
  favorites,
  selectedFavorite,
  favSwitcherOpen,
  isConnected,
  actions }) => (
    <div id="wrapper">
      <ContextMenu />

      {isConnected
        ? <div className="flex-row max-height">
          <div className="flex-col left-pane">
            <Header
              favorites={favorites}
              selectedFavorite={selectedFavorite}
              favSwitcherOpen={favSwitcherOpen}
              isConnected={isConnected}
              actions={actions}
            />
            <MainSidebar />
          </div>
          <MainContent />
        </div>
        : <ConnectContainer />
      }
    </div>
));

const mapStateToProps = ({ favorites, currentTable }) => ({
  favorites: getFavorites(favorites),
  selectedFavorite: favorites.meta.get('selectedFavorite'),
  favSwitcherOpen: favorites.meta.get('favSwitcherOpen'),
  isConnected: currentTable.isConnected
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({ ...Actions, ...favActions }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(BaseContainer);
