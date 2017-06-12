export const getValuesForModal = (contextMenuValues, actionType) => {
  const { selectedElementType, selectedElementName } = contextMenuValues;
  const values = {
    actionType,
    selectedElementType,
    selectedElementName,
  };
  return values;
};
