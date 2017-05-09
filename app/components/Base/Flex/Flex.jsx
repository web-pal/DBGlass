import React, { PropTypes } from 'react';

const Flex =
  ({
    children,
    row,
    column,
    wrap,
    centered,
    className,
    spaceBetween,
    spaceAround,
    onClick,
    style,
    id,
  }) =>
    <div
      className={[
        `${row && 'flex-row'}`,
        `${column && 'flex-column'}`,
        `${wrap && 'wrap'}`,
        `${centered && 'flex--center'}`,
        `${spaceBetween && 'flex--s-between'}`,
        `${spaceAround && 'flex--s-around'}`,
        `${className}`,
      ].filter(cls => cls !== 'false').join(' ')}
      onClick={onClick}
      style={style}
      id={id}
    >
      {children}
    </div>;

Flex.propTypes = {
  row: PropTypes.bool,
  column: PropTypes.bool,
  children: PropTypes.node.isRequired,
  wrap: PropTypes.bool,
  style: PropTypes.object,
  id: PropTypes.string,
  spaceBetween: PropTypes.bool,
  spaceAround: PropTypes.bool,
  className: PropTypes.string,
  centered: PropTypes.bool,
  onClick: PropTypes.func,
};

Flex.defaultProps = {
  row: false,
  column: false,
  wrap: false,
  style: {},
  id: '',
  spaceBetween: false,
  spaceAround: false,
  className: '',
  centered: false,
  onClick: null,
};


export default Flex;
