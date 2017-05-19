import { createSelector } from 'reselect';

export const getTablesMap = ({ tables }) => tables.byId;
export const getTablesByIds = ({ tables }) => tables.allIds;

export const getTables = createSelector(
  [getTablesByIds, getTablesMap],
  (ids, map) => ids.map(id => map[id]),
);
