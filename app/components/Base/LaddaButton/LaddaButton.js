import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

const laddaButton = require('ladda/dist/ladda.min');

const propTypes = {
  loading: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element
  ])
};


class LaddaButton extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  componentDidMount() {
    this.laddaButton = laddaButton.create(this.node);
  }

  componentWillReceiveProps(nextProps) {
    if (!this.laddaButton) {
      return;
    }

    if (!nextProps.loading && nextProps.disabled) {
      this.laddaButton.stop();
      this.laddaButton.disable();
    }

    if (nextProps.loading && !this.laddaButton.isLoading()) {
      this.laddaButton.start();
    } else if (!nextProps.loading && this.laddaButton.isLoading()) {
      this.laddaButton.stop();
    }

    if (typeof nextProps.progress !== 'undefined') {
      this.laddaButton.setProgress(nextProps.progress);
    }
  }

  componentWillUnmount() {
    if (this.laddaButton.remove) {
      this.laddaButton.remove();
    }
  }

  render() {
    const { children, ...laddaProps } = this.props;

    return (
      <button {...laddaProps} ref={(c) => { this.node = c; }}>
        <span className="ladda-label">
          {children}
        </span>
        <span className="ladda-spinner" />
      </button>
    );
  }
}

LaddaButton.propTypes = propTypes;

export default LaddaButton;
