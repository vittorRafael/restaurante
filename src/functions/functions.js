const { format } = require('date-fns')

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.substring(1);
}

function dateValidate(dateStr) {
  try {
      return format(new Date(dateStr), 'yyyy/MM/dd')
  } catch(error) {
      return null
  }
}


module.exports = {
  capitalizeFirstLetter,
  dateValidate
}