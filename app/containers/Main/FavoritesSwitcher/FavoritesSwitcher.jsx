// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';

import * as favoritesActions from '../../../actions/favorites';
import * as uiActions from '../../../actions/ui';
import * as tablesActions from '../../../actions/tables';
import type { Dispatch, Favorites, State } from '../../../types';
import { getFavorites } from '../../../selectors/favorites';


import {
  I,
} from '../../Connect/styled';


import {
  SwitcherWrapper,
  TitleWrapper,
  Title,
  Favourites,
  Favorite,
  Close,
  MenuButton,
  SwitcherFooter,
} from './styled';

type Props = {
  selectFavoriteRequest: () => void,
  setConnectedState: () => void,
  clearTables: () => void,
  toggleMenu: () => void,
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

  render() {
    const { favorites, selectFavoriteRequest, toggleMenu, isMenuOpen }: Props = this.props;
    return (
      <SwitcherWrapper isMenuOpen={isMenuOpen}>
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
              >
                <I className="fa fa-database" />
                <span>{favorite.connectionName}</span>
              </Favorite>,
            )
          }
        </Favourites>
        <SwitcherFooter>
          <MenuButton onClick={this.disconectFromDB}>
            <I className="fa fa-chevron-left" />
            Disconnect
        </MenuButton>
        </SwitcherFooter>
      </SwitcherWrapper>
    );
  }
}

function mapDispatchToProps(dispatch: Dispatch): { [key: string]: Function } {
  return bindActionCreators({ ...favoritesActions, ...uiActions, ...tablesActions }, dispatch);
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
