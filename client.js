var express = require('express');
var http = require('http');
var app = express();

var host = 'http://localhost';
var server = 3000;
var client_port = process.env.PORT || 5000;

var address = make_url(host, server);

var Client = require('node-rest-client').Client;
var client = new Client();

var server = app.listen(client_port, server_listening); //continuation

function make_url(host, port) {
    return host + ':' + port;
}

function server_listening() {
    console.log(('Un cliente se creo escuchando en el puerto ' + client_port).magenta);
    connect();
}

function connect() {
    console.log(('Estableciendo conexion con el servidor ' + address + '.').grey);
    repeat_call()
}


function repeat_call() {
    setInterval(produce, 10000, 'Obteniendo el status del proximo colectivo');
}

function produce(status) {
    console.log(status);
    client.get(address + '/get_next_bus', {
        parameters: {
            line_id: 1,
            stop_id: 1
        }
    }, function(){ console.log('Se envio la solicitud al servidor')});
}