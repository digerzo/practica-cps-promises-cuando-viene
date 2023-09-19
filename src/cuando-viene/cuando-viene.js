const express = require('express');
const { colectivoMasCercano1 } = require('../ubicacion.js');
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
        .then((responseParada) => {
            //console.log("Response de la parada: ", responseParada)
            Promise.all( responseParada.lineas.map(function(linea){
                return getPromisificado(SERVICIOS.lineas, PATH_LINEAS + linea)
            }))
            // 2.por cada linea de la parada, obtener info de la linea
            .then((responseLineas) => {    
                const ubicacionParada = responseParada.ubicacion
                const lineas = responseParada.lineas
                const lista = []   
                lineas.map((linea, indexLinea) => {
                    const responseLinea = responseLineas[indexLinea]
                    
                    const detalleDeLaLinea = {
                        linea,
                        colectivos: responseLinea.colectivos
                    }

                    //console.log("detalleDeLaLinea: ", detalleDeLaLinea)

                    // 3.por cada linea obtener el colectivoMasCercano
                    const colectivoMasCercano = colectivoMasCercano1(detalleDeLaLinea, ubicacionParada)
                    lista.push(colectivoMasCercano);  
                });
                // 4.devolver lista [ {linea: 15, tiempo: 30, patente: "asd-123"} ]
                console.log("lista: ", lista)
                //resolve(lista)  
                return lista              
            })    
        })
        .then((lista) => {
            res.send(lista)
        })
        .catch((error) => console.log(error));

    
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