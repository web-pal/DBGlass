import styled from 'styled-components';

export const SwitcherWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 250px;
  width: 297px;
  background-color: #f0f0f0;
  box-shadow: 1px 2px 13px 0.00px rgba(0, 0, 0, 0.17);
  z-index: 4;
  border-radius: 3px;
  transition: left .3s ease-out;
  display: block;
`;

export const TitleWrapper = styled.div`
  width: 100%;
  border-bottom: 1px solid lightgray;
`;

export const Title = styled.strong`
  display: inline-block;
  font: 16px Harmonia Sans;
  padding:  32px 10px 18px 35px;
  height: 10px;
`;

export const Favourites = styled.ul`
  list-style: none;
  padding-left: 20px;
  padding-right: 20px;
`;

export const Favorite = styled.li`
  color: #989898;
  cursor: pointer;
  font-size: 14px;
  padding: 10px 15px;
  font-weight: 100;

  &:hover {
    color: #10a78a;
    font-weight: 400;
  }
`;

export const Close = styled.i`
  margin:  32px 10px 18px 35px;
  float: right;
  cursor: pointer;
`;

export const MenuButton = styled.button`
  height: 36px;
  font: 400 12px / 35px Harmonia Sans;
  font-size: 14px;
  cursor: pointer;
  color: #10a78a;
  background-color: transparent;
  border: 1px solid rgba(16, 167, 138, 0.4);
  border-radius: 4px;
  display: block;
  margin: 0 auto;
  margin-bottom: 25px;
`;
