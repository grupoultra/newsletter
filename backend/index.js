
exports.handler = function(event, context, callback) {
    var server = require('./server/server.js');

    console.log("entre");
    server.run();
}