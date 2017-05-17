// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';

import {
  ConnectContainer,
  SidebarColumn,
  MainColumn,
  SidebarHeader,
  SidebarContent,
  MainHeader,
  MainContent,
  NewConnectionButton,
  SidebarBottom,
  FormContainer,
  Img,
  Ul,
  Li,
  I,
} from './styled';
import ConnectForm from './ConnectForm';
import logo from '../../assets/images/logo.svg';

import * as favoritesActions from '../../actions/favorites';
import { getFavorites } from '../../selectors/favorites';

import type { IdString, Favorites, Dispatch, State } from '../../types';


type Props = {
  fetchFavoritesRequest: () => void,
  selectFavoriteRequest: () => void,
  currentFavoriteId: ?IdString,
  favorites: Favorites
};


class Connect extends Component {
  props: Props;

  componentDidMount() {
    this.props.fetchFavoritesRequest();
  }

  render() {
    const { favorites, currentFavoriteId, selectFavoriteRequest } : Props = this.props;
    return (
      <ConnectContainer>
        <SidebarColumn>
          <SidebarHeader>
            Favorites
          </SidebarHeader>
          <SidebarContent>
            <Ul>
              {favorites.map(favorite =>
                <Li
                  key={favorite.id}
                  active={currentFavoriteId === favorite.id}
                  onClick={() => selectFavoriteRequest(favorite.id.toString())}
                >
                  <I className="fa fa-database" />
                  <span>{favorite.connectionName}</span>
                </Li>,
              )}
            </Ul>
            <SidebarBottom>
              <NewConnectionButton onClick={() => selectFavoriteRequest(null)}>
                <I className="fa fa-plus" />
                NEW CONNECTION
              </NewConnectionButton>
            </SidebarBottom>
          </SidebarContent>
        </SidebarColumn>

        <MainColumn>
          <MainHeader>
            <Img alt="" role="presentation" src={logo} />
          </MainHeader>
          <MainContent>
            <FormContainer>
              <ConnectForm />
            </FormContainer>
          </MainContent>
        </MainColumn>
      </ConnectContainer>
    );
  }
}

function mapDispatchToProps(dispatch: Dispatch): {[key: string]: Function} {
  return bindActionCreators({ ...favoritesActions }, dispatch);
}

function mapStateToProps(state: State) {
  return {
    favorites: getFavorites({ favorites: state.favorites }),
    currentFavoriteId: state.favorites.meta.currentFavoriteId,
  };
}

const connector: Connector<Props, Props> = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default connector(Connect);
