// @flow
import React from 'react';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Field, reduxForm, formValueSelector } from 'redux-form';

import * as modalActions from '../../../actions/modal';
import * as tablesActions from '../../../actions/tables';

import { RenderRadio } from '../../../components/shared/InputComponents';
import Modal from '../../../components/shared/Modal/Modal';

import type { State } from '../../../types';

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
  ToolErrorMessage,
  ActionDescription,
  ToolName,
} from './styled';


type Props = {
  truncateTableName: ?string,
  truncateTableErrorMessage: ?string,
  show: boolean,
  isCascade: boolean,
  restartIdentity: boolean,
  hideTruncateTableModal: () => void,
  truncateTableRequest: ({ tableName: string, isCascade: boolean }) => void
};

const TruncateTableModal = ({
  truncateTableName, truncateTableErrorMessage,
  show, isCascade, restartIdentity,
  hideTruncateTableModal, truncateTableRequest,
}: Props) => {
  if (!show) {
    return null;
  }

  return (
    <Modal onHide={hideTruncateTableModal}>
      <MainContainer>
        <Header>
          Do you want to truncate {truncateTableName}?
          <ActionDescription>
            Truncation is an efficient method to delete all rows in a table.
          </ActionDescription>
        </Header>
        <Content>
          <ModalTools>
            <ToolContainer>
              <ToolHeader>
                <Field
                  name="restartIdentity"
                  component={RenderRadio}
                  type="checkbox"
                  normalize={value => value || false}
                />
                <ToolName>
                  Restart Identity
                </ToolName>
              </ToolHeader>
              <ToolDescription>
                Also reset sequences owned by the truncated tables(s).
              </ToolDescription>
            </ToolContainer>

            <ToolContainer>
              <ToolHeader>
                <Field
                  name="isCascade"
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
              <ToolErrorMessage>
                {truncateTableErrorMessage}
              </ToolErrorMessage>
            </ToolContainer>
          </ModalTools>
        </Content>
        <ButtonsGroup>
          <ActionButton
            onClick={() => {
              if (truncateTableName) {
                truncateTableRequest({
                  tableName: truncateTableName,
                  isCascade,
                  restartIdentity,
                });
              }
            }}
          >
            Truncate
          </ActionButton>
          <CloseButton onClick={hideTruncateTableModal}>
            Close
          </CloseButton>
        </ButtonsGroup>
      </MainContainer>
    </Modal>
  );
};

function mapDispatchToProps(dispatch: Dispatch): {[key: string]: Function} {
  return bindActionCreators({ ...modalActions, ...tablesActions }, dispatch);
}

const selector = formValueSelector('TruncateTableFormModal');
function mapStateToProps(state: State) {
  return {
    isCascade: selector(state, 'isCascade') || false,
    restartIdentity: selector(state, 'restartIdentity') || false,
    show: state.modal.showTruncateTableModal,
    truncateTableName: state.modal.truncateTableName,
    truncateTableErrorMessage: state.modal.truncateTableErrorMessage,
  };
}

const connector: Connector<{}, Props> = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default reduxForm({
  form: 'TruncateTableFormModal',
  initialValues: {
    cascade: false,
    restartIdentity: false,
  },
})(connector(TruncateTableModal));
