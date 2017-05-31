import React, { Component } from 'react';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Field, reduxForm } from 'redux-form';

import * as modalActions from '../../../../actions/modal';
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
  ToolName,
  ToolDescription,
  ActionDescription,
} from './styled';

type Props = {
  hideModal: () => void,
  values: object
};

class ConfirmationModal extends Component {
  props: Props;

  render() {
    const { hideModal, values: { actionType, elementType, elementName } } = this.props;
    return (
      <Base onHide={hideModal}>
        <MainContainer>
          <Header>
            Do you want to {actionType} {elementName}?
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
              elementType === 'table' &&
              <ModalTools>
                {
                  actionType === 'truncate' &&
                  <ToolContainer>
                    <Field
                      name="restartIdentity"
                      component={RenderRadio}
                      type="checkbox"
                    />
                    <ToolName>
                      Restart Identity
                    </ToolName>
                    <ToolDescription>
                      Also reset sequences owned by the truncated tables(s).
                    </ToolDescription>
                  </ToolContainer>
                }
                <ToolContainer>
                  <Field
                    name="Cascade"
                    component={RenderRadio}
                    type="checkbox"
                  />
                  <ToolName>
                    Cascade
                  </ToolName>
                  <ToolDescription>
                    Also truncate tables with foreign key constraints
                    depending on the truncated tables.
                  </ToolDescription>
                </ToolContainer>
              </ModalTools>
            }
          </Content>
          <ButtonsGroup>
            <ActionButton>
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
  return bindActionCreators({ ...modalActions }, dispatch);
}

function mapStateToProps(state: State) {
  return state.modal;
}

const connector: Connector<{}, Props> = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default reduxForm({
  form: 'ConfirmationModal',
})(connector(ConfirmationModal));
