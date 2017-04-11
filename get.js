"use strict";

var Client = require('node-rest-client').Client;

var client = new Client();

var args = {
    parameters: { arg1: "hello", arg2: "world" },
    headers: { "test-header": "client http" },
    requestConfig: {
        timeout: 1000, //request timeout in milliseconds
        noDelay: true, //Enable/disable the Nagle algorithm
        keepAlive: true, //Enable/disable keep-alive functionalityidle socket.
        keepAliveDelay: 1000 //and optionally set the initial delay before the first keepalive probe is sent
    },
    responseConfig: {
        timeout: 1000 //response timeout
    }
};

module.exports = function (url, timeout, callback) {
    var isTimedOut;

    setTimeout(function () {
        isTimedOut = true;
        callback(new Error("Connection timed out"));
        return;
    }, timeout);

    client.get(url, args, function (data, response) {
        if (isTimedOut) {
            return;
        }

        callback(data, response);
        return;
    });
};