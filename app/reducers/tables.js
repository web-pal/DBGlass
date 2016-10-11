import * as types from '../constants/tablesConstants';

export default function tables(tablesDefault = [], action) {
  switch (action.type) {
    case types.GET_TABLES:
      return action.tables;
    case types.SET_CURRENT_TABLE:
      if (action.tableName) {
        tablesDefault.map((item) => {
          /* eslint no-param-reassign: [2, { "props": false }] */
          if (item.table_name === action.tableName) {
            window.localStorage.setItem('currentTable', action.tableName);
            item.isCurrent = true;
          } else {
            item.isCurrent = false;
          }
          return null;
        });
      }
      return tablesDefault.slice();
    case types.CHANGE_TABLE_NAME:
      tablesDefault.forEach((item) => {
        if (item.isCurrent) {
          window.localStorage.setItem('currentTable', action.newTableName);
          item.table_name = action.newTableName;
        }
      });
      return tablesDefault.slice();
    case types.CREATE_TABLE:
      tablesDefault.push({
        table_name: action.tableName,
        foreignKeys: [],
        isCurrent: false
      });
      return tablesDefault.slice();
    default:
      return tablesDefault;
  }
}

