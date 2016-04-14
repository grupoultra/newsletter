# Ultra Newsletter - Backend
============================

Este modulo forma parte de la aplicació0n Ultra Newsletter y es el encargado de servir de intermediario entre el frontend y Amazon SES. Lleva a cabo las siguientes funciones:

- Registra usuarios en Amazon SES para Ultra
- Obtiene todos las direcciones verificadas
- Envía correos a cada una de las direcciones verificadas

# Requerimientos

Este proyecto asume que las siguientes herramientas están instaladas:

  * [NodeJS 0.12+](https://nodejs.org)
  * [Loopback Framework](http://loopback.io)
  * [MongoDB](https://www.mongodb.com)

# Instalación

Para instalar este modulo, primero, debe clonar el código desde el repositorio:

    $ git clone git@bitbucket.org:alexisibarra/ultra-newsletter.git

Ubicarse en la carpeta del modulo:
    
    $ cd backend

Instalar todas las dependencias:

    $ npm install

# Running (In development)

Puede correr el modulo con el siguiente comando:

    $ node .

