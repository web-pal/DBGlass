import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import getFavorites from '../../../selectors';
import * as FavoritesActions from '../../../actions/favorites';

import ConnectSidebarItem from './Item/ConnectSidebarItem';

import { mixPanelTrack } from '../../../helpers';

const ipcRenderer = require('electron').ipcRenderer;

const propTypes = {
  getFavorites: React.PropTypes.func.isRequired,
  setCurrent: React.PropTypes.func.isRequired,
  newFavorite: React.PropTypes.object.isRequired,
  selectedFavorite: React.PropTypes.number
};


class ConnectSidebar extends Component {
  componentWillMount() {
    if (!this.props.newFavorite.length) {
      this.props.getFavorites();
      ipcRenderer.on('reload', () => {
        this.props.getFavorites();
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
      this.props.setCurrent(id);
    };

  render() {
    const { newFavorite, selectedFavorite, selected } = this.props;
    console.log('=========')
    console.log('Slected', selected)
    console.log('=========')
    return (
      <nav className="sidebar connect">
        {(newFavorite.size > 0) &&
          <ul className="nav">
            {newFavorite.map(item =>
              <ConnectSidebarItem
                key={item.get('id')}
                id={item.get('id')}
                connectionName={item.get('connectionName') || item.get('user')}
                className={item.get('id') === selected ? 'active' : ''}
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

function mapStateToProps({ favorites, newFavorite }) {
  return {
    favorites: favorites.favorites,
    selectedFavorite: favorites.selectedFavorite,

    newFavorite: getFavorites(newFavorite),
    selected: newFavorite.meta.get('selectedFavorite')
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(FavoritesActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ConnectSidebar);
