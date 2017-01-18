// Favorites action types
export const FILL_FAVORITES = 'favorites/FILL_FAVORITES';
export const ADD_FAVORITE = 'favorites/ADD_FAVORITE';
export const UPDATE_FAVORITE = 'favorites/UPDATE_FAVORITE';
export const REMOVE_FAVORITE = 'favorites/REMOVE_FAVORITE';
export const TOGGLE_FAV_SWITCHER = 'favorites/TOGGLE_FAV_SWITCHER';
export const SET_SELECTED_FAVORITE = 'favorites/SET_SELECTED_FAVORITE';

// Tables action types
export const GET_TABLES = 'tables/GET_TABLES';
export const SET_CURRENT_TABLE = 'tables/SET_CURRENT_TABLE';
export const CHANGE_TABLE_NAME = 'tables/CHANGE_TABLE_NAME';
export const CREATE_TABLE = 'tables/CREATE_TABLE';
export const CLEAR_TABLES = 'tables/CLEAR_TABLES';
export const SEARCH_TABLES = 'tables/SEARCH_TABLES';

// Current table action types
// INITIALIZE
export const CONNECT = 'currentTable/CONNECT';
export const DROP_CONNECTION = 'currentTable/DROP_CONNECTION';
// CREATE
export const ADD_COLUMN = 'currentTable/ADD_COLUMN';
export const INSERT_ROW = 'currentTable/INSERT_ROW';
export const CLONE_ROW = 'currentTable/CLONE_ROW';
// READ
export const GET_FOREIGN_TABLE = 'currentTable/GET_FOREIGN_TABLE';
export const GET_REFERENCES = 'currentTable/GET_REFERENCES';
export const GET_UPDATED_CONTENT = 'currentTable/GET_UPDATED_CONTENT';
export const GET_TABLE_CONTENT = 'currentTable/GET_TABLE_CONTENT';
export const GET_TABLE_CONSTRAINTS = 'currentTable/GET_TABLE_CONSTRAINTS';
export const GET_TABLE_STRUCTURE = 'currentTable/GET_TABLE_STRUCTURE';
export const GET_PRIMARY_KEYS = 'currentTable/GET_PRIMARY_KEYS';
export const ADD_FILTER = 'currentTable/ADD_FILTER';
export const SET_FILTER = 'currentTable/SET_FILTER';
export const TOGGLE_FILTER = 'currentTable/TOGGLE_FILTER';
export const REMOVE_FILTER = 'currentTable/REMOVE_FILTER';
export const CLEAR_FILTER = 'currentTable/CLEAR_FILTER';
export const APPLY_FILTERS = 'currentTable/APPLY_FILTERS';
export const CHANGE_VIEW_MODE = 'currentTable/CHANGE_VIEW_MODE';
export const SET_SORT = 'currentTable/SET_SORT';
// UPDATE
export const ADD_CONSTRAINT = 'currentTable/ADD_CONSTRAINT';
export const SAVE_CONSTRAINT = 'currentTable/SAVE_CONSTRAINT';
export const EDIT_CELL = 'currentTable/EDIT_CELL';
export const EDIT_STRUCTURE_ROW = 'currentTable/EDIT_STRUCTURE_ROW';
export const EDIT_TABLE_NAME = 'currentTable/EDIT_TABLE_NAME';
export const STOP_EDITING = 'currentTable/STOP_EDITING';
export const UNDO_REMOVE_COLUMN = 'currentTable/UNDO_REMOVE_COLUMN';
export const UNDO_EDIT = 'currentTable/UNDO_EDIT';
export const UNDO_EDITS = 'currentTable/UNDO_EDITS';
export const SAVE_EDITS = 'currentTable/SAVE_EDITS';
export const SAVE_TABLE_NAME_EDITS = 'currentTable/SAVE_TABLE_NAME_EDITS';
export const SAVE_STRUCTURE_EDITS = 'currentTable/SAVE_STRUCTURE_EDITS';
export const SAVE_COLUMN = 'currentTable/SAVE_COLUMN';
// DELETE
export const REMOVE_COLUMN = 'currentTable/REMOVE_COLUMN';
export const DROP_CONSTRAINT = 'currentTable/DROP_CONSTRAINT';
export const DELETE_ROW = 'currentTable/DELETE_ROW';
// UTILITY
export const OPEN_FOREIGN_MODAL = 'currentTable/OPEN_FOREIGN_MODAL';
export const SELECT_NEXT_ROW = 'currentTable/SELECT_NEXT_ROW';
export const STRUCTURE_INIT_STATE = 'currentTable/STRUCTURE_INIT_STATE';
export const STOP_FETCHING = 'currentTable/STOP_FETCHING';
export const START_FETCHING = 'currentTable/START_FETCHING';
export const CATCH_ERROR = 'currentTable/CATCH_ERROR';
export const CLOSE_ERRORS_MODAL = 'currentTable/CLOSE_ERRORS_MODAL';
export const CLOSE_FOREIGN_TABLE = 'currentTable/CLOSE_FOREIGN_TABLE';
export const VIEW_QUERIES = 'currentTable/VIEW_QUERIES';
export const RELOAD = 'currentTable/RELOAD';
export const REFRESH_TABLE = 'currentTable/REFRESH_TABLE';
export const STOP_REFRESH = 'currentTable/STOP_REFRESH';
export const TOGGLE_CONFIRMATION_MODAL = 'currentTable/TOGGLE_CONFIRMATION_MODAL';
export const TOGGLE_CONTEXT_MENU = 'currentTable/TOGGLE_CONTEXT_MENU';
export const TOGGLE_EDITOR = 'currentTable/TOGGLE_EDITOR';
export const TOGGLE_ROW_HIGHLIGHT = 'currentTable/TOGGLE_ROW_HIGHLIGHT';
export const INPUT_CHANGE = 'currentTable/INPUT_CHANGE';

export const RESET_STATE = 'currentTable/RESET_STATE';
export const CLEAR_TABLE_NAME = 'currentTable/CLEAR_TABLE_NAME';

