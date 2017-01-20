import React, { Component, PropTypes } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../../../../actions/currentTable';
import * as FavoritesActions from '../../../../actions/favorites';

import getFavorites from '../../../../selectors';

class FavSwitcherComponent extends Component {
  static propTypes = {
    favorites: PropTypes.object.isRequired,
    dropConnection: PropTypes.func.isRequired,
    toggleFavoriteSwitcher: PropTypes.func.isRequired,
    setCurrent: PropTypes.func.isRequired,
    favSwitcherOpen: PropTypes.bool.isRequired
  };

  componentDidMount() {
    window.addEventListener('mousedown', this.handleOuterClick);
  }

  componentWillUnmount() {
    window.removeEventListener('mousedown', null);
  }

  handleClick = (e) => {
    this.props.toggleFavoriteSwitcher();
    this.props.setCurrent((Number(e.target.dataset.id)).toString() || null);
    this.props.dropConnection();
  }

  handleOuterClick = (e) => {
    const wrapper = document.getElementById('favSwitcher');
    const condition =
      e.clientX > wrapper.offsetLeft &&
      e.clientX < wrapper.offsetLeft + wrapper.offsetWidth &&
      e.clientY > wrapper.offsetTop &&
      e.clientY < wrapper.offsetTop + wrapper.offsetHeight;
    if (!condition && this.props.favSwitcherOpen) {
      this.props.toggleFavoriteSwitcher();
    }
  }

  render() {
    const { favorites, favSwitcherOpen, toggleFavoriteSwitcher } = this.props;
    return (
      <div
        className={
          `favSwitcher-wrapper ${favSwitcherOpen ?
          'favSwitcher-wrapper--active' : ''}`
        }
        id="favSwitcher"
      >
        <strong className="plainList-title">
          Favorites
          <i className="fa fa-times cursor-pointer" onClick={toggleFavoriteSwitcher} />
        </strong>
        <ul className="plainlist">
          {favorites.map(item =>
            <li
              key={item.get('id')}
              data-id={item.get('id')}
              onClick={this.handleClick}
            >
              <i className="fa fa-database" />
              {item.get('connectionName')}
            </li>
          )}
        </ul>
        <hr />
        <div className="btn-block">
          <button className="btn btn-plain btn--block-centered" onClick={this.handleClick}>
            <i className="fa fa-plus" />
            &#160;New Connection
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ favorites }) => ({
  favorites: getFavorites(favorites),
  favSwitcherOpen: favorites.meta.get('favSwitcherOpen')
});

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...Actions, ...FavoritesActions }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(FavSwitcherComponent);
