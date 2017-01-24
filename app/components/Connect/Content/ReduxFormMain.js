import React, { Component, PropTypes } from 'react';
import { Field, SubmissionError } from 'redux-form/immutable';

import ReduxFormSSH from './ReduxFormSSH';
import LaddaButton from '../../Base/LaddaButton/LaddaButton';

import { renderField, renderCheckbox } from './InputComponents';

import { mixPanelTrack } from '../../../helpers';

export default class ReduxFormMain extends Component {
  static propTypes = {
    actions: PropTypes.object,
    handleSubmit: PropTypes.func,
    reset: PropTypes.func,
    submitting: PropTypes.bool,
    dirty: PropTypes.bool,
    valid: PropTypes.bool,
    formValues: PropTypes.object,
    useSSH: PropTypes.bool,
    sshKey: PropTypes.string,
    sshAuthType: PropTypes.string,
    connectDB: PropTypes.func,
    selectedFavorite: PropTypes.string,
    addFavorite: PropTypes.func,
    setCurrent: PropTypes.func,
    updateFavorite: PropTypes.func,
    removeFavorite: PropTypes.func
  };
  constructor(props) {
    super(props);
    this.state = {
      sshKey: null,
      error: null
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedFavorite !== this.props.selectedFavorite) {
      this.props.reset();
    }
  }

  handleSubmit = (values) => {
    mixPanelTrack('Connect click');
    this.setState({ error: null });
    const data = Object.assign(
      {}, values.toObject(), { privateKey: this.state.sshKey || this.props.sshKey }
    );
    const promise = new Promise(resolve =>
      this.props.actions.connectDB(data, (flag, err, sshError) => {
        resolve({ err, sshError });
      }));
    return promise.then((result) => {
      if (result.err) {
        mixPanelTrack('Connect error', { error: result.err });
        this.setState({ error: result.err });
        const errorObj = { _error: 'Auth failed' };
        throw new SubmissionError(errorObj);
      } else {
        mixPanelTrack('Connect success');
      }
    });
  };

  handleSave = () => {
    mixPanelTrack('Save favorite click');
    const data = Object.assign(
      {}, this.props.formValues, { privateKey: this.state.sshKey }
      );
    if (data.id) {
      this.props.actions.updateFavorite(data);
    } else {
      this.props.actions.addFavorite(data, true);
    }
  };

  handleRemove = () => {
    mixPanelTrack('Remove favorite click');
    this.props.actions.removeFavorite(this.props.formValues.id);
    this.props.actions.setCurrent(null);
  };

  saveSSHKey = (sshKey) => {
    this.setState({ sshKey });
  };

  render() {
    const {
      handleSubmit, submitting, useSSH, sshKey, sshAuthType, dirty, valid, selectedFavorite
    } = this.props;
    return (
      <form
        className="flex-row"
        role="form"
        onSubmit={handleSubmit(this.handleSubmit)}
      >
        <div className="form-panel right-padded flex-col flex--half">
          <span style={{ color: 'red', position: 'absolute', margin: '-25px auto' }}>{this.state.error}</span>
          <Field
            type="hidden"
            name="id"
            component="input"
          />
          <Field
            label="Connection name"
            name="connectionName"
            type="text"
            placeholder="Connection name"
            component={renderField}
          />
          <Field
            label="User"
            name="user"
            type="text"
            placeholder="Database user"
            component={renderField}
          />
          <Field
            label="Password"
            name="password"
            type="password"
            placeholder="Password"
            component={renderField}
          />
          <Field
            label="Address"
            name="address"
            type="text"
            placeholder="Server address"
            component={renderField}
          />
          <Field
            label="Database"
            name="database"
            type="text"
            placeholder="Database name"
            component={renderField}
          />
          <Field
            label="Port"
            name="port"
            type="text"
            placeholder="Server port"
            component={renderField}
          />
          <Field
            label="Use SSL connection"
            name="useSSL"
            type="checkbox"
            component={renderCheckbox}
          />
        </div>
        <div className="form-panel flex-col flex--half flex--s-between">
          <ReduxFormSSH
            sshKey={this.state.sshKey || sshKey}
            sshAuthType={sshAuthType} useSSH={useSSH}
            saveSSHKey={this.saveSSHKey}
          />
          <div className="flex-item--end full-width">
            <Field
              label="Connect via SSH"
              name="useSSH"
              type="checkbox"
              component={renderCheckbox}
            />
            <div className="btn-block flex-row flex--s-between">
              {selectedFavorite !== null &&
                <button
                  className="btn btn-empty flex-item--grow-1"
                  type="button"
                  onClick={this.handleRemove}
                >
                  Remove
                </button>
              }

              <button
                className="btn btn-empty flex-item--grow-1"
                type="button"
                disabled={
                  !(
                    (valid && dirty)
                    || ((this.state.sshKey !== null) && this.state.sshKey !== sshKey)
                  )
                }
                onClick={this.handleSave}
              >
                Save
              </button>

              <LaddaButton
                className="ladda-button btn btn-primary btn-last flex-item--grow-1"
                loading={submitting}
                type="submit"
              >
                {submitting ? 'Connecting' : 'Connect'}
              </LaddaButton>
            </div>
          </div>
        </div>
      </form>
    );
  }
}
