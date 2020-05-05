const express = require('express');
const { colectivoMasCercano } = require('../ubicacion');
const { get } = require('../request');
const { healthCheck } = require('../middleware.js');
const { SERVICIOS } = require('../config');

const TRANSITO = SERVICIOS.cuandoViene;

const app = new express();

app.use(healthCheck);

app.get('/cuando-viene/:parada', (req, res) => {
    const parada = req.params.parada;

    // Queremos obtener, para cada linea de la parada, el próximo colectivo que va a llegar
});

app.listen(TRANSITO.puerto, () => {
    console.log(`[${TRANSITO.nombre}] escuchando en el puerto ${TRANSITO.puerto}`);
});

