// var dsConfig = require('../datasources.json');
// var translations = require('../translations/reset-password-translations.json');
// var _ = require('lodash');
// var crypto = require('crypto');

module.exports = function (app) {
  var aws = require('aws-sdk');
  var credentials = new aws.SharedIniFileCredentials({profile: 'default'});
  aws.config.update({region: 'us-west-2'});

  //verified
  app.get('/enviar', function (req, res) {

    // load AWS SES
    var ses = new aws.SES({apiVersion: '2010-12-01'});

    // send to list
    var to = ['alexis.ibarra@ultra.sur.top', 'ar.ibarrasalas@gmail.com']

    // this must relate to a verified SES account
    var from = 'alexis.ibarra@ultra.sur.top'

    ses.sendEmail( {
       Source: from,
       Destination: { ToAddresses: to },
       Message: {
           Subject: {
              Data: 'A Message To You Rudy'
           },
           Body: {
               Text: {
                   Data: 'Stop your messing around',
               }
            }
       }
    }
    , function(err, data) {
        if(err) throw err
            console.log('Email sent:');
            console.log(data);
            res.render('verified_en');
     });
  });

  app.get('/listar', function (req, res) {
    // load AWS SES
    var ses = new aws.SES({apiVersion: '2010-12-01'});

    ses.listVerifiedEmailAddresses(function(err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else     console.log(data);           // successful response
    });
  });

  app.get('/verificar', function (req, res) {
      app.models.Recipient.update({ token: req.query.token }, { "verified": true})
          .then(function (response) {
              console.log(response);
              res.render('verified_es');
          })
          .catch(function(err){
              console.log(err);
          });
  });
};
