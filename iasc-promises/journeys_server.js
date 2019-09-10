//
// Este es el servidor con los recorridos
//

var r = require('./request_wrapper.js');
var schedule = require('node-schedule');
var host = 'http://localhost';
var port = 3002;
var Promise = require('bluebird');

var address = make_url(host, port);

var express = require('express');
var app = express();
var bodyParser = require('body-parser');

// Estado (simulado)

var lines = {
    1: {'line_desc': 'Linea 1', 'status': 1},
    2: {'line_desc': 'Linea 2', 'status': 1},
    3: {'line_desc': 'Linea 3', 'status': 1}
};

var stops = {
    1: {'line': 1, 'expected': 0},
    2: {'line': 1, 'expected': 0},
    3: {'line': 2, 'expected': 0},
    5: {'line': 1, 'expected': 0},
    7: {'line': 3, 'expected': 0},
    9: {'line': 2, 'expected': 0}
};


// Rutas

function make_url(host, port) {
    return host + ':' + port;
}

app.route('/line_status').get(function (req, res) {
    var line_id = req.query.line_id;

    var line_status = lines[line_id]['status'];
    res.json({status: line_status})
});

app.route('/next_bus').get(function (req, res) {
    var line_id = req.query.line_id;
    var stop_id = req.query.stop_id;

    new Promise(function (resolve, reject) {
        setTimeout(function () {
            if (stops[stop_id] != undefined && stops[stop_id]['line'] == line_id) {
                res.json({next_bus_time: stops[stop_id]['expected']})
            } else {
                res.json({error: "Invalid stop or bus line"})
            }
        }, 0);
    }).then();

});

app.route('/status').get(function (req, res) {
    res.json({status: 'online'})
});

// Tareas programadas

//Cada 55 segundos actualizar el estado de las lineas
schedule.scheduleJob('*/55 * * * * *', function () {
    console.log("Novedades del estado de las lineas");

    for (var line in lines) {
        var rand = Math.random();
        lines[line]['status'] = ((rand > 0.5) ? 1 : 0)
    }

    console.log("Actualizacion del estado de las lineas finalizado.")
});

var last_update = new Date();

//Cada 30 segundos actualizar el estado de las estaciones
schedule.scheduleJob('*/30 * * * * *', function () {
    console.log("Novedades de las estaciones");

    for (var stop in stops) {
        var _stop = stops[stop];
        var _now = new Date();

        var _diff = _now - last_update;

        _stop['expected'] = _stop['expected'] - _diff;

        if (_stop['expected'] < 0) {
            _stop['expected'] = 360000 * Math.random()
        }

        last_update = _now
    }
    console.log("Actualizacion del estado de las estaciones finalizado.")
});

// Programa Principal

var server = app.listen(port, function () {
    console.log("Servidor de Recorridos. v.0.5");
    console.log('Empezando servidor de viajes en el puerto ' + server.address().port);
    return server;
});
