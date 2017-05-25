// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';

import * as favoritesActions from '../../../actions/favorites';
import * as connectActions from '../../../actions/connect';
import * as uiActions from '../../../actions/ui';
import * as tablesActions from '../../../actions/tables';
import type { Dispatch, Favorites, State } from '../../../types';
import { getFavorites } from '../../../selectors/favorites';

import {
  SwitcherWrapper,
  TitleWrapper,
  Title,
  Favourites,
  Favorite,
  Close,
  Icon,
  MenuButton,
  SwitcherFooter,
} from './styled';

type Props = {
  setConnectedState: () => void,
  clearTables: () => void,
  toggleMenu: () => void,
  startSubmitRequest: () => void,
  selectFavoriteRequest: () => void,
  favorites: Favorites,
  isMenuOpen: boolean
};

class FavoritesSwitcher extends Component {
  props: Props;

  disconectFromDB = () => {
    this.props.setConnectedState(false);
    this.props.clearTables();
    this.props.toggleMenu(false);
  }

  connectToDB = (favorite) => {
    this.disconectFromDB();
    this.props.selectFavoriteRequest(favorite.id);
    setTimeout(() => {
      this.props.startSubmitRequest(favorite);
    }, 500);
  }

  render() {
    const { favorites, toggleMenu, isMenuOpen }: Props = this.props;
    return (
      <SwitcherWrapper isMenuOpen={isMenuOpen} id="switcherWrapper">
        <TitleWrapper>
          <Title>
            Favorites
          </Title>
          <Close className="fa fa-times cursor-pointer" onClick={() => toggleMenu(!isMenuOpen)} />
        </TitleWrapper>
        <Favourites>
          {
            favorites.map(favorite =>
              <Favorite
                key={favorite.id}
                onClick={() => this.connectToDB(favorite)}
              >
                <Icon className="fa fa-database" />
                <span>{favorite.connectionName}</span>
              </Favorite>,
            )
          }
        </Favourites>
        <SwitcherFooter>
          <MenuButton onClick={this.disconectFromDB}>
            <Icon className="fa fa-chevron-left" />
            Disconnect
        </MenuButton>
        </SwitcherFooter>
      </SwitcherWrapper>
    );
  }
}

function mapDispatchToProps(dispatch: Dispatch): { [key: string]: Function } {
  return bindActionCreators(
    { ...favoritesActions, ...connectActions, ...uiActions, ...tablesActions }, dispatch,
  );
}

function mapStateToProps(state: State) {
  return {
    favorites: getFavorites({ favorites: state.favorites }),
    isMenuOpen: state.ui.isMenuOpen,
  };
}

const connector: Connector<{}, Props> = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default connector(FavoritesSwitcher);
