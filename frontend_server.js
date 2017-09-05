var colored_console = require('./colored_console.js');
var r = require('./request_wrapper.js');
var Promise = require('bluebird');

var host = 'http://localhost';
var port = 3000;
var supervisor_port = 4040;
var journey_port = 3002;

var address = make_url(host, port);

var journey_address = make_url(host, journey_port);
var supervisor_address = make_url(host, supervisor_port);

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var SupervisorClient = require('./node_supervisor_client');

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
        .then(function (body) {
            res.json(body);
        })
        .catch(Promise.TimeoutError, function (e) {
            res.send(e.toString());
        });

});

app.route('/line_status/').get(function (req, res) {
    var response = res;

    get_timeout(journey_address + "/line_status/"
        , {
            line_id: req.query.line_id
        }
        , 2000)
        .then(function (body) {
            response.json({'status': body.status});
        })
        .catch(function(err){
            response.send("Line: " + req.query.line_id + " does not exist.");
        });
});


//
// Heartbeat

app.route('/heartbeat').get(function (req, res) {
    res.json({status: 'ok'})
});


var server = app.listen(port, function () {

    colored_console.log_info("Initializing node in port " + server.address().port + "....");
    var supervisorClient = new SupervisorClient(address, monitor);

    var suffix = 'Empezando servidor en el puerto ' + server.address().port;

    console.log(suffix);
    supervisorClient.register().finally(function () {
        if (!supervisorClient.isOnline()) {
            console.log('Trabajando sin supervisor por ahora...')
        } else {
            console.log('Trabajando con el supervisor...')
        }

    });

    return server;
});
