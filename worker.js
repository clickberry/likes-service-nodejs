var debug = require('debug')('clickberry:likes:worker');

var config = require('./config');
require('clickberry-cassandra-odm').connect(config.get('cassandra:nodes'), config.get('cassandra:keyspace'));

var LikesType = require('./models/likes-relation-type');
var LikesUser = require('./models/likes-relation-user');
var LikeUserState = require('./models/likes-relation-user-state');


var Bus = require('./lib/bus-service');
var bus = new Bus();

bus.on('project-like', function (message) {
    var like = JSON.parse(message.body);
    debug('Catch message...');
    debug(like);
    var relationId = like.relationId;
    var userId = like.userId;
    var type = like.type;

    LikesUser.getFirst(relationId, userId, function (err, likeUser) {
        if (err) {
            debug(err);
            return message.requeue();
        }

        debug(likeUser);

        var likeState = new LikeUserState({
            relationId: likeUser.relationid,
            userId: likeUser.userid,
            type: type,
            timestamp: like.timestamp
        });
        likeState.update(function (err) {
            if (err) {
                debug(err);
                return message.requeue();
            }

            var likeType = new LikesType({
                relationId: likeUser.relationid,
                userId: likeUser.userid,
                created: likeUser.timestamp,
                type: type
            });

            likeType.create(function (err) {
                if (err) {
                    debug(err);
                    return message.requeue();
                }

                message.finish();
            });
        });
    });
});

debug('Listening for messages...');