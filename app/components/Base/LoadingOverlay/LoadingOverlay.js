import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

const propTypes = {
  isFetching: PropTypes.bool.isRequired
};


class LoadingOverlay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 1
    };
    this.runInterval = this.runInterval.bind(this);
    this.runInterval();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isFetching && !nextProps.isFetching) {
      clearInterval(this.intervalID);
      this.setState({ count: 1 });
    }

    if (!this.props.isFetching && nextProps.isFetching) {
      this.runInterval();
    }
  }

  runInterval() {
    this.intervalID = setInterval(() => {
      let count = this.state.count;
      count += 1;
      if (count === 4) {
        count = 1;
      }
      this.setState({ count });
    }, 400);
  }

  render() {
    const { isFetching } = this.props;
    return (
      <div
        className={isFetching ?
          'table-overlay table-overlay--unfaded table-overlay--fade-in' :
          'table-overlay table-overlay--faded table-overlay--fade-out'}
      >
        <span style={{ width: '300px' }}>
          L O A D I N G
          {Array.from(Array(this.state.count)).map((item, key) =>
            (<span key={key}>.</span>)
          )}
        </span>
      </div>
    );
  }
}


LoadingOverlay.propTypes = propTypes;

function mapStateToProps(store) {
  return {
    isFetching: store.currentTable.isFetching
  };
}

export default connect(mapStateToProps, null)(LoadingOverlay);
