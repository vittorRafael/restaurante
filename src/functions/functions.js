const { format } = require('date-fns');

function capitalizeFirstLetter(string) {
  if (string) {
    return string.charAt(0).toUpperCase() + string.substring(1);
  } else {
    return false;
  }
}

function dateValidate(dateStr) {
  try {
    return format(new Date(dateStr), 'yyyy/MM/dd');
  } catch (error) {
    return null;
  }
}

module.exports = {
  capitalizeFirstLetter,
  dateValidate,
};
