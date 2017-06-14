import React, { Component } from 'react';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Field, reduxForm, getFormValues } from 'redux-form';

import * as modalActions from '../../../../actions/modal';
import * as tablesActions from '../../../../actions/tables';
import { capitalizeFirstLetter } from '../../../../utils/helpers';
import { RenderRadio } from '../../InputComponents';
import Base from '../Base/Base';

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

type Props = {
  hideModal: () => void,
  dropTableRequest: ({
    selectedElementName: string,
    currentValues: ?Object,
    currentTableName: ?string
  }) => void,
  truncateTableRequest: ({
    selectedElementName: string,
    currentValues: ?Object
  }) => void,
  modal: Object,
  currentValues: ?Object,
  currentTableName: ?string
};

class ConfirmationModal extends Component {
  props: Props;

  updateCurrentTable = () => {
    const {
      dropTableRequest,
      currentValues,
      currentTableName,
      truncateTableRequest,
      modal: {
        values: {
          actionType,
          selectedElementName,
        },
      },
    } = this.props;
    if (actionType === 'drop') {
      dropTableRequest({ selectedElementName, currentValues, currentTableName });
    } else {
      truncateTableRequest({ selectedElementName, currentValues });
    }
  }
  render() {
    const {
      hideModal,
      modal: {
        values: {
          actionType,
          selectedElementType,
          selectedElementName,
        },
      },
    } = this.props;
    return (
      <Base onHide={hideModal}>
        <MainContainer>
          <Header>
            Do you want to {actionType} {selectedElementName}?
            {
              actionType === 'truncate'
              ? <ActionDescription>
                Truncation is an efficient method
                to delete all rows in a table.
              </ActionDescription>
              : <ActionDescription>
                This can not be undone.
              </ActionDescription>
            }
          </Header>
          <Content>
            {
              selectedElementType === 'table' &&
              <ModalTools>
                {
                  actionType === 'truncate' &&
                  <ToolContainer>
                    <ToolHeader>
                      <Field
                        name="restartIdentity"
                        component={RenderRadio}
                        type="checkbox"
                      />
                      <ToolName>
                        Restart Identity
                      </ToolName>
                    </ToolHeader>
                    <ToolDescription>
                      Also reset sequences owned by the truncated tables(s).
                    </ToolDescription>
                  </ToolContainer>
                }
                <ToolContainer>
                  <ToolHeader>
                    <Field
                      name="cascade"
                      component={RenderRadio}
                      type="checkbox"
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
            }
          </Content>
          <ButtonsGroup>
            <ActionButton onClick={this.updateCurrentTable}>
              {capitalizeFirstLetter(actionType)}
            </ActionButton>
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
  return bindActionCreators({ ...modalActions, ...tablesActions }, dispatch);
}

function mapStateToProps(state: State) {
  return {
    currentValues: getFormValues('ConfirmationModal')(state),
    modal: state.modal,
    currentTableName: state.tables.meta.currentTableName,
  };
}

const connector: Connector<{}, Props> = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default reduxForm({
  form: 'ConfirmationModal',
})(connector(ConfirmationModal));
