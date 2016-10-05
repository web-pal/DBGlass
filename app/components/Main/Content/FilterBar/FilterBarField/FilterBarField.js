import React, { Component, PropTypes } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as Actions from '../../../../../actions/currentTable';

import TimePickerModal from '../../Modals/TimePickerModal/TimePickerModal';

const propTypes = {
  filter: PropTypes.object.isRequired,
  structureTable: PropTypes.object.isRequired,
  setFilter: PropTypes.func.isRequired,
  addFilter: PropTypes.func.isRequired,
  removeFilter: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  applyFilters: PropTypes.func.isRequired,
  stretch: PropTypes.bool
};

const charOptions = [
  <option key={1}>contains</option>,
  <option key={2}>does not contains</option>,
  <option key={3}>is exactly</option>,
  <option key={4}>is not exactly</option>,
  <option key={5}>begins with</option>,
  <option key={6}>ends with</option>
];

const numOptions = [
  <option key={7}>=</option>,
  <option key={9}>≠</option>,
  <option key={'a'}>{'<'}</option>,
  <option key={'b'}>{'>'}</option>,
  <option key={'c'}>≤</option>,
  <option key={'d'}>≥</option>
];

const boolOptions = [
  <option key={'e'}>is</option>
];


class FilterBarField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columnType: '',
      timePickerOpen: false
    };
  }

  onChange = e => {
    this.handleFilterChange(e.target.name, e.target.value);
  }

  handleFilterChange = (name, value) => {
    const { structureTable, index, setFilter, filter } = this.props;
    let newFilter = filter.set(name, value);

    let columnType = '';
    if (name !== 'value') {
      this.thirdInput.focus();
    }
    if (name === 'column') {
      const column = structureTable.find((item) => item.get('columnname') === value);
      if (column) {
        columnType = column.get('datatype');
      }
      this.setState({ columnType });
      switch (true) {
        case columnType.startsWith('int'):
          newFilter = newFilter.set('operator', '=');
          break;
        case columnType.startsWith('char'):
          newFilter = newFilter.set('operator', 'contains');
          break;
        case columnType.startsWith('text'):
          newFilter = newFilter.set('operator', 'contains');
          break;
        case columnType.startsWith('bool'):
          newFilter = newFilter.set('operator', 'is');
          newFilter = newFilter.set('value', 'True');
          break;
        case columnType.startsWith('time'):
          newFilter = newFilter.set('operator', '=');
          newFilter = newFilter.set('column', `${value}`);
          newFilter = newFilter.set('suffix', '::date');
          break;
        default:
          newFilter = newFilter.set('operator', '');
      }
    }
    setFilter(index, newFilter);
  }

  toggleTimePicker = () => {
    this.setState({
      timePickerOpen: !this.state.timePickerOpen
    });
  }

  handleTimePickerChange = value => {
    this.handleFilterChange('value', value);
  }

  render() {
    const { columnType, timePickerOpen } = this.state;
    const {
      index, structureTable,
      applyFilters, stretch,
      addFilter, removeFilter
    } = this.props;
    let filter = this.props.filter;
    let options = [...charOptions, ...numOptions, ...boolOptions];

    const thirdInputProps = {
      value: filter.get('value'),
      onChange: this.onChange,
      onKeyDown: e => {
        if (e.keyCode === 13) {
          applyFilters();
        }
      },
      className: 'form-control filter-element',
      ref: 'thirdInput',
      name: 'value'
    };

    let thirdInput = (
      <input type="text" {...thirdInputProps} />
    );

    switch (columnType.substr(0, 4)) {
      case 'char':
        options = [...charOptions];
        break;
      case 'text':
        options = [...charOptions];
        break;
      case 'bool':
        options = [...boolOptions];
        thirdInput = (
          <select {...thirdInputProps} >
            <option value="True">True</option>
            <option value="False">False</option>
          </select>
        );
        break;
      case 'inte':
        options = [...numOptions];
        thirdInput = (
          <input type="number" {...thirdInputProps} />
        );
        break;
      case 'time':
        options = [...numOptions];
        thirdInput = (
          <div className="relative">
            <input {...thirdInputProps} />
            <i className="fa fa-calendar" onClick={this.toggleTimePicker} />
          </div>
        );
        break;
      default:
        break;
    }

    if (!options.indexOf(filter.get('operator'))) {
      filter = filter.set('operator', options[0].props.children);
    }

    return (
      <div
        className={
          `form-group flex-row flex--s-between flex-item--grow-1 ${stretch ? 'stretched' : ''}`
        }
      >
        <div>
          <select
            value={filter.column}
            name="column"
            onChange={this.onChange}
            className="form-control filter-element"
            autoFocus
            onKeyDown={(e) => {
              if (e.keyCode === 13) {
                applyFilters();
              }
            }}
          >
            <option>Any column</option>
            <option disabled>──────</option>
            {
              structureTable.map((item, key) =>
                <option key={key} value={item.get('columnname')}>{item.get('columnname')}</option>
              )
            }
          </select>
        </div>

        <div>
          <select
            name="operator"
            ref={c => { this.operator = c; }}
            onChange={this.onChange}
            className="form-control filter-element"
            onKeyDown={(e) => {
              if (e.keyCode === 13) {
                applyFilters();
              }
            }}
          >
            {options.map(option => option)}
            <option disabled>──────</option>
            <option value="IS NULL">is NULL</option>
            <option value="IS NOT NULL">is not NULL</option>
          </select>
        </div>

        <div>
          {thirdInput}
        </div>

        {index > 0
          ? <button
            className="btn btn-link btn-big"
            onClick={() => removeFilter(index)}
          >
            <i className="fa fa-minus" />
          </button>
          : <button
            className="btn btn-link btn-big"
            onClick={addFilter}
          >
            <i className="fa fa-plus" />
          </button>
        }
        <TimePickerModal
          open={timePickerOpen}
          onClose={this.toggleTimePicker}
          onChange={this.handleTimePickerChange}
        />
      </div>
    );
  }
}

FilterBarField.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    structureTable: state.currentTable.structureTable
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(FilterBarField);
