import React, { Component } from 'react';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as modalActions from '../../../../actions/modal';
import Base from '../Base/Base';

import {
  MainContainer,
  Header,
  Content,
  CloseButton,
  ButtonsGroup,
} from './styled';

type Props = {
  hideModal: () => void,
  values: Object
};

class ErrorModal extends Component {
  props: Props;

  render() {
    const {
      hideModal,
      values,
    } = this.props;
    return (
      <Base onHide={hideModal}>
        <MainContainer>
          <Header>
            Error!
          </Header>
          <Content>
            {values.message}
          </Content>
          <ButtonsGroup>
            <CloseButton
              onClick={hideModal}
            >
              Close
            </CloseButton>
          </ButtonsGroup>
        </MainContainer>
      </Base>
    );
  }
}

function mapDispatchToProps(dispatch: Dispatch): {[key: string]: Function} {
  return bindActionCreators({ ...modalActions }, dispatch);
}

function mapStateToProps(state: State) {
  return state.modal;
}

const connector: Connector<{}, Props> = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default connector(ErrorModal);
