const express = require('express');
const { colectivoMasCercano } = require('../ubicacion');
const { get } = require('../request');
const { healthCheck } = require('../middleware.js');
const { SERVICIOS } = require('../config');

const TRANSITO = SERVICIOS.cuandoViene;
const URL_PARADAS = SERVICIOS.paradas.host + ":" +SERVICIOS.paradas.puerto
const PATH_PARADAS = "/paradas/"
const URL_LINEAS = SERVICIOS.lineas.host + ":" +SERVICIOS.lineas.puerto
const PATH_LINEAS = "/lineas/"

const app = new express();

app.use(healthCheck);

app.get('/cuando-viene/:parada', (req, res) => {
    const parada = req.params.parada;
    // 1.obtener info de la parada
    getPromisificado(SERVICIOS.paradas, PATH_PARADAS+parada)
        .then((response) => {
            let lineas = response.lineas
            // console.log(lineas)
            let promiseslineas = lineas.map((elemento) => {
                // console.log(elemento)
                getPromisificado(SERVICIOS.lineas, PATH_LINEAS + elemento)
            })
            console.log(promiseslineas)
            Promise.all(promiseslineas).then((result) => console.log(result))
        })

    
    // 2.por cada linea de la parada, obtener info de la linea
    // 3.por cada linea obtener el colectivoMasCercano
    // 4.devolver lista [ {linea: 15, tiempo: 30, patente: "asd-123"} ]
    // Queremos obtener, para cada linea de la parada, el próximo colectivo que va a llegar
});

app.listen(TRANSITO.puerto, () => {
    console.log(`[${TRANSITO.nombre}] escuchando en el puerto ${TRANSITO.puerto}`);
});


function getPromisificado(servicio, endpoint) {
    return new Promise((resolve, reject) => {
        get(
            servicio,
            endpoint, 
            (error, response) => {
                if (error) {
                    return reject(error)
                } else {
                    resolve(response)
                }
            }
        )
    })
}