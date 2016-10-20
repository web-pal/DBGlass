import React, { PropTypes, Component } from 'react';
import { Field } from 'redux-form/immutable';
import { renderRadio, renderField } from './InputComponents';

import { mixPanelTrack } from '../../../helpers';

const os = require('electron').remote.require('os');
const path = require('electron').remote.require('path');
const { dialog } = require('electron').remote;

const propTypes = {
  sshAuthType: PropTypes.string,
  useSSH: PropTypes.bool,
  sshKey: PropTypes.string,
  saveSSHKey: PropTypes.func.isRequired
};

class ReduxFormSSH extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: os.homedir().split('/').slice(-1)[0]
    };
  }

  showDialog = (event) => {
    mixPanelTrack('Show SSH key dialog');
    event.preventDefault();
    const defaultPath = path.join(os.homedir(), '.ssh');
    dialog.showOpenDialog({ defaultPath, properties: ['openFile'] }, (file) => {
      this.props.saveSSHKey(file[0]);
    });
  }

  render() {
    const { sshAuthType, useSSH, sshKey } = this.props;

    return (
      <div className="form-panel">
        <div className="ssh-align">
          <Field
            label="SSH user"
            name="sshUser"
            type="text"
            placeholder="SSH user"
            disabled={!useSSH}
            component={renderField}
          />
          <div className="form-group radio-group flex-row flex--end">
            <Field
              label="Use password"
              name="sshAuthType"
              type="radio"
              value="password"
              disabled={!useSSH}
              component={renderRadio}
            />
            <Field
              label="Use key"
              name="sshAuthType"
              type="radio"
              value="key"
              className="btn-last"
              disabled={!useSSH}
              component={renderRadio}
            />
          </div>
        </div>
        {sshAuthType === 'password' ?
          <div>
            <div className="flex-row">
              <Field
                label="SSH password"
                name="sshPassword"
                type="password"
                placeholder="SSH password"
                disabled={!useSSH}
                component={renderField}
              />
              <Field
                label="SSH port"
                name="sshPort"
                type="text"
                placeholder="SSH port"
                disabled={!useSSH}
                component={renderField}
              />
            </div>
            <Field
              label="SSH server"
              name="sshServer"
              type="text"
              placeholder="SSH server"
              disabled={!useSSH}
              component={renderField}
            />
          </div>
          :
            <div>
              <Field
                label="SSH server"
                name="sshServer"
                type="text"
                placeholder="SSH server"
                disabled={!useSSH}
                component={renderField}
              />
              <Field
                label="SSH port"
                name="sshPort"
                type="text"
                placeholder="SSH port"
                disabled={!useSSH}
                component={renderField}
              />
              <div className="flex-row">
                <Field
                  label="Key password"
                  name="passphrase"
                  type="password"
                  placeholder="Key password"
                  disabled={!useSSH}
                  component={renderField}
                />
                <label
                  htmlFor="privateKey"
                  onClick={this.showDialog}
                  className="btn btn-primary flex-item--end form-control-height"
                >
                  <Field
                    name="privateKey"
                    type="file"
                    className="hide"
                    component="input"
                  />
                  Private key
                </label>
              </div>
              <span>{sshKey}</span>
            </div>
        }
      </div>
    );
  }
}

ReduxFormSSH.propTypes = propTypes;
export default ReduxFormSSH;
