import React, { Component, PropTypes } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../../../actions/currentTable';
import { toggleFavoriteSwitcher, setCurrent } from '../../../actions/favorites';

import FavoritesSwitcher from '../../Base/Header/FavoritesSwitcher/FavoritesSwitcher';

const propTypes = {
  favorites: PropTypes.object,
  selectedFavorite: PropTypes.number,
  favSwitcherOpen: PropTypes.bool,
  toggleFavoriteSwitcher: PropTypes.func,
  isConnected: PropTypes.bool,
  setCurrent: PropTypes.func,
  dropConnection: PropTypes.func
};

class Header extends Component {
  handleClick = () => {
    if (this.props.favSwitcherOpen) {
      this.props.toggleFavoriteSwitcher();
    }
    this.props.setCurrent(null);
    this.props.dropConnection();
  }

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
  return isConnected ?
    <div
      className="sidebar-head flex-row flex--s-between cursor-pointer"
      onClick={props.toggleFavoriteSwitcher}
    >
      {favorites.get(selectedFavorite - 1).get('connectionName')}
      <i className="fa fa-chevron-right vertical-center" />
    </div> :
    <div
      className="sidebar-head"
    >
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

Header.propTypes = propTypes;
SideBarTop.propTypes = propTypes;
BarTop.propTypes = {
  isConnected: PropTypes.bool.isRequired,
  handleClick: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    favorites: state.favorites.favorites,
    selectedFavorite: state.favorites.selectedFavorite,
    isConnected: state.currentTable.isConnected
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...Actions, toggleFavoriteSwitcher, setCurrent }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
