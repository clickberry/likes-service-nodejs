var cassandra = require('../lib/cassandra-odm');
var likesRelationTypeSchema = cassandra.Schema(
    {
        relationId: String,
        type: Number,
        created: cassandra.TimeUuid,
        userId: String
    });

likesRelationTypeSchema.methods.create = function (callback) {
    var query = this.getInsertQuery();

    LikesRelationType.client.execute(query, {prepare: true}, function (err) {
        if (err) {
            return callback(err);
        }

        callback();
    });
};

var LikesRelationType = module.exports = cassandra.model('likesRelationType', likesRelationTypeSchema);