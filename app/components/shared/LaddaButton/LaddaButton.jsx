import React from 'react';

import spinner from '../../../assets/images/spinner.svg';

import {
  LButton,
  Spinner,
  Title,
} from './styled';


const LaddaButton = ({ isLoading }) => ( // eslint-disable-line
  <LButton>
    <Title>
      Connect
    </Title>
    <Spinner src={spinner} alt="alt" isLooading={isLoading} />
  </LButton>
);

export default LaddaButton;
