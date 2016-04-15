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
  Recipient.beforeRemote('create', function (context, recipient, next) {
    // TODO: Validar correo electronico
    context.args.verified = false;
    next(null, true);
  });

  Recipient.afterRemote('create', function (context, recipient, cb) {
    var params = {
      EmailAddress: recipient.address /* required */
    };

    var from = 'alexis.ibarra@ultra.sur.top';

    ses.sendEmail({
      Source: from,
      Destination: { ToAddresses: [ recipient.address ] },
      Message: {
        Subject: {
          Data: "Gracias por suscribirse"
        },
        Body: {
          Text: {
            // TODO: Mover esto al frontend
            Data: "Hola, debe verificar su correo. Ingrese al siguiente link: <a href=\"http://localhost:3000/verificar?id=" + recipient.id + "\"> Verificar </a> ",
          }
        }
      }
    }).promise()
        .then(function (res) {
          cb(null, {"response": "Correo enviado"})
        })
        .catch(function(err){
          cb(err);
        });

    // TODO: Enviar respuesta desde el api para confirmar
    // TODO: Se deberia registrar el correo una sola vez. que hacemos con los duplicados?
  });

  Recipient.send = function (subject, content, cb) {
    app.models.Recipient.find({'where': {verified: true}})
    .then(function(usersList){
      var from = 'alexis.ibarra@ultra.sur.top';

      return Q.all(
        _.map(usersList, function(user){
          return ses.sendEmail({
            Source: from,
            Destination: { ToAddresses: [ user.address ] },
            Message: {
              Subject: {
                Data: subject
              },
              Body: {
                Text: {
                  Data: content
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

  Recipient.verify = function (id, cb){
    app.models.Recipient.update({ id: id }, { "verified": true})
        .then(function (res) {
          cb(null, {"Response": "model updated"});
        })
  };

  Recipient.remoteMethod('send', {
    accepts: [
      {arg: 'subject', type: 'string' },
      {arg: 'content', type: 'string' },
    ],
    returns: {root: true, type: 'Object'},
    http: {path: '/send', verb: 'post'}
  });

  Recipient.remoteMethod('verify', {
    accepts: [
      {arg: 'id', type: 'string' }
    ],
    returns: {root: true, type: 'Object'},
    http: {path: '/verify', verb: 'get'}
  });
};
