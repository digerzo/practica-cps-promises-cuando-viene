const express = require('express');
const { healthCheck, inestabilidadDeRed } = require('../middleware');
const { SERVICIOS } = require('../config');

const PARADAS = SERVICIOS.paradas;

const app = new express();

app.use(healthCheck);
app.use(inestabilidadDeRed());

const paradas = {
    0: {
        ubicacion: 0,
        lineas: [15, 60],
    },
    3: {
        ubicacion: 30,
        lineas: [15, 184],
    },
    11: {
        ubicacion: 110,
        lineas: [15, 60, 720],
    },
};

app.get('/paradas/:parada', (req, res) => {
    const parada = req.params.parada;
    const detalleParada = paradas[parada];
    if (detalleParada === undefined) {
        return res.sendStatus(404);
    } else {
        res.json(detalleParada);
    }
});

app.listen(PARADAS.puerto, () => {
    console.log(`[${PARADAS.nombre}] escuchando en el puerto ${PARADAS.puerto}`);
});
