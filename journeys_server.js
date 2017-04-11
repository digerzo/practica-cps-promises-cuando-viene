//Este es el servidor con los recorridos
var colored_console = require('./colored_console.js')
var r = require('./request_wrapper.js')

var host = 'http://localhost';
var port = 3002;
var supervisor_port = 4040;

var address = make_url(host, port);

var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var SupervisorClient = require('./node_supervisor_client');

colored_console.log_info("Servidor de Recorridos. v.0.5");

//State

var lines = {1: {'line_desc': 'Linea 1', 'status': 1},
    2: {'line_desc': 'Linea 2', 'status': 1},
    3: {'line_desc': 'Linea 3', 'status': 1}}

var stops = {1: {'line': 1, 'expected': 0},
    2: {'line': 1, 'expected': 0},
    3: {'line': 2, 'expected': 0},
    5: {'line': 1, 'expected': 0},
    7: {'line': 3, 'expected': 0},
    9: {'line': 2, 'expected': 0}}

app.route('/line_status').get(function (req, res) {
    var line_id = req.body.line_id

    line_status = lines[line_id]['status']
    res.json({status: line_status})
});

app.route('/next_bus').get(function (req, res) {
    var line_id = req.body.line_id
    var stop_id = req.body.stop_id

    //Esto es una espera de como máximo de 5 segundos..... emula la demora de este servicio... Cambiar esto a no bloqueante en lo posible...
    const end = Date.now() + (5000 * Math.random());
    while (Date.now() < end) {
    }

    //TODO: Mejorar esto....
    if (stops[stop_id] != undefined) {
        if (stops[stop_id]['line'] == line_id) {
            res.json({next_bus_time: stops[stop_id]['expected']})
        }
    } else {
        res.json({error: "Invalid stop or bus line"})
    }
})

app.route('/status').get(function (req, res) {
    res.json({status: 'online'})
});


//
// Heartbeat

app.route('/heartbeat').get(function (req, res) {
    res.json({status: 'ok'})
});

//Cada 55 segundos actualizar el estado de las lineas
var j = schedule.scheduleJob('*/55 * * * * *', function () {
    colored_console.log_info("Novedades del estado de las lineas")

    for (var line in lines) {
        rand = Math.random();
        var new_status = ((rand > 0.5) ? 1 : 0)
        lines[line]['status'] = new_status
    }

    colored_console.log_info("Actualizacion del estado de las lineas finalizado.")
});

var last_update = new Date();

//Cada 30 segundos actualizar el estado de las estaciones
var j = schedule.scheduleJob('*/30 * * * * *', function () {
    colored_console.log_info("Novedades de las estaciones")

    for (var stop in stops) {
        _stop = stops[stop];
        _now = new Date();

        _diff = _now - last_update

        _stop['expected'] = _stop['expected'] - _diff

        if (_stop['expected'] < 0) {
            _stop['expected'] = 360000 * Math.random()
        }

        last_update = _now
    }
    colored_console.log_info("Actualizacion del estado de las estaciones finalizado.")
})


var server = app.listen(port, function () {
    supervisorClient = new SupervisorClient(address, function () {
    })

    var suffix = 'Empezando servidor de viajes en el puerto ' + server.address().port

    console.log(suffix)
    supervisorClient.register().finally(function () {
        if (!supervisorClient.isOnline()) {
            console.log('Trabajando sin supervisor por ahora...')
        } else {
            console.log('Trabajando con el supervisor...')
        }

    })

    return server;
});
