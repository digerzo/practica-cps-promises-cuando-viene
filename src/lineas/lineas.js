const express = require('express');
const fs = require('fs');
const { SERVICIOS } = require('../config');
const { healthCheck } = require('../middleware.js');
const { actualizarUbicaciones } = require('./actualizarUbicaciones');

const LINEAS = SERVICIOS.lineas;

const lineasDb = {
    buscarPorLinea(linea, callback) {
        data = fs.readFileSync('./lineas.db.json')
        let json = JSON.parse(data)
        return json[linea]
    }
};

const app = new express();

app.use(healthCheck);

app.get('/lineas/:linea', (req, res) => {
    const linea = req.params.linea;
    const estadoLinea = lineasDb.buscarPorLinea(linea);
    console.log('estado linea:')
    console.log(estadoLinea)
    if (estadoLinea === undefined) {
        res.sendStatus(404);
    } else {
        res.json(estadoLinea);
    }
});

app.listen(LINEAS.puerto, () => {
    console.log(`[${LINEAS.nombre}] escuchando en el puerto ${LINEAS.puerto}`);
    actualizarUbicaciones();
});
