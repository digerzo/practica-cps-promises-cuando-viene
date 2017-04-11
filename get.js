"use strict";

var client = require('node-rest-client').Client;

module.exports = function (url, timeout, callback) {
    var isTimedOut;

    setTimeout(function () {
        isTimedOut = true;
        callback(new Error("Connection timed out") );
        return;
    }, timeout);

    client.get(url, function (err, res, body) {
        if (isTimedOut) {
            return;
        }

        callback(err, body);
        return;
    });
};