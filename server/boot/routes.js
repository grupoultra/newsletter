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
    var params = {
      EmailAddress: 'ar.ibarrasalas@gmail.com' /* required */
    };

    var ses = new aws.SES({apiVersion: '2010-12-01'});

    ses.verifyEmailAddress(params, function(err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else     console.log(data);           // successful response
    });
  });

    // var User = app.models.SmartseaUser;

  //login page
  // app.get('/', function (res, res) {
  //   var credentials = dsConfig.emailDs.transports[0].auth;
  //   res.render('login', {
  //     email: credentials.user,
  //     password: credentials.pass
  //   });
  // });


  // app.get('/enviar', function (req, res) {

  //   // aws.config.credentials = credentials;
  //   // load aws config
  //   // aws.config.loadFromPath('./config.json');
  //   // aws.config.update({accessKeyId: process.env.accessKeyId, secretAccessKey: process.env.secretAccessKey, region: process.env.region});
  //   aws.config.update({region: 'us-west-2'});

  //   // load AWS SES
  //   var ses = new aws.SES({apiVersion: '2010-12-01'});

  //   // send to list
  //   var to = ['alexis.ibarra@ultra.sur.top', 'ar.ibarrasalas@gmail.com']

  //   // this must relate to a verified SES account
  //   var from = 'alexis.ibarra@ultra.sur.top'


  //   // this sends the email
  //   // @todo - add HTML version
  //   ses.sendEmail( {
  //      Source: from,
  //      Destination: { ToAddresses: to },
  //      Message: {
  //          Subject: {
  //             Data: 'A Message To You Rudy'
  //          },
  //          Body: {
  //              Text: {
  //                  Data: 'Stop your messing around',
  //              }
  //           }
  //      }
  //   }
  //   , function(err, data) {
  //       if(err) throw err
  //           console.log('Email sent:');
  //           console.log(data);
  //           res.render('verified_en');
  //    });

  // });
  // app.get('/verificado', function (req, res) {
  //   res.render('verified_es');
  // });

  // //log a user in
  // app.post('/login', function (req, res) {
  //   User.login({
  //     email: req.body.email,
  //     password: req.body.password
  //   }, 'user', function (err, token) {
  //     if (err) {
  //       res.render('response', {
  //         title: 'Login failed',
  //         content: err,
  //         redirectTo: '/',
  //         redirectToLinkText: 'Try again'
  //       });
  //       return;
  //     }

  //     res.render('home', {
  //       email: req.body.email,
  //       accessToken: token.id
  //     });
  //   });
  // });

  // //log a user out
  // app.get('/logout', function (req, res, next) {
  //   if (!req.accessToken) return res.sendStatus(401);
  //   User.logout(req.accessToken.id, function (err) {
  //     if (err) return next(err);
  //     res.redirect('/');
  //   });
  // });

  // ////send an email with instructions to reset an existing user's password
  // //app.post('/request-password-reset', function(req, res, next) {
  // //  User.resetPassword({
  // //    email: req.query.email
  // //  }, function(err) {
  // //    if (err) return res.status(401).send(err);
  // //
  // //    res.render('response', {
  // //      title: 'Password reset requested',
  // //      content: 'Check your email for further instructions',
  // //      redirectTo: '/',
  // //      redirectToLinkText: 'Log in'
  // //    });
  // //  });
  // //});

  // //show password reset form
  // app.get('/reset-password', function (req, res, next) {
  //   if (!req.accessToken) return res.sendStatus(401);
  //   var language = req.query.lang || 'es';
  //   options = _.extend({"accessToken": req.accessToken.id, "lang": language}, translations[language]);
  //   res.render('password-reset', options);
  // });

  // //reset the user's pasword
  // app.post('/reset-password', function (req, res, next) {
  //   var language = req.query.lang || 'es';
  //   if (!req.accessToken) return res.sendStatus(401);

  //   //verify passwords match
  //   if (!req.body.password
  //     || !req.body.confirmation
  //     || req.body.password !== req.body.confirmation) {
  //     return res.sendStatus(400, new Error('Passwords do not match'));
  //   }

  //   User.findById(req.accessToken.userId, function (err, user) {
  //     if (err) return res.sendStatus(404);

  //     var newPassword = req.body.password;

  //     user.updateAttribute('password', newPassword, function (err, user) {
  //       if (err) return res.sendStatus(404);
  //       console.log('> password reset processed successfully');

  //       //Invalidates AccessToken.
  //       app.models.AccessToken.remove({id: req.accessToken.id})
  //         .then(function (res) {
  //           console.log("token deleted successfully");
  //         });
  //       res.render('response', translations[language]);
  //     });
  //   });
  // });
};
