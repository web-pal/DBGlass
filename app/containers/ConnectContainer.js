import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { reduxForm, formValueSelector} from 'redux-form/immutable';

import * as Actions from '../actions/currentTable';
import * as favActions from '../actions/favorites';
import getFavorites from '../selectors';

import validate from './../components/Connect/Content/validateForm';

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
          <ReduxFormBase {...this.props} />
        </div>
      </div>
    );
  }
}

const selector = formValueSelector('connect');
const ReduxFormMainDecorated = reduxForm({
  form: 'connect',
  validate,
  enableReinitialize: true
})(ConnectContainer);

const mapStateToProps = (state) => {
  const data = getFavorites(state.favorites);
  const initData = data.size > 0 && state.favorites.meta.get('selectedFavorite')
    ? data.find(
      item => item.get('id') === state.favorites.meta.get('selectedFavorite')
    )
    : fromJS(
      { port: 5432,
        address: 'localhost',
        sshPort: 22,
        sshAuthType: 'password',
        useSSL: true }
    );
  return {
    favorites: getFavorites(state.favorites),
    selectedFavorite: state.favorites.meta.get('selectedFavorite'),
    favSwitcherOpen: state.favorites.meta.get('favSwitcherOpen'),
    isConnected: state.currentTable.isConnected,
    useSSH: selector(state, 'useSSH'),
    sshKey: selector(state, 'privateKey'),
    sshAuthType: selector(state, 'sshAuthType'),
    initialValues: initData,
    formValues: state.form.get('connect') && state.form.get('connect').get('values') ?
      state.form.get('connect').get('values').toObject() : {}
  };
};

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({ ...Actions, ...favActions }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ReduxFormMainDecorated);

