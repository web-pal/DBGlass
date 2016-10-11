import React, { Component, PropTypes } from 'react';
import { TransitionView, Calendar } from 'react-date-picker';
import { Editor, EditorState, ContentState, RichUtils } from 'draft-js';
import { stateToMarkdown } from 'draft-js-export-markdown';
import { stateFromMarkdown } from 'draft-js-import-markdown';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import 'react-date-picker/index.css';

import * as Actions from '../../../../../actions/currentTable';
import Modal from '../Modal';
import ConstraintEditor from './ConstraintEditor/ConstraintEditor';
import InlineStyleControls from './InlineStyleControls';
import BlockStyleControls from './BlockStyleControls';

const styleMap = {
  CODE: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 2,
  },
};

function getBlockStyle(block) {
  switch (block.getType()) {
    case 'blockquote': return 'RichEditor-blockquote';
    default: return null;
  }
}

const propTypes = {
  editor: PropTypes.object.isRequired,
  editing: PropTypes.object.isRequired,
  toggleEditor: PropTypes.func.isRequired,
  structureTable: PropTypes.object.isRequired,
  saveEdits: PropTypes.func.isRequired,
  stopEditing: PropTypes.func.isRequired
};

class EditorModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      markdownDisabled: true
    };
  }

  componentWillReceiveProps() {
    const { editing } = this.props;
    if (Object.keys(editing).length) {
      const prevValue = typeof editing.prevValue !== 'undefined' ?
        String(editing.prevValue) : '';
      this.setState({
        editorState:
          EditorState.createWithContent(ContentState.createFromText(prevValue)),
        value: editing.prevValue
      });
    }
  }

  onTab = (e) => {
    const maxDepth = 4;
    this.handleDraftChange(RichUtils.onTab(e, this.state.editorState, maxDepth));
  }

  toggleMarkdown = () => {
    if (this.state.markdownDisabled) {
      this.setState({
        editorState:
          EditorState.createWithContent(stateFromMarkdown(this.state.value)),
        markdownDisabled: false
      });
    } else {
      this.setState({
        editorState:
          EditorState.createWithContent(ContentState.createFromText(this.state.value)),
        markdownDisabled: true
      });
    }
  }

  handleKeyCommand = (command) => {
    const { editorState } = this.state;
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.handleDraftChange(newState);
      return true;
    }
    return false;
  }

  toggleBlockType = (blockType) => {
    this.handleDraftChange(
      RichUtils.toggleBlockType(
        this.state.editorState,
        blockType
      )
    );
  }

  toggleInlineStyle = (inlineStyle) => {
    this.handleDraftChange(
      RichUtils.toggleInlineStyle(
        this.state.editorState,
        inlineStyle
      )
    );
  }

  handleClose = () => {
    this.props.toggleEditor(null, false);
  }

  handleCalendarChange = (dateString) => {
    this.setState({
      value: dateString
    });
  }

  handleDraftChange = (editorState) => {
    const value = editorState.getCurrentContent();
    this.setState({ editorState, value: stateToMarkdown(value) });
  }

  saveEdit = () => {
    const { editing } = this.props;
    if (this.state.value && this.state.value !== editing.prevValue) {
      const value = this.state.value;
      const { columnKey, rowIndex } = editing;
      this.props.saveEdits(
        columnKey,
        rowIndex,
        value
      );
    } else {
      this.revertEdit();
    }
    this.props.toggleEditor(null, false);
  }

  revertEdit = () => {
    this.props.stopEditing();
  }

  render() {
    const { editor, editing, structureTable } = this.props;
    const { editorState, markdownDisabled } = this.state;
    let className = 'RichEditor-editor';
    const contentState = editorState.getCurrentContent();
    if (!contentState.hasText()) {
      if (contentState.getBlockMap().first().getType() !== 'unstyled') {
        className += ' RichEditor-hidePlaceholder';
      }
    }
    let editorComponent = (
      <div className="RichEditor-root">
        <BlockStyleControls
          editorState={editorState}
          disabled={markdownDisabled}
          onToggle={this.toggleBlockType}
        />
        <InlineStyleControls
          editorState={editorState}
          disabled={markdownDisabled}
          onToggle={this.toggleInlineStyle}
        />
        <div className={className} onClick={this.focus}>
          <Editor
            blockStyleFn={getBlockStyle}
            customStyleMap={styleMap}
            editorState={this.state.editorState}
            onChange={this.handleDraftChange}
            onTab={this.onTab}
            spellCheck
          />
        </div>
        <div className="flex-row">
          <div className="sshSwitch flex-row flex-item--end">
            <label
              className="checkbox-label"
              htmlFor="markdownSwitch"
            >
               Markdown
              <br /><br />
            </label>
            <label className="switch" htmlFor="toggleMarkdown">
              <input
                type="checkbox"
                onClick={this.toggleMarkdown}
                checked={!markdownDisabled}
              />
              <div className="slider round" />
            </label>
          </div>
          <button className="btn btn-primary" onClick={this.saveEdit}>Save</button>
        </div>
      </div>
    );
    if (Object.keys(editing).length) {
      const editRow =
        structureTable.filter(column => column.get('columnname') === editing.columnKey).get(0);
      switch (editRow && editRow.get('datatype').substr(0, 4)) {
        case 'time':
          editorComponent = (
            <div className="flex-col time-picker">
              <TransitionView>
                <Calendar
                  dateFormat="YYYY-MM-DD HH:mm:ss"
                  defaultDate={editing.prevValue}
                  onChange={dateString =>
                      this.handleCalendarChange(dateString)}
                />
              </TransitionView>
              <button
                className="btn btn-primary"
                onClick={this.saveEdit}
              >
                Apply
              </button>
            </div>
          );
          break;
        default:
          break;
      }
    }
    return editor.get('open') && (
      <Modal onClose={this.handleClose} className="editor">
        <div className="flex-col">
          {editor.get('type') === 'cell' ? editorComponent : <ConstraintEditor />}
        </div>
      </Modal>
    );
  }
}


EditorModal.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    editor: state.currentTable.editor,
    editing: state.currentTable.editing,
    structureTable: state.currentTable.structureTable,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...Actions }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(EditorModal);
