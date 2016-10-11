import React, { Component, PropTypes } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as CurrentTableActions from '../../../../actions/currentTable';

const propTypes = {
  children: PropTypes.array.isRequired,
  columnName: PropTypes.string.isRequired,
  removeColumn: PropTypes.func.isRequired,
  undoRemoveColumn: PropTypes.func.isRequired,
  tableName: PropTypes.string,
  adding: PropTypes.bool
};

class StructureRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rowClass: 'structure-row',
      isRemoving: false
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.structureEdited.length === 0) {
      this.setState({
        rowClass: 'structure-row',
        isRemoving: false
      });
    }
  }

  handleRemoveClick = () => {
    this.setState({
      rowClass: 'structure-row structure-row--removing',
      isRemoving: true
    });
    this.props.removeColumn(this.props.columnName);
  }

  handleUndoClick = () => {
    this.setState({
      rowClass: 'structure-row',
      isRemoving: false
    });
    this.props.undoRemoveColumn(
      this.props.columnName,
      this.props.tableName
    );
  }

  render() {
    /* eslint-disable max-len*/
    return (
      <tr
        className={this.state.rowClass}
        style={{ position: 'relative' }}
      >
        {this.props.children}
        <td style={{ textAlign: 'center' }}>
          {!this.state.isRemoving ?
            !this.props.adding && <img role="presentation" className="icon icon-minus structure-row__icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAC90lEQVRoQ+1aQVLbMBSVbO+bHRNW3KCwKw0zDbtOk07bE+CchOQEHCHhBGUGmOmuzrSZdkd6gnZF2h3s7aj/J7EnFrItyRYWHjTDALYk/6f3//vfkilpSKMNwUGegYiY/Pvu9QfmOPtwr8sYa1FK8e+kwbU5XLuDCwGhNGhffptW5RGlGVn0j7qEsRMwzNcyirEJjD1vX30PtMZvBmkD+ff+8ONy6ZyBEXtlDIjHIluusxztXP640JlPGcji7as94nljdB+dB0qMCUgYDtpffv6R6Jt0UQKCLETMHcOglspDVPsyQu5cGg1U2JEGArFwCgYNVY0q2X8IsTOSmUMKyKLXGWsHs4wVeX1ADNrXs0HRNIVAgAlkAdmos42AmVxvyAWyUibmfq4TQfxsh0af8mImEwiqE/O8G9OBLbtIKAA0DA+y1CwbSP/oq0GJlbWf7xeAix2LBguB2ORSvNFZLiYEAir1u6qMrbv0WeOwAti9nh3w9x8AWdVOhKBb2dyO+drsIZBeB4u4E5tRQJF6DrnF37ZRxAgIhP0NGEnZnvrH5iAXLG3KvVJALMnisu6QyvY8kABmeSM7U839puBeKEyrlgJy2+vc8K+nNRub+XhehnlGnkSgx+i2A14bCK8aVTEHcSq9mM9Aqlr1qubJZOS235lTQl9W9SCT8zDCfu1ezZJ9s2bKb5MSIiYY2yvf2GOzSxTsoSJ/JmOgaO7conEFpEFl/FNwr+IXK2TFZhnmZVdYNMYXbX4vUdp82AR9AL9tK+lTpfu2IORu0BHXm0Oh/6JIQR7lPiP3JAr3lTfo0DibXEx7yzReZUuyfblN7ARMnblFsPUjcuXCY4WamSlkIld+s4J3fQDqwgaeYQGAwHacyDdy9JYwsz4MnRiU5ikchvpGD0O3mVofjDrDql7EMGO7dDlUYUEqj8jmhs0HA772fjEEM4yd1PbBgAjoZicfi84urHCLZwtXHa6tP+GAn7LGV8qILHOm+0nLr2lDys7fGCD/AUjrP0LAyRgxAAAAAElFTkSuQmCC" width="25" height="25" onClick={this.handleRemoveClick} /> :
              <img role="presentation" className="icon icons8-Cancel-2-Filledi structure-row__icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAEoklEQVRoge2aT2jcRRTHJ9VUUSNYqBU9mGghh915k2Ut7UURpNaWqGCNKFUpoqkUws6bbENbbbv9o1YRRDwLFWrRaqwKFUQhFGOaZN5sjTUgJHrwYptoWxQ0XroesrFx981vf7/d3y/pIQ/mssy873x2Zt68mfkJsWRLdnXb2uGem5UzncqZ14HwJJCeBMIL84sinADCk4rwsLRmU/tgX8ti93vWSoVlYM0jkvATIJwBwlLEMgMW+5UznaIkmhaFQTl8Agh/qKPznmLOgjWbFwwARvJtkvDL+AAqisMvMsXeO5OFIP08EP6VGMSV8od0eksyENYUQnTgAjj8WFmzrWM0tyblcHVqCFfI73feAmP5W8GZddKZF4D0e0B4roavy4r0nlghlMN3aoielk5vSY0Xlof12XW865q07V0PFr+u4fvteCAI9waITEmLjzaqAQ4fAsKfAtbN7sYErNkMhJd5AT2ZHs6tahRiztoH+1ok4Ye+aVb3H5amHXcD4aWgYVeEO+MCEUIIURJNknC/R+8ijOTbIjsEa06FiTCK8HCsMEIIaXWfZ4p9FckRWP24p+O/8L+bXXHDKDJHOa3wU6wkmoBwjHEynR7OrZKEryWyICusfbCvBQh/ZrSKodIZafVG9p8g0/VfnQWCAYcPczpp27u+ZmNFeLyqscUhBpifxxbfiBNGEg4wU/lYYCMYy98IXApi9VNsfYuv8KOHL8cF4hmVP1sHCtd7GymX28A0On//QOFar1DCMFnqbgbCqSqNonnA24id+1Z/UEsMnD7Eh+Z4cqVyblaxHvUhfwOLn1d1xpptYcQU4UHPPrO3URDpzNZqv+aEH4Twx8oGHaO5NWEFk4JJF/EeZuqOB4H8Xtkg6iFHkjnAh2a9r16QTLFnJeNzKgjkn8oGWeq+IaowkM6zMIRv1gOSGi8sZ3zNRAKJcsZICqa8LUQCqZpaqSFcUQ+IEP5TpSTcH8nPSL6N8TMdBFK12JU1mXpBhBACnN7Hw5gD4X2YddEWOxt+9TONgMQBA4TbI4VfbkOUzrzbKIgQ/iOzIjwYAuQjJgr6N0RPinIuKEWJBqP3eEKzt1PlFGW6qk1QiuJLGqU1m+IAqQdGOfM0Uz84aZwVYk5mTBrfiEmLyMJY/db/KpZEE5A5y9Q9UlOkfDVTvTCt3hgnDFjzEr/P6Fev1MEnuTqhDlblo65jBCZT49tvWiiY1OiO24DwNyb4jIYWUM508gIhhjQqjMPdHi32okO53IZoAoSf1hsuo8MY7YGpXKv9kZ1Li3eB74KugUzWC0NmVw2Qix1ndGt9zgOvTM2xONdMpth3O/DXPyVo5Mp0zoIusRXhRLgIEmCzt5rPwuw7Iz8acV0z1XxWsOaUcvqxLHU3h/W5eqLnOmX1c559Yn6J51lhzkI+9JwHwiOzL1u5tZliz0pRKizLUnez+g7vkK43qwhfBIv9gSNQnk6xP/TMWTksV8X2BMqvgblUHNZxRreC058lBaHInEj8MXS+KcIHlcNv44PQ3yQ+CkEmi7n7gPB9qO+Dgb8VmaPg8N5FA6g0zycc8zfUS1fvJxxLtmRe+xcHzfe77l5OWgAAAABJRU5ErkJggg==" width="25" height="25" onClick={this.handleUndoClick} />}
        </td>
      </tr >
    );
    /* eslint-enable */
  }
}

StructureRow.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    tableName: state.currentTable.tableName,
    structureEdited: state.currentTable.structureEdited
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...CurrentTableActions }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(StructureRow);
