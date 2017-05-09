import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

const ConnectSidebar = ({}) =>
  <Flex row>
    <h1>123</h1>
  </Flex>;

ConnectSidebar.propTypes = {

};

function mapStateToProps({}) {
  return {
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ConnectSidebar);
