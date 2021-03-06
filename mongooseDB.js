/**
 * Created by asistent on 13.05.2016.
 */

var mongoose = require('mongoose');
var config = require('./config');

mongoose.connect(config.get('mongoose:uri'));

var db = mongoose.connection;

db.on('error', function (err) {
    console.error('connection error:', err.message);
});
db.once('open', function callback() {
    console.info("Connected to DB!");
});

module.exports = mongoose;