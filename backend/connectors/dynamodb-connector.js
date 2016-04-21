var Connector = require('loopback-connector').Connector;
var config = require('../server/config.json');
var aws = require('aws-sdk');
var _ = require('lodash');


aws.config.update({
    region: config.region,
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey
});

var dynamodb = new aws.DynamoDB();
var docClient = new aws.DynamoDB.DocumentClient();
// On top of your script, or whatever



/**
 * Initialize the DynamoDB connector for the given data source
 * @param {DataSource} dataSource The data source instance
 * @param {Function} [callback] The callback function
 */
exports.initialize = function initializeDataSource(dataSource, callback) {

    var s = dataSource.settings;

    dataSource.connector = new DynamoDB(s, dataSource);
};


/**
 * The constructor for DynamoDB connector
 * @param {Object} settings The settings object
 * @param {DataSource} dataSource The data source instance
 * @constructor
 */
function DynamoDB(settings, dataSource) {
    Connector.call(this, 'dynamodb', settings);
    this.dataSource = dataSource;
}

DynamoDB.prototype.update = function updateAll(model, where, data, options, cb){

    var params = { TableName: "newsletter-" + model.toLowerCase()};

    if(model === "Recipient") {
        params.Key = { "token": where.token};
        params.UpdateExpression = "set verified = :T";
        params.ExpressionAttributeValues = { ":T": true};
    }

    docClient.update(params, function(err, data) {
        if (err) {
            cb(err);
            // console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            cb(null, data);
            // console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
        }
    });
};

/**
 * Create a new model instance
 */
DynamoDB.prototype.create = function (model, data, cb) {
    var params = { TableName: "newsletter-" + model.toLowerCase()};

    if(model === "Recipient") {
        params.Item = {
            "token": data.token,
            "address": data.address,
            "campaign": "new-prueba",
            "verified": data.verified,
            "fullname": data.fullname
            // TODO cambiar la campana
        };
    } else {
        params.Item = {
            "username": data.username,
            "email": data.email,
            "password": data.password
            // TODO cambiar la campana
        };
    }

    docClient.put(params, function(err, data) {
        if (err) {
            cb(err);
        } else {
            cb(null, data);
        }
    });
};


/**
 * Find all model instances
 */
DynamoDB.prototype.all = function (model, filter, options, cb) {
    var params = { TableName: "newsletter-" + model.toLowerCase()};

    if(model === "Recipient") {

        params.ProjectionExpression = "address, fullname, #token, verified, campaign, email";
        params.ExpressionAttributeNames = {"#token": "token"};

        if (filter.verified) {
            params["FilterExpression"] = "verified = :verified";
            params["ExpressionAttributeValues"][":verified"] = filter.verified;
        }
    }

    docClient.scan(params, function(err, data) {
        if (err) {
            console.error("Error JSON:", JSON.stringify(err, null, 2));
            cb(err);
        } else {
            // console.log("USers en el conector: ", data.Items);
            cb(null, data.Items);
        }
    });
};
//
// /**
//  * Save a model instance
//  */
// DynamoDB.prototype.save = function (model, data, cb) {
//
//     console.log(model, data);
//     // callback(err, err ? null);
// };
