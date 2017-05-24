import React from 'react';

import spinner from '../../../assets/images/spinner.svg';

import {
  LButton,
  Spinner,
} from './styled';


const LaddaButton = ({ isLoading }) => ( // eslint-disable-line
  <LButton>
    <span>
      Connect
    </span>
    <Spinner src={spinner} alt="alt" isLooading={isLoading} />
  </LButton>
);

export default LaddaButton;
