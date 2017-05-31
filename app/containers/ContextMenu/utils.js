export const getValuesForModal = (contextMenuValues, actionType) => {
  const { elementType, elementName } = contextMenuValues;
  const values = {
    actionType,
    elementType,
    elementName,
  };
  return values;
};
