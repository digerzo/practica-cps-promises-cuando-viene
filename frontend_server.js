//
// Este es el servidor que recibe los pedidos clientes y los redirige al
// servicio de viajes.
//
var r = require('./request_wrapper.js');
var Promise = require('bluebird');

var host = 'http://localhost';
var port = 3000;
var journey_port = 3002;

var address = make_url(host, port);

var journey_address = make_url(host, journey_port);

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var get = require("./get");


// Rutas
function make_url(host, port) {
  return host + ':' + port;
}

app.route('/get_next_bus/').get(function (req, res) {
  get(journey_address + "/next_bus/", {
    line_id: req.query.line_id,
    stop_id: req.query.stop_id
  }, 2000).then();
});

app.route('/line_status/').get(function (req, res) {
  get(journey_address + "/line_status/", {
    line_id: req.query.line_id
  }, 2000).then();
});

// Programa Principal

var server = app.listen(port, function () {
  console.log("Initializing node in port " + server.address().port + "....");
  var suffix = 'Empezando servidor en el puerto ' + server.address().port;
  console.log(suffix);
  return server;
});
