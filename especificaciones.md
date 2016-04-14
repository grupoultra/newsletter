#Especificaciones funcionales

## Para el usuario

- Debe poder llenar un formulario con su nombre y correo electronico para crear el registro
- Debe, una vez listo el paso anterior, recibir un correo electronico en el cual tendra un link para confirmar
- Una vez confirmado, debe recibir un mensaje por pantalla y debe estar dado de alta en la lista de correos
- Debera recibir los correos que se envien a la lista

## Para la aplicacion
- Se debe desplegar el formulario para el usuario
- Se debe recibir la informacion del formulario y enviar un correo de confirmacion a la direccion proporcionada. Este correo debe contener un link a un endpoint de la aplicacion que permita confirmar el registro.
- Una vez confirmada la direccion de correo, este estara incluido junto con el resto para los futuros envios
- Se debe enviar correos masivos a la lista registrada
- Cada correo de la lista enviara un link para desuscribirse

#Preguntas
- Como va a crear el cliente cada correo?
- Que correo vamos a utilizar para enviar 
- Queremos que se pueda recibir respuesta?
