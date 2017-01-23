import React, { PropTypes } from 'react';

const SideBarTop = ({ favorites, selectedFavorite, isConnected, toggleFavoriteSwitcher }) => {
  const favorite = favorites.get(selectedFavorite);
  const connectionName = favorite
    ? favorite.get('connectionName')
    : '';
  return isConnected ?
    <div
      className="sidebar-head flex-row flex--s-between cursor-pointer"
      onClick={toggleFavoriteSwitcher}
    >
      {connectionName}
      <i className="fa fa-chevron-right vertical-center" />
    </div>
    : <div className="sidebar-head" >
      Favorites
    </div>;
};

SideBarTop.propTypes = {
  favorites: PropTypes.object,
  selectedFavorite: PropTypes.string,
  isConnected: PropTypes.bool,
  toggleFavoriteSwitcher: PropTypes.func
};

export default SideBarTop;
