var loopback = require('loopback');
var boot = require('loopback-boot');
var path = require('path');


var app = module.exports = loopback();

// configure view handler
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// app.connector('dynamodb', path.join(__dirname, 'connectors/dynamodb'))
app.connector('dynamodb', require('../connectors/dynamodb-connector'))

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    console.log('Web server listening at: %s', app.get('url'));
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
