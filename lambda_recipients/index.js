// For development/testing purposes
"use strict";

var config = require('./config.json');
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
aws.config.setPromisesDependency(require('q').Promise);
var ses = new aws.SES({apiVersion: '2010-12-01'});

var docClient = new aws.DynamoDB.DocumentClient();

exports.handler = function( event, context ) {

  var operation = event.operation;

  switch (operation) {
    case 'create':
      var fullname = event.fullname;
      var address = event.address;

      var params = {
        TableName : "newsletter-recipient",
        ProjectionExpression  : "address, fullname, #token, verified, campaign",
        FilterExpression: "address = :address",
        ExpressionAttributeNames   : {"#token": "token"},
        ExpressionAttributeValues  : {":address": address}
      };

      var token = null;
      var verified = null;

      dynamoSCAN(params)
        .then(function(data){

          var users = data.Items;
          if(users.length > 0) {
            token = users[0].token;
            verified = users[0].verified;
            return "Ya existia";
          } else{
            token = randomObject();
            verified = "false";

            return "NO existia";
          }
        })
        .then(function(response){
          console.log(response);

          return {
            TableName: "newsletter-recipient",
            Item: {
              "token": token,
              "address": address,
              "campaign": "la-iguana",
              "verified": verified,
              "fullname": fullname
              // TODO: cambiar la campana
            }
          };
        })
        .then(function(params){
          return dynamoPUT(params)
        })
        .then(function(data){
          console.log(data);

          var messages = [{
            header: "Gracias por suscribirse",
            content: "Debe verificar su correo. Ingrese al siguiente link:",
            link: config.frontendURL + "#/verificar/" + token
          }];

          return SESsendEmail(address, null, "Gracias por suscribirse", messages);
        })
        .then(function (res) {
          console.log("res: ", res);
          context.done(null, res);
        })
        .catch(function(err){
          console.log("err: ", err);
          context.done(null, err);
        });
      break;
    case 'send':
      params = {
        TableName : "newsletter-recipient",
        ProjectionExpression  : "address, fullname, #token, verified, campaign",
        FilterExpression: "verified = :verified",
        ExpressionAttributeNames   : {"#token": "token"},
        ExpressionAttributeValues  : {":verified": "true"}
      };

        console.log("estoy en send");
      dynamoSCAN(params)
        .then(function(usersList){
            console.log(usersList);
          return Q.all(
            _.map(usersList.Items, function(user){
              return SESsendEmail(user.address, user.token, "Boletin Diario", event.content);
            })
          );
        })
        .then(function(response){
          console.log(response);
          context.done(null, {"msg": "Correos enviados"});
          // context.done(null, response);
        })
        .catch(function(err){
          console.log("error: ", error);
          context.done(err);
        });
      break;

    case 'verify':
          // TODO: Chequear que no tenga ya estatus true para evitar la carga
        params = {
          TableName : "newsletter-recipient",
          Key : { "token": event.token },
          UpdateExpression : "set verified = :T",
          ExpressionAttributeValues : { ":T": "true"}
        };

        dynamoUPDATE(params)
          .then(function(response){
            console.log("UpdateItem succeeded:", response);
            context.done(response);
          })
          .catch(function(err){
            console.error("Unable to update item. Error JSON:", err);
            context.done(null, err);
          });
        break;
    case 'unsuscribe':
      params = {
        TableName : "newsletter-recipient",
        Key : { "token": event.token }
      };

      dynamoDELETE(params)
          .then(function(response){
            console.log("DeleteItem succeeded:", response);
            context.done(response);
          })
          .catch(function(err){
            console.error("Unable to delete item. Error JSON:", err);
            context.done(null, err);
          });
      break;
    default:
      context.done(new Error('Unrecognized operation ' + operation));
  }
};

//TODO: abstraer logica de ses en un modulo aparte
//TODO: abstraer logica de dynamo en un modulo aparte

var SESsendEmail = function(address, token, subject, messages){
    console.log(address, subject, messages);
  return ses.sendEmail({
    Source: config.senderAddress,
    Destination: { ToAddresses: [ address ] },
    Message: {
      Subject: {
        Data: subject
      },
      Body: {
        Html: {
          // TODO: Mover esto al frontend
          Data: getHTML(messages, token)
        }
      }
    }
  }).promise()
};

var dynamoSCAN = function(params) {
  return docClient.scan(params).promise();
};

var dynamoPUT = function(params){
  return docClient.put(params).promise();
};

var dynamoUPDATE = function(params){
  return docClient.update(params).promise();
};

var dynamoDELETE = function(params){
  return docClient.delete(params).promise();
};

var getHTML = function(messages, token){
  var filePath = path.join(__dirname, './utils/emailTemplates/template.ejs');
  var template = fs.readFileSync(filePath, 'utf8');
  var unsuscriptionLink = token ? config.frontendURL + "#/unsuscribe/" + token : null;

  return ejs.render(template,{ messages: messages, unsuscriptionLink: unsuscriptionLink});
};

var randomObject = function() {
  return crypto.createHash('md5').update(Math.random().toString()).digest('hex').substring(0, 24);
};
