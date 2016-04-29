"use strict";
var config = require('./config.json');

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
  // TODO: funcion para cifrar contrasena
  // TODO: funcion para descifrar contrasena
  // TODO: crear usuario
  // TODO: validar usuario
    var operation = event.operation;

    switch (operation) {
        case 'create':
            var tableName = "newsletter-users";

            var params = {
                TableName : tableName,
                ProjectionExpression  : "username",
                FilterExpression: "username = :username",
                ExpressionAttributeValues  : {":username": event.username}
            };

            dynamoSCAN(params)
                .then(function(data){
                    var users = data.Items;
                    if(users.length > 0) {
                        console.log("El usuario ya existe");
                        context.done("El usuario ya existe");
                    } else {
                        return event.password;
                    }
                })
                .then(function(hashedPassword) {
                    return {
                        TableName: tableName,
                        Item: {
                            "username": event.username,
                            "email": event.email,
                            "password": hashedPassword
                        }
                    }
                })
                .then(function(params){
                    return dynamoPUT(params)
                })
                .then(function(data) {
                    console.log(data);
                    context.done(null, data);
                })
                .catch(function(err){
                    console.log("error: ", err.errorMessage[0]);
                    context.done(err);
                });
            break;
        case 'login':
            var tableName = "newsletter-users";

            var params = {
                TableName : tableName,
                ProjectionExpression  : "username, password",
                FilterExpression: "username = :username",
                ExpressionAttributeValues  : {":username": event.username}
            };

            dynamoSCAN(params)
                .then(function(data){
                    if(data.Count === 0) {
                        console.log("El usuario no existe");
                        context.fail("El usuario no existe");
                    } else {
                        console.log(data);
                        return data.Items[0].password
                    }
                })
                .then(function(pass){
                    var id = event.username + " " + pass;
                    if (pass === event.password){
                        console.log("id: ", id);
                        context.done(null, {"id": id});
                    } else{
                        context.fail("Datos erroneos");
                    }
                })
                .catch(function(err){
                    console.log(err);
                    context.fail(err);
                });
            break;
        default:
            context.done(new Error('Unrecognized operation ' + operation));
    }
};

var encrypt = function (myPlaintextPassword) {
    var saltRounds = 10;
    return bcrypt.hash(myPlaintextPassword, saltRounds);
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


