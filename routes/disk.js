var diskdb = require('diskdb');
diskdb = diskdb.connect('./DB', ['general']);
module.exports = diskdb;