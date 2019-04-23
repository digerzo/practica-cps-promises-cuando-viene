var request = require('request-promise');
var Promise = require('bluebird');

var send = function (uri, params, method) {
  return request({
    method: method,
    json: true,
    uri: uri,
    body: params
  })
};

var connectionRefuseCode = 'ECONNREFUSED';

var wrapper = {
  get: function (uri, queryString) {
    return request({
      uri: uri,
      qs: queryString
    })
  },
  post: function (uri, params) {
    return send(uri, params, 'POST')
  },
  put: function (uri, params) {
    return send(uri, params, 'PUT')
  },
  delete: function (uri, params) {
    return send(uri, params, 'DELETE')
  },
  heartbeat: function (uri, time) {
    var deferred = Promise.pending();
    var delayedBeat = function () {
      setTimeout(sendBeat, time)
    };

    var sendBeat = function () {
      this.get(uri).then(delayedBeat).catch(function (error) {
        if (error.cause.code === connectionRefuseCode) {
          deferred.reject('Connection refused')
        } else {
          delayedBeat()
        }
      })
    }.bind(this);

    delayedBeat();

    return deferred.promise
  },

  isConnectionRefused: function (response) {
    return response && response.name === 'RequestError' &&
    response.cause && response.cause.code === connectionRefuseCode
  }
};

module.exports = wrapper;
