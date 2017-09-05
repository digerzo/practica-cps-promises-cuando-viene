"use strict";

var Client = require('node-rest-client').Client;
var Promise = require('bluebird');


module.exports = function (url, parameters, timeout) {
    var client = new Client();
    return new Promise(function (resolve, reject) {
        client.get(url, {
            parameters: parameters
        }, function (data, incomingMessage) {
            if(incomingMessage.statusCode > 299){
                reject(data.toString());
            }
            resolve(data);
        });
    }).timeout(timeout);
};