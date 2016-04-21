var app = require('../../server/server');
var config = require('../../server/config.json');
var _ = require('lodash');
var Q = require('q');
var crypto = require('crypto');
var path = require('path');
var ejs = require('ejs'),
    fs = require('fs');

var aws = require('aws-sdk');
aws.config.update({
  region: config.region,
  accessKeyId: config.accessKeyId,
  secretAccessKey: config.secretAccessKey
});
var ses = new aws.SES({apiVersion: '2010-12-01'});

var from = config.senderAddress;

var randomObject = function() {
  return crypto.createHash('md5').update(Math.random().toString()).digest('hex').substring(0, 24);
}

var getHTML = function(messages){
  // var filePath = __dirname + './../../utils/emailTemplates/template.ejs';
  var filePath = path.join(__dirname, './../../utils/emailTemplates/template.ejs')
  var template = fs.readFileSync(filePath, 'utf8');
  return ejs.render(template,{ messages: messages});
};

module.exports = function(Recipient) {
  // Recipient.validatesUniquenessOf('address');

  Recipient.beforeRemote('create', function (context, recipient, next) {
    // TODO: Validar correo electronico
    // TODO: validar que no se esten creando tokens extra
    // console.log(context);
    context.args.data.token = randomObject();
    next(null, true);
  });

  Recipient.afterRemote('create', function (context, recipient, cb) {
    var params = {
      EmailAddress: recipient.address /* required */
    };

    var messages = [{
      header: "Gracias por suscribirse",
      content: "Debe verificar su correo. Ingrese al siguiente link:",
      link: "http://localhost:3000/verificar?token=" + recipient.token
    }];

    ses.sendEmail({
      Source: from,
      Destination: { ToAddresses: [ recipient.address ] },
      Message: {
        Subject: {
          Data: "Gracias por suscribirse"
        },
        Body: {
          Html: {
            // TODO: Mover esto al frontend
            Data: getHTML(messages)
          }
        }
      }
    }).promise()
        .then(function (res) {
          cb(null, res)
        })
        .catch(function(err){
          cb(err);
        });

    // TODO: Enviar respuesta desde el api para confirmar
    // TODO: Se deberia registrar el correo una sola vez. que hacemos con los duplicados?
  });

  Recipient.send = function (subject, content, cb) {
    app.models.Recipient.find()
    .then(function(usersList){
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
                  Html: {
                    Data: getHTML(content)
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
      {arg: 'content', type: '[object]' },
    ],
    returns: {root: true, type: 'Object'},
    http: {path: '/send', verb: 'post'}
  });

  // Recipient.disableRemoteMethod("create", true);
  Recipient.disableRemoteMethod("update", true);
  Recipient.disableRemoteMethod("upsert", true);
  Recipient.disableRemoteMethod("updateById", true);
  Recipient.disableRemoteMethod("updateAll", true);

  Recipient.disableRemoteMethod("find", true);
  Recipient.disableRemoteMethod("findById", true);
  Recipient.disableRemoteMethod("findOne", true);

  Recipient.disableRemoteMethod("deleteById", true);
  Recipient.disableRemoteMethod("destroyById", true);
  Recipient.disableRemoteMethod("removeById", true);

  Recipient.disableRemoteMethod("confirm", true);
  Recipient.disableRemoteMethod("count", true);
  Recipient.disableRemoteMethod("exists", true);
  Recipient.disableRemoteMethod("createChangeStream", true);
  Recipient.disableRemoteMethod("createChangeStream_0", true);
  Recipient.prototype.updateAttributes.shared = true;
  Recipient.disableRemoteMethod('updateAttributes', false);
};
