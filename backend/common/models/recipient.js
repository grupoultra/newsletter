var app = require('../../server/server');
var config = require('../../server/config.json');
var aws = require('aws-sdk');
// var credentials = new aws.SharedIniFileCredentials({profile: 'default'});
aws.config.update({
  region: 'us-west-2',
  accessKeyId: "AKIAIVYG2UJZJZWOOKLA",
  secretAccessKey: "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"
});
var ses = new aws.SES({apiVersion: '2010-12-01'});
var _ = require('lodash');
var Q = require('q');

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

  Recipient.send = function (subject, body, cb) {
    ses.listVerifiedEmailAddresses().promise()
    .then(function(data) {
      return data.VerifiedEmailAddresses
    })
    .then(function(emailsList){
      var from = 'alexis.ibarra@ultra.sur.top'

      return Q.all(
        _.map(emailsList, function(address){
          return ses.sendEmail({
            Source: from,
            Destination: { ToAddresses: [ address ] },
            Message: {
              Subject: {
                Data: subject
              },
              Body: {
                Text: {
                  Data: body,
                }
              }
            }
          }).promise()
        })
      );
    })
    .then(function(responses){
      cb(null, responses);
    })
    .catch(function(error){
      cb(error);
    });
  };


  Recipient.remoteMethod('send', {
    accepts: [
      {arg: 'subject', type: 'string' },
      {arg: 'body', type: 'string' },
    ],
    returns: {root: true, type: 'Object'},
    http: {path: '/send', verb: 'post'}
  });
};
