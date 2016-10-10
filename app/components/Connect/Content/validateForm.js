import {
  createValidator,
  composeValidators,
  combineValidators,
  isRequired,
  isNumeric
} from 'revalidate';

function ifUseSSH(validators) {
  return createValidator(
    () => (value, allValues) => {
      if (allValues.useSSH) {
        return validators(value);
      }
      return null;
    },
    ''
  );
}

const validate = combineValidators({
  connectionName: isRequired('Connection name'),
  user: isRequired('User'),
  address: isRequired('Address'),
  database: isRequired('Database'),
  port: composeValidators(
    isRequired('Port'),
    isNumeric('Port')
  )(),
  sshUser: ifUseSSH(isRequired('SSH user'))(),
  sshServer: ifUseSSH(isRequired('SSH server'))(),
  sshPort: ifUseSSH(composeValidators(
    isRequired('SSH port'),
    isNumeric('SSH port')
  )())()
}, true);

export default validate;
