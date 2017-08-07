export const capitalizeFirstLetter = (string) => (
  string.charAt(0).toUpperCase() + string.slice(1)
);

// TODO: Refactor with switch
export const getTableValue = (value) => {
  const isNullValue = value === null
  ? 'null'
  : value;
  const isTrueValue = isNullValue === true
  ? 'true'
  : isNullValue;
  const isFalseValue = isTrueValue === false
    ? 'false'
    : isTrueValue;
  return isFalseValue;
};
