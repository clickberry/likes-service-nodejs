//var events = require('events');
//var util = require('util');
//var nsq = require('nsqjs');
//var config = require('../config');
//
//function Bus(options) {
//    var bus = this;
//
//    bus._options = options;
//    events.EventEmitter.call(this);
//
//    // Stub for development
//    if (config.get('environment') === 'development' && config.get('nsqd:disable') === 'disable') {
//        bus._bus = {
//            publish: function (topic, message, callback) {
//                console.log('topic: ' + topic);
//                console.log(message);
//                callback()
//            }
//        };
//        console.warn('NSQ is not using! Please change env ENVIRONMENT.');
//        return;
//    }
//
//    // connect to the Bus
//    var busClient = new nsq.Writer(config.get('nsqd:address'), parseInt(config.get('nsqd:port'), 10));
//    bus._bus = busClient;
//    busClient.connect();
//    busClient.on('ready', function () {
//        //bus._bus = busClient;
//        console.log('ServiceBus is started.');
//    });
//    busClient.on('error', function (err) {
//        console.log(err);
//    });
//}
//
//util.inherits(Bus, events.EventEmitter);
//
//Bus.prototype.publishSample = function (message, callback) {
//    if (!callback) {
//        callback = function () {}
//    }
//
//    this._bus.publish('topic-name', message, function (err) {
//        if (err) return callback(err);
//        callback();
//    });
//};
//
//module.exports = Bus;


var events = require('events');
var util = require('util');
var nsq = require('nsqjs');
var config = require('../config');

function Bus() {
    var bus = this;
    events.EventEmitter.call(this);

    var addresses = config.get('nsqd:addresses');

    var projectLikesReader = new nsq.Reader('likes-signal', 'project-likes', {lookupdHTTPAddresses: addresses});
    projectLikesReader.connect();
    projectLikesReader.on('message', function (message) {
        bus.emit('project-like', message);
    });
}

util.inherits(Bus, events.EventEmitter);

module.exports = Bus;