# Práctica: _Cuando Viene_

## Dominio

Estamos a cargo de el desarrollo y mantenimiento de un sistema que nos permite saber cuál 
es el próximo colectivo de cada línea que va a pasar por mi parada.

Contamos con varios servicios que se encargan de distintos concerns: `lineas`, `paradas` y `cuando-viene`. Este último es el único que va a estar de cara a los usuarios, exponiendo una API REST.

Existe un cuarto componente, `monitoreo`, que nos sirve para conocer el estado del resto de los servicios. Éste expone una página web para ser visualizada por el equipo de infraestructura.
La misma utiliza [websockets](https://en.wikipedia.org/wiki/WebSocket) para ser notificada ante cambios en los estados. Debería poder soportar varias pestañas abiertas. 

## Objetivo
El código no se encuentra completo y en su mayoría no maneja flujo de errores. Se pide:

- Completar los servidores, detectar errores de control de flujo y corregirlos.
- Implementar manejo de errores
- Implementar timeouts de conexion en las requests HTTP.

## Pasos Sugeridos

 0. Utilizar la versión de Node correcta: `nvm use`. Si no están usando nvm, cualquier versión >= `12.9` sirve para esta práctica.
 1. Levantar cada servicio desde su respectiva carpeta (esto último es importante, ya que sino van a tener problemas para leer archivos con path relativos).
    * `cd $DIRECTORIO_DEL_SERVICIO`
    * `node $NOMBRE_DEL_SERVICIO`
 3. Completar código faltante para satisfacer `/cuando-viene/`
    * Implementar manejo de errores.
    * Implementar timeouts en las requests.
 4. Completar `monitoreo` para que las pantallas puedan ver el estado de los servicios.
    * ¿Qué diferencia hay entre un archivo de los servicios (ej: `paradas.js`) y el código JS del `index.html`?
    * ¿Qué diferencias hay entre comunicarse via requests HTTP y utilizar websockets?
 5. Configurar el timeout de las requests para que sea menor a la inestabilidad de la red.
    * Implementar mecanismo de retry 
        * con backoff lineal/exponencial (opcional)
 6. Bonus: Investigar sobre [Worker Threads](https://nodejs.org/api/worker_threads.html) y aplicarlos en el sistema
