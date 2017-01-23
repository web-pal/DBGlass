import React, { Component, PropTypes } from 'react';

import FavoritesSwitcher from './FavoritesSwitcher';
import SideBarTop from './SideBarTop';
import BarTop from './BarTop';

export default class Header extends Component {
  static propTypes = {
    favSwitcherOpen: PropTypes.bool,
    isConnected: PropTypes.bool,
    setCurrent: PropTypes.func,
    dropConnection: PropTypes.func,
    favorites: PropTypes.object,
    selectedFavorite: PropTypes.string,
    toggleFavoriteSwitcher: PropTypes.func,
    actions: PropTypes.object
  };

  handleClick = () => {
    if (this.props.favSwitcherOpen) {
      this.props.actions.toggleFavoriteSwitcher();
    }
    this.props.setCurrent(null);
    this.props.dropConnection();
  };

  render() {
    const {
      favorites,
      selectedFavorite,
      isConnected,
      favSwitcherOpen,
      setCurrent,
      dropConnection,
      actions } = this.props;
    return (
      <header className="flex-row">
        <SideBarTop
          favorites={favorites}
          selectedFavorite={selectedFavorite}
          isConnected={isConnected}
          toggleFavoriteSwitcher={actions.toggleFavoriteSwitcher}
        />
        <FavoritesSwitcher
          favorites={favorites}
          favSwitcherOpen={favSwitcherOpen}
          toggleFavoriteSwitcher={actions.toggleFavoriteSwitcher}
          setCurrent={setCurrent}
          dropConnection={dropConnection}
          actions={actions}
        />
        {
          !isConnected &&
            <BarTop isConnected={isConnected} handleClick={this.handleClick} />
        }
      </header>
    );
  }
}
