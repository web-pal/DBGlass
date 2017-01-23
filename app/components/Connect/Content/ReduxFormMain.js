import React, { Component, PropTypes } from 'react';
import { fromJS } from 'immutable';
import { Field, reduxForm, formValueSelector, SubmissionError } from 'redux-form/immutable';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import validate from './validateForm';

import getFavorites from '../../../selectors';

import * as CurrentTableActions from '../../../actions/currentTable';
import * as favoritesActions from '../../../actions/favorites';

import ReduxFormSSH from './ReduxFormSSH';
import LaddaButton from '../../Base/LaddaButton/LaddaButton';

import { renderField, renderCheckbox } from './InputComponents';

import { mixPanelTrack } from '../../../helpers';

class ReduxFormMain extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    dirty: PropTypes.bool.isRequired,
    valid: PropTypes.bool.isRequired,
    formValues: PropTypes.object.isRequired,
    useSSH: PropTypes.bool,
    sshKey: PropTypes.string,
    sshAuthType: PropTypes.string,
    connectDB: PropTypes.func.isRequired,
    selectedFavorite: PropTypes.string,
    favorites: PropTypes.object.isRequired,
    addFavorite: PropTypes.func.isRequired,
    setCurrent: PropTypes.func.isRequired,
    updateFavorite: PropTypes.func.isRequired,
    removeFavorite: PropTypes.func.isRequired
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
    const promise = new Promise(resolve => this.props.connectDB(data, (flag, err, sshError) => {
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
    const data = Object.assign({}, this.props.formValues, { privateKey: this.state.sshKey });
    if (data.id) {
      this.props.updateFavorite(data);
    } else {
      this.props.addFavorite(data, true);
    }
  };

  handleRemove = () => {
    mixPanelTrack('Remove favorite click');
    this.props.removeFavorite(this.props.formValues.id);
    this.props.setCurrent(null);
  };

  saveSSHKey = (sshKey) => {
    this.setState({ sshKey });
  };

  render() {
    const {
      handleSubmit, submitting, useSSH, sshKey, sshAuthType, dirty, valid, selectedFavorite
    } = this.props;
    console.log(this);
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

const selector = formValueSelector('connect');
const ReduxFormMainDecorated = reduxForm({
  form: 'connect',
  validate,
  enableReinitialize: true
})(ReduxFormMain);

function mapStateToProps(state) {
  const data = getFavorites(state.favorites);
  const initData = data.size > 0 && state.favorites.meta.get('selectedFavorite')
    ? data.find(
      item => item.get('id') === state.favorites.meta.get('selectedFavorite')
    )
    : fromJS(
      { port: 5432,
        address: 'localhost',
        sshPort: 22,
        sshAuthType: 'password',
        useSSL: true }
      );
  return {
    favorites: getFavorites(state.favorites),
    selectedFavorite: state.favorites.meta.get('selectedFavorite'),

    useSSH: selector(state, 'useSSH'),
    sshKey: selector(state, 'privateKey'),
    sshAuthType: selector(state, 'sshAuthType'),
    initialValues: initData,
    formValues: state.form.get('connect') && state.form.get('connect').get('values') ?
    state.form.get('connect').get('values').toObject() : {}
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...CurrentTableActions, ...favoritesActions }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ReduxFormMainDecorated);
