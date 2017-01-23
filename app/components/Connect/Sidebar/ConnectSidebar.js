import React, { Component, PropTypes } from 'react';
import ConnectSidebarItem from './Item/ConnectSidebarItem';

import { mixPanelTrack } from '../../../helpers';

const ipcRenderer = require('electron').ipcRenderer;

export default class ConnectSidebar extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    favorites: PropTypes.object.isRequired,
    selectedFavorite: PropTypes.string
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
    const { favorites, selectedFavorite } = this.props;
    return (
      <nav className="sidebar connect">
        {(favorites.size > 0) &&
          <ul className="nav">
            {favorites.map(item =>
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
