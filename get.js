//
// Pequeña biblioteca para realizar pedidos HTTP
//
var Client = require('node-rest-client').Client;
var Promise = require('bluebird');

module.exports = function (url, parameters, timeout, cont) {
  var client = new Client();
  client.get(url, {
    parameters: parameters
  }, function (data, incomingMessage) {
    if(incomingMessage.statusCode > 299){
      throw new Error(data.toString());
    }
    cont(data);
  });
};
