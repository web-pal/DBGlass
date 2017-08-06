// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Field, reduxForm,
  getFormValues, change,
} from 'redux-form';

import * as uiActions from '../../actions/ui';
import * as favoritesActions from '../../actions/favorites';
import * as connectActions from '../../actions/connect';
import {
  RenderRadio,
  RenderField,
  RenderSlider,
} from '../../components/shared/InputComponents';

import { Button } from '../../components/shared/styled';
import LaddaButton from '../../components/shared/LaddaButton/LaddaButton';

import {
  LeftFieldsContainer,
  RightFieldsContainer,
  HelpText,
  Form,
  InputGroup,
  ButtonsGroup,
  ToggleGroup,
  ToggleLabel,
  RadioGroup,
  RadioArea,
  ToggleArea,
  Label,
  RadioLabel,
  InputWithButton,
  RemoveButton,
  SaveButton,
} from './styled';

import type { Favorite, State, Dispatch, IdString } from '../../types';

const os = require('electron').remote.require('os');
const path = require('electron').remote.require('path');
const { dialog } = require('electron').remote;


const required = value => (value ? undefined : 'Required');
const requiredIfUseSSH = (value, allValues) => ((value || !allValues.useSSH) ? undefined : 'Required');

type Props = {
  changeField: (string, string) => void,
  addFavoriteRequest: (Favorite) => void,
  removeFavoriteRequest: (IdString) => void,
  startSubmitRequest: (Favorite) => void,
  setConnectionError: (string) => void,
  favoritesLength: number,
  currentValues: ?Favorite,
  valid: boolean,
  dirty: boolean,
  isLoading: boolean,
  connectionError: string
};

type ConnectFormState = {
  err: ?string
};

class ConnectForm extends Component {
  props: Props;
  state: ConnectFormState;

  state = {
    err: '',
  };

  showFileDialog = (event) => {
    if (event) {
      event.preventDefault();
    }
    const defaultPath = path.join(os.homedir(), '.ssh');
    dialog.showOpenDialog({ defaultPath, properties: ['openFile'] }, (file) => {
      if (file) {
        this.props.changeField('privateKey', file[0]);
      }
    });
  }

  save = (event) => {
    event.preventDefault();
    this.props.setConnectionError('');

    const values = this.props.currentValues;
    if (values) {
      const { useSSH, privateKey, sshAuthType } = values;

      if (useSSH && sshAuthType === 'key' && !privateKey) {
        this.props.setConnectionError('Missing private key');
      } else {
        const favorite = values;
        if (!values.connectionName) {
          favorite.connectionName = values.database;
        }
        if (!values.id) {
          favorite.id = (this.props.favoritesLength + 1).toString();
        }
        favorite.tablesQuantity = 0;
        this.props.addFavoriteRequest(favorite);
      }
    }
  }

  remove = (event) => {
    event.preventDefault();
    const values = this.props.currentValues;
    if (values && values.id) {
      this.props.removeFavoriteRequest(values.id);
    }
  }

  submit = (event) => {
    event.preventDefault();
    if (this.props.currentValues) {
      this.props.startSubmitRequest(this.props.currentValues);
    }
  }

  onSSHAuthTypeChange = (event) => {
    if (this.props.currentValues) {
      const { privateKey } = this.props.currentValues;
      if (event.target.value === 'key' && !privateKey) {
        this.showFileDialog();
      }
    }
  }

