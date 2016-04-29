var config = require('./config.json');

var aws = require('aws-sdk');
aws.config.update({
  region: config.region,
  accessKeyId: config.accessKeyId,
  secretAccessKey: config.secretAccessKey
});
aws.config.setPromisesDependency(require('q').Promise);

var docClient = new aws.DynamoDB.DocumentClient();

exports.handler = function(event, context) {
  var token = event.authorizationToken.split(" ");
  var username = token[0];
  var password = token[1];

  validate(username, password)
      .then(function(data){
        console.log(data);
        if(data){
          context.succeed(generatePolicy('user', 'Allow', event.methodArn));
        } else {
          context.succeed(generatePolicy('user', 'Deny', event.methodArn));
        }
      })
      .catch(function(err){
        context.fail("Unauthorized");
      });
};

var generatePolicy = function(principalId, effect, resource) {
  var authResponse = {};
  authResponse.principalId = principalId;
  if (effect && resource) {
    var policyDocument = {};
    policyDocument.Version = '2012-10-17'; // default version
    policyDocument.Statement = [];
    var statementOne = {};
    statementOne.Action = 'execute-api:Invoke'; // default action
    statementOne.Effect = effect;
    statementOne.Resource = resource;
    policyDocument.Statement[0] = statementOne;
    authResponse.policyDocument = policyDocument;
  }
  return authResponse;
};

function validate (username, password) {
  var tableName = "newsletter-users";

  var params = {
    TableName : tableName,
    ProjectionExpression  : "username, password",
    FilterExpression: "username = :username",
    ExpressionAttributeValues  : {":username": username}
  };

  return docClient.scan(params).promise()
    .then(function(data){
      if(data.Count == 0) {
        console.log("El usuario no existe");
        context.done("El usuario no existe");
      } else {
        return data.Items[0].password
      }
    })
    .then(function(pass){
      return password === pass;
    })
    .catch(function(err){
      // console.log(err);
      throw new Error(err);
    });
}
