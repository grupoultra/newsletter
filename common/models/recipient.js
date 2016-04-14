var app = require('../../server/server');
var config = require('../../server/config.json');
var aws = require('aws-sdk');
var credentials = new aws.SharedIniFileCredentials({profile: 'default'});
aws.config.update({region: 'us-west-2'});
var ses = new aws.SES({apiVersion: '2010-12-01'});

module.exports = function(Recipient) {
  Recipient.afterRemote('create', function (context, recipient, next) {
    var params = {
      EmailAddress: recipient.address /* required */
    };

    ses.verifyEmailAddress(params, function(err, data) {
      if (err){
        console.log(err, err.stack); // an error occurred
        next(err);
        return
      }
      console.log(data);           // successful response
      next(null);
    });
  });
};
