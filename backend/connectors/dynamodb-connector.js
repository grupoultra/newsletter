var Connector = require('loopback-connector').Connector;


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
    Connector.call(this, 'cloudinary', settings);
    this.dataSource = dataSource;
}

/**
 * Create a new model instance
 */
DynamoDB.prototype.create = function (model, data, callback) {
    console.log(model, data);
    // callback(err, err ? null);

};

/**
 * Save a model instance
 */
DynamoDB.prototype.save = function (model, data, callback) {
    console.log(model, data);
    // callback(err, err ? null);
};
