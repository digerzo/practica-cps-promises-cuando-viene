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

function make_url(host, port) {
    return host + ':' + port;
}

var monitor = function () {

};
var get_timeout = require("./get");

app.route('/status').get(function (req, res) {
    res.json({status: 'status'})
});

app.route('/get_next_bus/').get(function (req, res) {

    get_timeout(journey_address + "/next_bus/"
        , {
            line_id: req.query.line_id,
            stop_id: req.query.stop_id
        }
        , 2000)
        .then()

});

app.route('/line_status/').get(function (req, res) {
    get_timeout(journey_address + "/line_status/"
        , {
            line_id: req.query.line_id
        }
        , 2000)
        .then();
});


var server = app.listen(port, function () {

    console.log("Initializing node in port " + server.address().port + "....");

    var suffix = 'Empezando servidor en el puerto ' + server.address().port;

    console.log(suffix);

    return server;
});
