const moment = require('moment');
moment.locale('es');
module.exports =
{
  formatDate: (date, format) => moment(date).format(format)
}