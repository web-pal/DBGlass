import React from 'react';

import spinner from '../../../assets/images/spinner.svg';

import {
  Button,
} from '../styled';

import {
  Spinner,
} from './styled';


const LaddaButton = ({ isLoading }) => ( // eslint-disable-line
  <Button>
    <span>
      connect
    </span>
    <Spinner src={spinner} alt="alt" isLooading={isLoading} />
  </Button>
);

export default LaddaButton;
