import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as actions from '../actions/favorites';
import getFavorites from '../selectors';

import Header from '../components/Base/Header/Header';
import UpdatesModal from '../components/Connect/Content/UpdatesModal/UpdatesModal';
import ConnectSidebar from '../components/Connect/Sidebar/ConnectSidebar';
import ReduxFormBase from '../components/Connect/Content/ReduxFormBase';

class ConnectContainer extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    favorites: PropTypes.object.isRequired,
    selectedFavorite: PropTypes.string.isRequired
  };

  render() {
    return (
      <div className="flex-col max-height">
        <Header />
        <div className="flex-row max-height">
          <UpdatesModal />
          <ConnectSidebar
            favorites={this.props.favorites}
            selectedFavorite={this.props.selectedFavorite}
            actions={this.props.actions}
          />
          <ReduxFormBase />
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ favorites }) => ({
  favorites: getFavorites(favorites),
  selectedFavorite: favorites.meta.get('selectedFavorite')
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ConnectContainer);

