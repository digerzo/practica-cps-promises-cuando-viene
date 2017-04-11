#Propuesta de TP: Proximo Bus

Este TP consiste en detectar y corregir las fallas tanto arquitecturales como de implementacion, en este caso se puede optar por usar tanto cps como promises.

Existe más de una manera de encarar esta práctica... Depende del grupo el de tomar las decisiones de mejoras.


## Descripcion del dominio

Se tiene un sistema que permite a los usuarios conocer el estado de lineas de colectivos, si esta funcionando y cuando llega el proximo colectivo a una estacion.

Los clientes son en si nodos que solo tienen acceso a estas dos llamadas, y que solamente haran esta consulta al servidor que debera devolver el resultado a esa consulta.

Con respecto al servicio, este esta provisto por un servidor que hace peticion a estas consultas, y sobre este es usuario de un srvicio externo que posee el estado y la informacion actual de los colectivos.

El servicio tiene este comportamiento:

- Cada 55 segundos se actualizan el estado de las lineas
- Cada 30 segundos se actualiza el estado de cuando llegan los colectivos a destino
- Cuando se hace la solicitud del servidor que da respuesta a los clientes y este servidor con el estado el tiempo de respuesta puede ser de hasta 5 segs.


Los dos servidores que brindan el servicio a los usuarios estan conectados a un supervisor, con el que mantienen un canal para comunicar que ambos servidores estan conectados y vivos.


Se pide:

- Detectar errores de espera, o de funcionamiento no esperado
- Mejorar el código en algunos lados del servidor
- Ver si la arquitectura es la adecuada, que sucede si se cae un servidor
- Si se opta por usar el supervidor, ver de que se use adecuadamente.