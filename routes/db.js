let db = require('diskdb');
db = db.connect('./DB/', ['users','booking']);

module.exports = db;