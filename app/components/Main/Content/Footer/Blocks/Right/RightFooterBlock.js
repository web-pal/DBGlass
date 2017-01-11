import React, { Component, PropTypes } from 'react';
import { Button, OverlayTrigger, Popover } from 'react-bootstrap';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../../../../../../actions/currentTable';
import * as settings from '../../../../../../settings';

const propTypes = {
  currentPage: PropTypes.number.isRequired,
  isContent: PropTypes.bool.isRequired,
  maxRow: PropTypes.number.isRequired,
  order: PropTypes.array.isRequired,
  tableName: PropTypes.string,
  getTableContent: PropTypes.func.isRequired,
  filters: PropTypes.object.isRequired
};

class RightFooterBlock extends Component {
  paginate = (side) => {
    const { order, tableName, maxRow, filters } = this.props;
    let page = this.props.currentPage;
    const maxPage = Math.ceil(maxRow / settings.OFFSET);
    if (maxPage >= page) {
      page += side === 'next' ? 1 : -1;
      const params = {
        page,
        order,
        filters,
        tableName
      };
      this.props.getTableContent(params);
      document.getElementById('wrapper').scrollTop = 0;
    }
  }

  showPage = () => {
    const close = this.trigger;
    close.hide();
    const { order, filters, tableName, maxRow } = this.props;
    const page = Number(this.pageInput.value);
    const maxPage = Math.ceil(maxRow / settings.OFFSET);
    if (page <= maxPage && page > 0) {
      const params = {
        page,
        order,
        tableName,
        filters
      };
      this.props.getTableContent(params);
      document.getElementById('wrapper').scrollTop = 0;
    }
  }

  render() {
    const { currentPage, isContent, maxRow } = this.props;
    const maxPage = Math.ceil(maxRow / settings.OFFSET);
    return (
      <div className="btn-group flex-item--end">
        <button
          disabled={currentPage === 1 || !isContent}
          onClick={() => this.paginate('prev')}
          className="btn btn-link"
        >
          <i className="fa fa-chevron-left" />
        </button>
        <OverlayTrigger
          ref={(c) => { this.trigger = c; }}
          disabled={maxPage < 2 || !isContent}
          trigger="click"
          rootClose
          placement="top"
          overlay={
            <Popover id="popover">
              <input
                type="text"
                size="8"
                placeholder={currentPage}
                ref={(c) => { this.pageInput = c; }}
              />
              <button
                className="btn btn-link"
                onClick={this.showPage}
              >
                Go
              </button>
            </Popover>
          }
        >
          <Button
            bsStyle="default"
            disabled={currentPage === maxPage || !isContent}
          >
            Page {currentPage}/{maxPage}
          </Button>
        </OverlayTrigger>
        <button
          disabled={currentPage === maxPage || !isContent}
          onClick={() => this.paginate('next')}
          className="btn btn-link"
        >
          <i className="fa fa-chevron-right" />
        </button>
      </div>
    );
  }
}

RightFooterBlock.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    currentPage: state.currentTable.page,
    maxRow: state.currentTable.totalCount,
    isContent: state.currentTable.isContent,
    order: state.currentTable.order,
    tableName: state.currentTable.tableName,
    filters: state.currentTable.filters
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...Actions }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(RightFooterBlock);
