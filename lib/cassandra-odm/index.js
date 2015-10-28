var cassandra = require('cassandra-driver');

var Schema = require('./schema');
var Model = require('./model');

var _client;

exports.connect = function (contactPoints, keyspace) {
    var points = contactPoints.split(',');
    _client = new cassandra.Client({contactPoints: points, keyspace: keyspace});
};

exports.model = function (tableName, schema) {
    return Model(tableName, schema, _client);
};

exports.Schema = Schema;
exports.TimeUuid = cassandra.types.TimeUuid;


