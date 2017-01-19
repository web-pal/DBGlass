import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import getFavorites from '../../../selectors';
import * as FavoritesActions from '../../../actions/favorites';

import ConnectSidebarItem from './Item/ConnectSidebarItem';

import { mixPanelTrack } from '../../../helpers';

const ipcRenderer = require('electron').ipcRenderer;

class ConnectSidebar extends Component {
  static propTypes = {
    // actions: PropTypes.object.isRequired,
    // getFavorites: PropTypes.func.isRequired,
    // setCurrent: PropTypes.func.isRequired,
    // favorites: PropTypes.object.isRequired,
    // selectedFavorites: PropTypes.string.isRequired
  };

  static defaultProps = {
    // actions: {}
  };

  componentWillMount() {
    if (!this.props.favorites.length) {
      this.props.actions.getFavorites();
      ipcRenderer.on('reload', () => {
        this.props.actions.getFavorites();
      });
    }
  }

  setCurrent = id =>
    (e) => {
      e.preventDefault();
      if (id === null) {
        mixPanelTrack('Click new connection');
      } else {
        mixPanelTrack('Select favorite', { name: id });
      }
      this.props.actions.setCurrent(id);
    };

  render() {
    const { favorites, selectedFavorites } = this.props;
    return (
      <nav className="sidebar connect">
        {(favorites.size > 0) &&
          <ul className="nav">
            {favorites.map(item =>
              <ConnectSidebarItem
                key={item.get('id')}
                id={item.get('id')}
                connectionName={item.get('connectionName') || item.get('user')}
                className={item.get('id') === selectedFavorites ? 'active' : ''}
                setCurrent={this.setCurrent(item.get('id'))}
              />
            )}
          </ul>
        }
        <div className="sidebar-bottom-block">
          <button className="btn btn-navy btn-big" onClick={this.setCurrent(null)}>
            <i className="fa fa-plus" />
            &#160;NEW CONNECTION
          </button>
        </div>
      </nav>
    );
  }
}

const mapStateToProps = ({ newFavorite }) => ({
  favorites: getFavorites(newFavorite),
  selectedFavorites: newFavorite.meta.get('selectedFavorite')
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(FavoritesActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ConnectSidebar);
