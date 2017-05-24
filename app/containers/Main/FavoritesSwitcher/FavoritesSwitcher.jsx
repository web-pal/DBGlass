// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';

import {
  SubmissionError,
} from 'redux-form';

import * as favoritesActions from '../../../actions/favorites';
import * as uiActions from '../../../actions/ui';
import * as tablesActions from '../../../actions/tables';
import type { Dispatch, Favorites, State } from '../../../types';
import { getFavorites } from '../../../selectors/favorites';

import { configureConnect, connectDB } from '../../../utils/pgDB';
import sshConnect from '../../../utils/sshForward';

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
  toggleLadda: () => void,
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

  favoriteClick = (id) => {
    this.disconectFromDB();
    this.props.selectFavoriteRequest(id);// to switch to selected db
    setTimeout(() => {
      const data = Object.values(this.props.favorites)
        .filter(favorite => favorite.id === id)[0];
      this.props.toggleLadda(true);
      const {
        useSSH, sshHost, sshPort, sshUsername, sshPassword,
        sshKeyPassword, sshAuthType, privateKey, port, address,
      } = data;

      configureConnect(data);
      let promise = null;
      if (useSSH) {
        if (sshAuthType === 'key' && !privateKey) {
          return new Promise(resolve => resolve({ err: 'Missing private key', isConnected: false })).then(result => {
            this.setState({ err: result.err });
          });
        }
        const sshParams = {
          host: sshHost,
          port: sshPort,
          username: sshUsername,
          sshAuthType,
          password: sshPassword,
          passphrase: sshKeyPassword,
          privateKey,
        };
        promise = new Promise(
          resolve => sshConnect(
            { ...sshParams, dbPort: port, dbAddress: address },
            (err, freePort) => {
              if (err) {
                resolve({ err, isConnected: false });
              } else {
                configureConnect({ ...data, port: freePort });
                connectDB((isConnected, error) => {
                  resolve({ err: error, isConnected });
                });
              }
            }));
      } else {
        promise = new Promise(resolve => connectDB((isConnected, err) => {
          resolve({ err, isConnected });
        }));
      }
      return promise.then((result) => {
        if (!result.isConnected) {
          // this.setState({ err: result.err });
          throw new SubmissionError(result.err);
        } else {
          this.props.setConnectedState(true);
        }
        this.props.toggleLadda(false);
      });
    }, 1000);
    // this.props.submitConnectionForm();
    // this.props.selectFavoriteRequest(id);// to switch to selected db
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
                onClick={() => this.favoriteClick(favorite.id)}
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
