import React, { Component } from 'react';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Field, reduxForm, getFormValues } from 'redux-form';

import * as modalActions from '../../../actions/modal';
import * as tablesActions from '../../../actions/tables';

import { RenderRadio } from '../../../components/shared/InputComponents';
import Modal from '../../../components/shared/Modal/Modal';

import {
  MainContainer,
  Header,
  Content,
  CloseButton,
  ActionButton,
  ButtonsGroup,
  ModalTools,
  ToolContainer,
  ToolHeader,
  ToolDescription,
  ActionDescription,
  ToolName,
} from './styled';

class DropTableModal extends Component {
  render() {
    const { dropTableName, show, hideDropTableModal, currentValues } = this.props;
    console.log(currentValues);
    if (!show) {
      return null;
    }
    return (
      <Modal onHide={hideDropTableModal}>
        <MainContainer>
          <Header>
            Do you want to drop {dropTableName}?
            <ActionDescription>
              This can not be undone.
            </ActionDescription>
          </Header>
          <Content>
            <ModalTools>
              <ToolContainer>
                <ToolHeader>
                  <Field
                    name="cascade"
                    component={RenderRadio}
                    type="checkbox"
                    normalize={value => value || false}
                  />
                  <ToolName>
                    Cascade
                  </ToolName>
                </ToolHeader>
                <ToolDescription>
                  Also truncate tables with foreign key constraints
                  depending on the truncated tables.
                </ToolDescription>
              </ToolContainer>
            </ModalTools>
          </Content>
          <ButtonsGroup>
            <ActionButton>
              Drop
            </ActionButton>
            <CloseButton onClick={hideDropTableModal}>
              Close
            </CloseButton>
          </ButtonsGroup>
        </MainContainer>
      </Modal>
    );
  }
}

function mapDispatchToProps(dispatch: Dispatch): {[key: string]: Function} {
  return bindActionCreators({ ...modalActions, ...tablesActions }, dispatch);
}

function mapStateToProps(state: State) {
  return {
    currentValues: getFormValues('DropTableFormModal')(state),
    show: state.modal.showDropTableModal,
    dropTableName: state.modal.dropTableName,
  };
}

const connector: Connector<{}, Props> = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default reduxForm({
  form: 'DropTableFormModal',
  initialValues: {
    cascade: false,
  },
})(connector(DropTableModal));
