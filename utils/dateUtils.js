const { format } = require('date-fns');

const formatDate = (date) => {
  return format(new Date(date), 'dd-MMM-yy');
};

module.exports = {
  formatDate,
};