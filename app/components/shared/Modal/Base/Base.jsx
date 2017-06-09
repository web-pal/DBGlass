import React from 'react';

import {
  Modal,
  Backdrop,
  Container,
  Window,
  Content,
} from './styled';

type Props = {
  onHide: () => void,
  children: React.Element
};

const Base = ({ children, onHide }: Props) =>
  <Modal>
    <Backdrop onClick={onHide} />
    <Container>
      <Window>
        <Content>
          {children}
        </Content>
      </Window>
    </Container>
  </Modal>;

export default Base;
