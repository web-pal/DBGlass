// @flow
import React from 'react';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as modalActions from '../../../actions/modal';
import Modal from '../../../components/shared/Modal/Modal';

import type { State } from '../../../types';

import {
  MainContainer,
  Header,
  Content,
  CloseButton,
  ButtonsGroup,
} from './styled';

type Props = {
  hideErrorModal: () => void,
  show: boolean,
  errorMessage: ?string
};

const ErrorModal = ({ show, hideErrorModal, errorMessage }: Props) => {
  if (!show) {
    return null;
  }
  return (
    <Modal onHide={hideErrorModal}>
      <MainContainer>
        <Header>
          Error!
        </Header>
        <Content>
          {errorMessage}
        </Content>
        <ButtonsGroup>
          <CloseButton
            onClick={hideErrorModal}
          >
            Close
          </CloseButton>
        </ButtonsGroup>
      </MainContainer>
    </Modal>
  );
};

function mapDispatchToProps(dispatch: Dispatch): {[key: string]: Function} {
  return bindActionCreators({ ...modalActions }, dispatch);
}

function mapStateToProps(state: State) {
  return {
    show: state.modal.showErrorModal,
    errorMessage: state.modal.errorMessage,
  };
}

const connector: Connector<{}, Props> = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default connector(ErrorModal);
