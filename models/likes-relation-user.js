var cassandra = require('../lib/cassandra-odm');
var likesRelationUserSchema = cassandra.Schema(
    {
        relationId: String,
        userId: String,
        timestamp: cassandra.TimeUuid,
        type: Number
    });

likesRelationUserSchema.methods.create = function (callback) {
    this.timestamp = cassandra.TimeUuid.now();

    var query = this.getInsertQuery();

    LikesRelationUser.client.execute(query, {prepare: true}, function (err) {
        if (err) {
            return callback(err);
        }

        callback();
    });
};

likesRelationUserSchema.statics.getFirst = function (relationId, userId, callback) {
    var query = LikesRelationUser.getSelectQuery()
        .where({
            relationId: relationId,
            userId: userId
        })
        .orderBy({
            userId: 'asc',
            timestamp: 'asc'
        })
        .limit(1)
        .toQueryString();

    LikesRelationUser.client.execute(query, {prepare: true}, function (err, likes) {
        if (err) {
            return callback(err);
        }

        var like = likes.rows[0] || null;
        callback(null, like);
    });
};

var LikesRelationUser = module.exports = cassandra.model('likesRelationUser', likesRelationUserSchema);