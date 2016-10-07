import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as FavoritesActions from '../../../actions/favorites';

import ConnectSidebarItem from './Item/ConnectSidebarItem';

const ipcRenderer = require('electron').ipcRenderer;

const propTypes = {
  getFavorites: React.PropTypes.func.isRequired,
  setCurrent: React.PropTypes.func.isRequired,
  favorites: React.PropTypes.object.isRequired,
  selectedFavorite: React.PropTypes.number
};


class ConnectSidebar extends Component {
  componentWillMount() {
    if (!this.props.favorites.length) {
      this.props.getFavorites();
      ipcRenderer.on('reload', () => {
        this.props.getFavorites();
      });
    }
  }

  setCurrent = id =>
    e => {
      e.preventDefault();
      this.props.setCurrent(id);
    };

  render() {
    const { favorites, selectedFavorite } = this.props;

    return (
      <nav className="sidebar connect">
        {(favorites.size > 0) &&
          <ul className="nav">
            {favorites.map((item) =>
              <ConnectSidebarItem
                key={item.get('id')}
                id={item.get('id')}
                connectionName={item.get('connectionName') || item.get('user')}
                className={item.get('id') === selectedFavorite ? 'active' : ''}
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

ConnectSidebar.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    favorites: state.favorites.favorites,
    selectedFavorite: state.favorites.selectedFavorite
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(FavoritesActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ConnectSidebar);