  render() {
    if (!this.props.currentValues) {
      return <div />;
    }
    const { currentValues, valid, dirty, connectionError } = this.props;
    const { useSSH, sshAuthType, privateKey, id } = currentValues;

    return (
      <Form onSubmit={this.submit}>
        <LeftFieldsContainer>
          <InputGroup>
            <Label>Connection name</Label>
            <Field
              name="connectionName"
              component={RenderField}
              type="text"
              className="connectFormInput"
              placeholder="Connection name"
            />
          </InputGroup>
          <InputGroup>
            <Label>User*</Label>
            <Field
              name="user"
              component={RenderField}
              type="text"
              className="connectFormInput"
              placeholder="User"
              validate={[required]}
            />
          </InputGroup>
          <InputGroup>
            <Label>Password</Label>
            <Field
              name="password"
              component={RenderField}
              type="password"
              className="connectFormInput"
              placeholder="Password"
            />
          </InputGroup>
          <InputGroup>
            <Label>Address*</Label>
            <Field
              name="address"
              component={RenderField}
              type="text"
              className="connectFormInput"
              placeholder="Address"
              validate={[required]}
            />
          </InputGroup>
          <InputGroup>
            <Label>Database*</Label>
            <Field
              name="database"
              component={RenderField}
              type="text"
              className="connectFormInput"
              placeholder="Database name"
              validate={[required]}
            />
          </InputGroup>
          <InputGroup>
            <Label>Port*</Label>
            <Field
              name="port"
              component={RenderField}
              type="text"
              className="connectFormInput"
              placeholder="Port"
              validate={[required]}
            />
          </InputGroup>
          <ToggleGroup>
            <ToggleLabel>Use SSL connection</ToggleLabel>
            <ToggleArea>
              <Field
                name="ssl"
                component={RenderSlider}
                type="checkbox"
                normalize={value => value || false}
              />
            </ToggleArea>
          </ToggleGroup>
          <span style={{ color: 'red' }}>{connectionError}</span>
        </LeftFieldsContainer>

        <RightFieldsContainer>
          <InputGroup>
            <Label>SSH User{`${useSSH ? '*' : ''}`}</Label>
            <Field
              name="sshUsername"
              disabled={!useSSH}
              component={RenderField}
              type="text"
              className="connectFormInput"
              placeholder="SSH User"
              validate={[requiredIfUseSSH]}
            />
          </InputGroup>
          <InputGroup>
            <Label>SSH Server{`${useSSH ? '*' : ''}`}</Label>
            <Field
              name="sshHost"
              disabled={!useSSH}
              component={RenderField}
              type="text"
              placeholder="SSH Server"
            />
          </InputGroup>
          <InputGroup>
            <Label>SSH Port{`${useSSH ? '*' : ''}`}</Label>
            <Field
              name="sshPort"
              disabled={!useSSH}
              component={RenderField}
              type="text"
              placeholder="SSH Port"
            />
          </InputGroup>
          <RadioGroup>
            <RadioArea>
              <RadioLabel>SSH Password</RadioLabel>
              <Field
                name="sshAuthType"
                disabled={!useSSH}
                component={RenderRadio}
                onChange={this.onSSHAuthTypeChange}
                type="radio"
                value="password"
              />
            </RadioArea>
            <RadioArea>
              <RadioLabel>SSH Key</RadioLabel>
              <Field
                name="sshAuthType"
                disabled={!useSSH}
                component={RenderRadio}
                onChange={this.onSSHAuthTypeChange}
                type="radio"
                value="key"
              />
            </RadioArea>
          </RadioGroup>

          {sshAuthType === 'key' ?
            <InputGroup>
              <Label>Key password</Label>
              <InputWithButton>
                <Field
                  name="sshKeyPassword"
                  disabled={!useSSH}
                  component={RenderField}
                  type="password"
                  placeholder="Key Password"
                />
                <Button disabled={!useSSH} onClick={this.showFileDialog}>
                  Private key
                </Button>
              </InputWithButton>
              <HelpText>{privateKey}</HelpText>
            </InputGroup> :
            <InputGroup>
              <Label>SSH password</Label>
              <Field
                name="sshPassword"
                disabled={!useSSH}
                component={RenderField}
                type="text"
                placeholder="SSH Password"
              />
            </InputGroup>
          }
          <ToggleGroup>
            <ToggleLabel>Connect via SSH</ToggleLabel>
            <ToggleArea>
              <Field
                name="useSSH"
                component={RenderSlider}
                type="checkbox"
                normalize={value => value || false}
              />
            </ToggleArea>
          </ToggleGroup>
          <ButtonsGroup>
            {id &&
              <RemoveButton onClick={this.remove}>
                Remove
              </RemoveButton>
            }
            <SaveButton
              onClick={this.save}
              disabled={(!valid && !dirty)}
            >
              Save
            </SaveButton>
            <LaddaButton isLoading={this.props.isLoading} type="submit">
              Connect
            </LaddaButton>
          </ButtonsGroup>
        </RightFieldsContainer>
      </Form>
    );
  }
}


function mapStateToProps(state: State) {
  return {
    favoritesLength: state.favorites.allIds.length,
    currentValues: getFormValues('connectForm')(state),
    isLoading: state.ui.isLoading,
    connectionError: state.ui.connectionError,
  };
}

function mapDispatchToProps(dispatch: Dispatch): {[key: string]: Function} {
  return bindActionCreators({
    ...uiActions,
    ...favoritesActions,
    ...connectActions,
    changeField: (field, value) => dispatch(change('connectForm', field, value)),
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({
  form: 'connectForm',
})(ConnectForm));
