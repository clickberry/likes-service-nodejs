var cassandra = require('../lib/cassandra-odm');
var likesRelationUserStateSchema = cassandra.Schema(
    {
        relationId: String,
        userId: String,
        type: Number,
        timestamp: cassandra.TimeUuid
    }
);

likesRelationUserStateSchema.methods.update = function (callback) {
    var query = this.getInsertQuery();

    LikesRelationUserState.client.execute(query, {prepare: true}, function (err) {
        if (err) {
            return callback(err);
        }

        callback();
    });
};

var LikesRelationUserState = module.exports = cassandra.model('likesRelationUserState', likesRelationUserStateSchema);