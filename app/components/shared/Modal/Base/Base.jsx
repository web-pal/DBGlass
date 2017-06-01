import React, { Component } from 'react';

import {
  Modal,
  Backdrop,
  Container,
  Window,
  Content,
} from './styled';

type Props = {
  onHide: () => void,
  children: object
};

class Base extends Component {
  props: Props;

  render() {
    const { onHide, children } = this.props;
    return (
      <Modal>
        <Backdrop onClick={onHide} />
        <Container>
          <Window>
            <Content>
              { children }
            </Content>
          </Window>
        </Container>
      </Modal>
    );
  }
}

export default Base;
