import React, { Component, PropTypes } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../../../actions/currentTable';
import { toggleFavoriteSwitcher, setCurrent } from '../../../actions/favorites';

import FavoritesSwitcher from '../../Base/Header/FavoritesSwitcher/FavoritesSwitcher';

import getFavorites from '../../../selectors';

class Header extends Component {
  static propTypes = {
    favSwitcherOpen: PropTypes.bool,
    toggleFavoriteSwitcher: PropTypes.func,
    isConnected: PropTypes.bool,
    setCurrent: PropTypes.func,
    dropConnection: PropTypes.func
  };

  handleClick = () => {
    if (this.props.favSwitcherOpen) {
      this.props.toggleFavoriteSwitcher();
    }
    this.props.setCurrent(null);
    this.props.dropConnection();
  };

  render() {
    const { isConnected } = this.props;
    return (
      <header className="flex-row">
        <SideBarTop {...this.props} />
        <FavoritesSwitcher />
        {
          !isConnected &&
            <BarTop isConnected={this.props.isConnected} handleClick={this.handleClick} />
        }
      </header>
    );
  }
}

const SideBarTop = (props) => {
  const { favorites, selectedFavorite, isConnected } = props;
  const favorite = favorites.get(selectedFavorite);

  const connectionName = favorite
    ? favorite.get('connectionName')
    : '';

  return isConnected ?
    <div
      className="sidebar-head flex-row flex--s-between cursor-pointer"
      onClick={props.toggleFavoriteSwitcher}
    >
      {connectionName}
      <i className="fa fa-chevron-right vertical-center" />
    </div> :
    <div className="sidebar-head" >
      Favorites
    </div>;
};

const BarTop = (props) => {
  const { isConnected } = props;
  return isConnected ?
    <div className="bar-top flex-row flex--s-between">
      <img role="presentation" className="logo" src="styles/images/logo.svg" />
      <button className="btn btn-link btn-big" onClick={props.handleClick}>
        <i className="fa fa-plus" />
        &#160;New Connection
      </button>
    </div> :
    <div className="bar-top flex-row flex--s-between">
      <img role="presentation" className="logo" src="styles/images/logo.svg" />
    </div>;
};

SideBarTop.propTypes = {
  favorites: PropTypes.object,
  selectedFavorite: PropTypes.string,
  toggleFavoriteSwitcher: PropTypes.func,
  isConnected: PropTypes.bool
};
BarTop.propTypes = {
  isConnected: PropTypes.bool.isRequired,
  handleClick: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    favorites: getFavorites(state.favorites),
    selectedFavorite: state.favorites.meta.get('selectedFavorite'),
    isConnected: state.currentTable.isConnected
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...Actions, toggleFavoriteSwitcher, setCurrent }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
