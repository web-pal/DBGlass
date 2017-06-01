import styled from 'styled-components';

export const Modal = styled.div`
  position: fixed;
  z-index: 9;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;

export const Backdrop = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: auto;
  background-color: #000000;
  opacity: 0.5;
`;

export const Container = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  outline: none;
`;

export const Window = styled.div`
  box-shadow: 0 5px 15px rgba(0,0,0,.5);
  border-radius: 25px;
`;

export const Content = styled.div`
  padding: 40px;
  background-color: #FFFFFF;
  border-radius: 14px;
`;
